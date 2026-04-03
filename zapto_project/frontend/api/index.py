from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Response
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
from datetime import datetime, timezone
import hashlib
import secrets
import requests

# Setup logging
logging.basicConfig(level=logging.INFO)

# Supabase connection via REST API
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://flpxaxovqcpxzyotnvwe.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

if not SUPABASE_KEY:
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscHhheG92cWNweHp5b3RudndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDY2MzksImV4cCI6MjA5MDI4MjYzOX0.gvUi7PFSlFA96QzLzYiR5zhmDwADawDf2T9PDRnMmLQ"

SUPABASE_REST = f"{SUPABASE_URL}/rest/v1"
SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Helper: Supabase REST queries
def sb_select(table, params=None):
    r = requests.get(f"{SUPABASE_REST}/{table}", headers=SUPABASE_HEADERS, params=params or {}, timeout=10)
    r.raise_for_status()
    return r.json()

def sb_insert(table, data):
    r = requests.post(f"{SUPABASE_REST}/{table}", headers=SUPABASE_HEADERS, json=data, timeout=10)
    r.raise_for_status()
    return r.json()

def sb_update(table, data, params):
    r = requests.patch(f"{SUPABASE_REST}/{table}", headers=SUPABASE_HEADERS, params=params, json=data, timeout=10)
    r.raise_for_status()
    return r.json() if r.text else []

def sb_delete(table, params):
    h = {**SUPABASE_HEADERS}
    r = requests.delete(f"{SUPABASE_REST}/{table}", headers=h, params=params, timeout=10)
    r.raise_for_status()
    return r.json() if r.text else []

