from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Response
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import secrets
import requests
import json

# Setup logging
logging.basicConfig(level=logging.INFO)

# Supabase connection - Environment variables are injected by Vercel
supabase_url = os.environ.get("SUPABASE_URL", "https://flpxaxovqcpxzyotnvwe.supabase.co")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_key:
    logging.error("SUPABASE_KEY not set in environment!")
    # Fallback to the public key for limited functionality if necessary, 
    # but the 'Rosvel' persona requires the full key.
    supabase_key = "sb_publishable_ftR4a1zz0RU79mG2INJEPw_-OjFQrdq"

supabase: Client = create_client(supabase_url, supabase_key)

# Configure OpenRouter
openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")

# Create the main app for Vercel
app = FastAPI()

# Create a router with the /api prefix
# In Vercel, requests to /api/foo are routed to api/foo.py or api/index.py
# If we use a single index.py, we handle the sub-routing here.
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class Rate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sell_rate: float
    buy_rate: float
    currency: str = "USDT"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: str = "admin"

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

class BotChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    location: Optional[str] = "Unknown"

class FAQItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order_index: int = 0

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str = "Verified User"
    content: str
    rating: int = 5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== SECURITY ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

async def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    response = supabase.table("admin_sessions").select("*").eq("token", token).execute()
    
    if not response.data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return response.data[0]

# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "Rosvel")
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
    
    supabase.table("admin_sessions").insert(session).execute()
    
    return {
        "token": token,
        "username": credentials.username,
        "message": "Login successful"
    }

@api_router.post("/admin/logout")
async def admin_logout(session: dict = Depends(verify_admin_token)):
    supabase.table("admin_sessions").delete().eq("token", session["token"]).execute()
    return {"message": "Logged out successfully"}

# ==================== RATE MANAGEMENT ====================

@api_router.get("/rates/current")
async def get_current_rates(response: Response, currency: str = "USDT"):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    res = supabase.table("rates").select("*").eq("currency", currency.upper()).order("created_at", desc=True).limit(1).execute()
    
    if not res.data:
        # Emergency defaults
        return {
            "sell_rate": 573,
            "buy_rate": 598,
            "currency": currency.upper(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "emergency_fallback"
        }
    
    return res.data[0]

@api_router.put("/admin/rates")
async def update_rates(rate_update: RateUpdate, session: dict = Depends(verify_admin_token)):
    new_rate = {
        "sell_rate": rate_update.sell_rate,
        "buy_rate": rate_update.buy_rate,
        "currency": rate_update.currency.upper(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": session["username"]
    }
    result = supabase.table("rates").insert(new_rate).execute()
    return {"message": "Protocol Synced", "rate": result.data[0] if result.data else new_rate}

@api_router.get("/admin/rates/history")
async def get_rate_history(limit: int = 50, session: dict = Depends(verify_admin_token)):
    response = supabase.table("rates").select("*").order("created_at", desc=True).limit(limit).execute()
    return response.data

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
    supabase.table("contact_messages").insert(contact).execute()
    return {"message": "Message sent successfully"}

@api_router.get("/admin/contacts")
async def get_contact_messages(status: Optional[str] = None, session: dict = Depends(verify_admin_token)):
    query = supabase.table("contact_messages").select("*")
    if status:
        query = query.eq("status", status)
    response = query.order("created_at", desc=True).execute()
    return response.data

# ==================== FAQ MANAGEMENT ====================

@api_router.get("/faq")
async def get_faqs():
    response = supabase.table("faqs").select("*").order("order_index", desc=False).execute()
    return response.data

# ==================== TESTIMONIALS ====================

@api_router.get("/testimonials")
async def get_testimonials(limit: int = 200):
    response = supabase.table("testimonials").select("*").eq("approved", True).order("created_at", desc=True).limit(limit).execute()
    return response.data

@api_router.post("/testimonials")
async def submit_testimonial(testimonial: Testimonial):
    data = testimonial.dict()
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    data["approved"] = False
    supabase.table("testimonials").insert(data).execute()
    return {"message": "Testimonial submitted, pending review"}

# ==================== WHATSAPP BOT ====================

@api_router.post("/bot/chat")
async def bot_chat(request: BotChatRequest):
    if openrouter_api_key:
        try:
            # Fetch context
            rates_res = supabase.table("rates").select("*").eq("currency", "USDT").order("created_at", desc=True).limit(1).execute()
            latest_rate = {"sell": 573, "buy": 598}
            if rates_res.data:
                latest_rate = {"sell": rates_res.data[0]['sell_rate'], "buy": rates_res.data[0]['buy_rate']}

            system_prompt = f"ZaptoBot v2.1 context: Sell {latest_rate['sell']}, Buy {latest_rate['buy']} XAF/USDT. Locations: Douala, Yaoundé."
            
            headers = {"Authorization": f"Bearer {openrouter_api_key}", "Content-Type": "application/json"}
            payload = {
                "model": "google/gemini-2.0-flash-001",
                "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": request.message}]
            }
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, data=json.dumps(payload), timeout=10)
            
            if response.status_code == 200:
                return {"response": response.json()['choices'][0]['message']['content'].strip(), "source": "ai"}
        except:
            pass
    return {"response": "Protocol error. Please reach us on WhatsApp!", "source": "fallback"}

# ==================== HEALTH ====================

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "persona": "Rosvel", "version": "2.1.0"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