def sb_upsert(table, data):
    h = {**SUPABASE_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation"}
    r = requests.post(f"{SUPABASE_REST}/{table}", headers=h, json=data, timeout=10)
    r.raise_for_status()
    return r.json()

# Create the main app for Vercel
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class RateUpdate(BaseModel):
    sell_rate: float
    buy_rate: float
    currency: str = "USDT"

class AdminLogin(BaseModel):
    username: str
    password: str

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

class Testimonial(BaseModel):
    name: str
    role: str = "Verified User"
    content: str
    rating: int = 5

class FAQItem(BaseModel):
    question: str
    answer: str
    order_index: int = 0

class SiteSettingUpdate(BaseModel):
    key: str
    value: str

class BotChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    location: Optional[str] = "Unknown"

# ==================== SECURITY ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

async def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    rows = sb_select("admin_sessions", {"token": f"eq.{token}", "select": "*"})
    
    if not rows:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return rows[0]

# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "rosvelmelong@gmail.com")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Draxx237?")
    ADMIN_PASSWORD_HASH = hash_password(ADMIN_PASSWORD)
    
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if hash_password(credentials.password) != ADMIN_PASSWORD_HASH:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = generate_token()
    session = {
        "token": token,
        "username": credentials.username,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    sb_insert("admin_sessions", session)
    
    return {
        "token": token,
        "username": credentials.username,
        "message": "Login successful"
    }

@api_router.post("/admin/logout")
async def admin_logout(session: dict = Depends(verify_admin_token)):
    sb_delete("admin_sessions", {"token": f"eq.{session['token']}"})
    return {"message": "Logged out successfully"}

# ==================== RATE MANAGEMENT ====================

@api_router.get("/rates/current")
async def get_current_rates(response: Response, currency: str = "USDT"):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    rows = sb_select("rates", {
        "currency": f"eq.{currency.upper()}",
        "select": "*",
        "order": "created_at.desc",
        "limit": "1"
    })
    
    if not rows:
        return {
            "sell_rate": 580,
            "buy_rate": 605,
            "currency": currency.upper(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "emergency_fallback"
        }
    
    return rows[0]

@api_router.put("/admin/rates")
async def update_rates(rate_update: RateUpdate, session: dict = Depends(verify_admin_token)):
    new_rate = {
        "sell_rate": rate_update.sell_rate,
        "buy_rate": rate_update.buy_rate,
        "currency": rate_update.currency.upper(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": session["username"]
    }
    result = sb_insert("rates", new_rate)
    return {"message": "Protocol Synced", "rate": result[0] if result else new_rate}

@api_router.get("/admin/rates/history")
async def get_rate_history(limit: int = 50, session: dict = Depends(verify_admin_token)):
    rows = sb_select("rates", {
        "select": "*",
        "order": "created_at.desc",
        "limit": str(limit)
    })
    return rows

# ==================== CONTACT MESSAGES ====================

@api_router.post("/contact")
async def submit_contact_message(message: ContactMessageCreate):
    contact = {
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    sb_insert("contact_messages", contact)
    return {"message": "Message sent successfully"}

@api_router.get("/admin/contacts")
async def get_contact_messages(status: Optional[str] = None, session: dict = Depends(verify_admin_token)):
    params = {"select": "*", "order": "created_at.desc"}
    if status:
        params["status"] = f"eq.{status}"
    rows = sb_select("contact_messages", params)
    return rows

# ==================== FAQ MANAGEMENT ====================

@api_router.get("/faq")
async def get_faqs():
    rows = sb_select("faqs", {"select": "*", "order": "order_index.asc"})
    return rows

@api_router.post("/admin/faq")
async def create_faq(faq: FAQItem, session: dict = Depends(verify_admin_token)):
    data = {"question": faq.question, "answer": faq.answer, "order_index": faq.order_index}
    data["id"] = str(uuid.uuid4())
    sb_insert("faqs", data)
    return {"message": "FAQ created"}

# ==================== TESTIMONIALS ====================

@api_router.get("/testimonials")
async def get_testimonials(limit: int = 200):
    rows = sb_select("testimonials", {
        "approved": "eq.true",
        "select": "*",
        "order": "created_at.desc",
        "limit": str(limit)
    })
    return rows

@api_router.get("/admin/testimonials/pending")
async def get_pending_testimonials(session: dict = Depends(verify_admin_token)):
    rows = sb_select("testimonials", {
        "approved": "eq.false",
        "select": "*",
        "order": "created_at.desc"
    })
    return rows

@api_router.put("/admin/testimonials/{id}/approve")
async def approve_testimonial(id: str, session: dict = Depends(verify_admin_token)):
    res = sb_update("testimonials", {"approved": True}, {"id": f"eq.{id}"})
    return {"message": "Testimonial approved", "data": res}

@api_router.delete("/admin/testimonials/{id}")
async def delete_testimonial(id: str, session: dict = Depends(verify_admin_token)):
    sb_delete("testimonials", {"id": f"eq.{id}"})
    return {"message": "Testimonial deleted"}

@api_router.post("/testimonials")
async def submit_testimonial(testimonial: Testimonial):
    data = {
        "name": testimonial.name,
        "role": testimonial.role,
        "content": testimonial.content,
        "rating": testimonial.rating,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved": False
    }
    sb_insert("testimonials", data)
    return {"message": "Testimonial submitted, pending review"}

# ==================== WHATSAPP BOT ====================

@api_router.get("/bot/responses")
async def get_bot_responses():
    rows = sb_select("bot_responses", {"is_active": "eq.true", "select": "*"})
    return rows

@api_router.post("/bot/chat")
async def bot_chat(request: BotChatRequest):
    return {"response": "Welcome to Zaptopay! How can I help you?", "source": "default"}

# ==================== TRANSACTIONS ====================

@api_router.get("/transactions")
async def get_transactions(limit: int = 20):
    rows = sb_select("transactions", {"select": "*", "order": "created_at.desc", "limit": str(limit)})
    return rows

# ==================== TEAM ====================

@api_router.get("/team")
async def get_team():
    rows = sb_select("team_members", {"select": "*"})
    return rows

# ==================== STATISTICS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(session: dict = Depends(verify_admin_token)):
    contacts_res = sb_select("contact_messages", {"select": "id"})
    faqs_res = sb_select("faqs", {"select": "id"})
    bot_res = sb_select("bot_responses", {"is_active": "eq.true", "select": "id"})
    
    rates = sb_select("rates", {
        "currency": "eq.USDT",
        "select": "*",
        "order": "created_at.desc",
        "limit": "1"
    })
    latest_rate = rates[0] if rates else {"sell_rate": 580, "buy_rate": 605}
    
    return {
        "total_contacts": len(contacts_res) if isinstance(contacts_res, list) else 0,
        "total_faqs": len(faqs_res) if isinstance(faqs_res, list) else 0,
        "active_bot_responses": len(bot_res) if isinstance(bot_res, list) else 0,
        "latest_rate": latest_rate
    }

# ==================== SITE SETTINGS ====================

@api_router.get("/settings")
async def get_site_settings():
    rows = sb_select("site_settings", {"select": "*"})
    if isinstance(rows, list):
        return {row["key"]: row["value"] for row in rows}
    return {}

@api_router.put("/admin/settings")
async def update_site_settings(updates: List[SiteSettingUpdate], session: dict = Depends(verify_admin_token)):
    for item in updates:
        sb_upsert("site_settings", {
            "key": item.key,
            "value": item.value,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    return {"message": "Settings updated successfully"}

# ==================== HEALTH ====================

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "persona": "Rosvel", "version": "2.2.1"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
