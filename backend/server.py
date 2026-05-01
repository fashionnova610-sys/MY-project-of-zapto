from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import secrets
import re
import requests
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    logging.error("SUPABASE_URL or SUPABASE_KEY not set in environment!")
    # For local dev fallback if not set yet, but should be set in .env
    supabase_url = "https://flpxaxovqcpxzyotnvwe.supabase.co"
    supabase_key = "sb_publishable_ftR4a1zz0RU79mG2INJEPw_-OjFQrdq" # Anon key

supabase: Client = create_client(supabase_url, supabase_key)

# Configure OpenRouter
openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
if not openrouter_api_key:
    logging.warning("OPENROUTER_API_KEY not set. AI features will be disabled.")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
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

class SiteSettingUpdate(BaseModel):
    key: str
    value: str

class BotChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    location: Optional[str] = "Unknown"

class FAQItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order_index: int = 0

class WhatsAppBotResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trigger_keywords: List[str]
    response_message: str
    is_active: bool = True

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str = "Verified User"
    content: str
    rating: int = 5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    amount_usd: float
    amount_xaf: float
    coin: str = "USDT"
    status: str = "completed"
    is_generated: bool = False
    tx_hash: Optional[str] = None


# ==================== SECURITY ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

async def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    # In a real app, use Supabase Auth. For now, we'll keep the admin_sessions approach in a table.
    response = supabase.table("admin_sessions").select("*").eq("token", token).execute()
    
    if not response.data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return response.data[0]


# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD_HASH = hash_password(os.environ.get("ADMIN_PASSWORD", "zaptopay2025"))
    
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
    
    # Needs to ensure admin_sessions table exists (I'll add it in migration)
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
    # Ensure fresh data by disabling all possible caching
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    # Query the absolute latest row based on created_at (Standard Supabase)
    res = supabase.table("rates").select("*").eq("currency", currency.upper()).order("created_at", desc=True).limit(1).execute()
    
    if not res.data:
        logging.warning(f"[Rates] No data found in database for {currency}. Serving emergency defaults.")
        # Minimal emergency defaults only if DB is empty
        defaults = {"USDT": {"sell": 580, "buy": 605}, "BTC": {"sell": 575, "buy": 610}}
        val = defaults.get(currency.upper(), {"sell": 580, "buy": 605})
        return {
            "sell_rate": val["sell"],
            "buy_rate": val["buy"],
            "currency": currency.upper(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "emergency_fallback"
        }
    
    current_rate = res.data[0]
    logging.info(f"[Rates] Serving LIVE data for {currency}: {current_rate['sell_rate']}/{current_rate['buy_rate']}")
    return current_rate

@api_router.put("/admin/rates")
async def update_rates(
    rate_update: RateUpdate,
    session: dict = Depends(verify_admin_token)
):
    new_rate = {
        "sell_rate": rate_update.sell_rate,
        "buy_rate": rate_update.buy_rate,
        "currency": rate_update.currency.upper(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": session["username"]
    }
    
    # Insert new row into history table
    result = supabase.table("rates").insert(new_rate).execute()
    
    logging.info(f"[Admin] Rates broadcasted by {session['username']}: {new_rate['currency']} -> S:{new_rate['sell_rate']} / B:{new_rate['buy_rate']}")
    
    return {
        "message": "Protocol Synced: New Rates Broadcasted successfully",
        "rate": result.data[0] if result.data else new_rate
    }

@api_router.get("/admin/rates/history")
async def get_rate_history(
    limit: int = 50,
    session: dict = Depends(verify_admin_token)
):
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
    
    # Auto-email to rosvelmelong@gmail.com
    # [TO BE IMPLEMENTED WITH aiosmtplib]
    
    return {"message": "Message sent successfully"}

@api_router.get("/admin/contacts")
async def get_contact_messages(
    status: Optional[str] = None,
    session: dict = Depends(verify_admin_token)
):
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

@api_router.post("/admin/faq")
async def create_faq(
    faq: FAQItem,
    session: dict = Depends(verify_admin_token)
):
    data = faq.dict()
    data.pop("id") # Let DB handle it or use the id we generated
    supabase.table("faqs").insert(data).execute()
    return {"message": "FAQ created"}


# ==================== TESTIMONIALS ====================

@api_router.get("/testimonials")
async def get_testimonials(limit: int = 200):
    response = supabase.table("testimonials").select("*").eq("approved", True).order("created_at", desc=True).limit(limit).execute()
    return response.data

@api_router.get("/admin/testimonials/pending")
async def get_pending_testimonials(session: dict = Depends(verify_admin_token)):
    response = supabase.table("testimonials").select("*").eq("approved", False).order("created_at", desc=True).execute()
    return response.data

@api_router.put("/admin/testimonials/{id}/approve")
async def approve_testimonial(id: str, session: dict = Depends(verify_admin_token)):
    response = supabase.table("testimonials").update({"approved": True}).eq("id", id).execute()
    return {"message": "Testimonial approved", "data": response.data}

@api_router.delete("/admin/testimonials/{id}")
async def delete_testimonial(id: str, session: dict = Depends(verify_admin_token)):
    supabase.table("testimonials").delete().eq("id", id).execute()
    return {"message": "Testimonial deleted"}

@api_router.post("/testimonials")
async def submit_testimonial(testimonial: Testimonial):
    data = testimonial.dict()
    # Ensure role is set if empty
    if not data.get("role"):
        data["role"] = "Verified User"
    
    # Simple spam protection/cleanup
    data["content"] = data["content"].strip()
    data["name"] = data["name"].strip()
    
    if len(data["content"]) < 3 or len(data["name"]) < 2:
        raise HTTPException(status_code=400, detail="Invalid submission")

    data["created_at"] = datetime.now(timezone.utc).isoformat()
    data["approved"] = False # Default to pending review
    supabase.table("testimonials").insert(data).execute()
    return {"message": "Testimonial submitted successfully, pending review", "testimonial": data}


# ==================== WHATSAPP BOT ====================

@api_router.get("/bot/responses")
async def get_bot_responses():
    response = supabase.table("bot_responses").select("*").eq("is_active", True).execute()
    return response.data

@api_router.post("/bot/chat")
async def bot_chat(request: BotChatRequest):
    user_msg = request.message.lower()
    
    # 1. Simple Keyword Matching Fallback
    local_responses = supabase.table("bot_responses").select("*").eq("is_active", True).execute()
    for resp in local_responses.data:
        for keyword in resp["trigger_keywords"]:
            if keyword.lower() in user_msg:
                return {"response": resp["response_message"], "source": "keyword"}

    # 2. AI Intelligence with OpenRouter
    if openrouter_api_key:
        try:
            # Fetch current rates for context
            latest_rate_res = supabase.table("rates").select("*").eq("currency", "USDT").order("created_at", desc=True).limit(1).execute()
            latest_rate = {"sell": 580, "buy": 605}
            if latest_rate_res.data:
                latest_rate = {"sell": latest_rate_res.data[0]['sell_rate'], "buy": latest_rate_res.data[0]['buy_rate']}

            system_prompt = f"""
            You are ZaptoBot, the elite AI Assistant for Zaptopay (v2.1). 
            Zaptopay is the #1 platform in Africa for exchanging Crypto (USDT, BTC, ETH, SOL, BNB) for XAF (CFA Francs).

            WEBSITE KNOWLEDGE BASE:
            - Location: Based in Douala and Yaoundé, Cameroon. Serving West Africa.
            - Services: Buy and Sell crypto for XAF.
            - Payout Methods: MTN Mobile Money, Orange Money, Bank Transfer.
            - Speed: Transactions in 5-15 minutes ("Light Speed").
            - Security: 100% Secure, Trusted by thousands.

            CURRENT LIVE MARKET RATES (USDT/XAF):
            🟢 WE BUY FROM USER AT: {latest_rate['sell']} XAF / 1 USDT
            🔴 WE SELL TO USER AT: {latest_rate['buy']} XAF / 1 USDT
            
            INSTRUCTIONS:
            1. **ESTIMATION**: If user mentions an amount (e.g., "$100" or "50 USDT"), calculate the XAF equivalent manually using the rates above.
               - If they are SELLING to us (e.g., "I have 100 USDT"), use {latest_rate['sell']} XAF.
               - If they are BUYING from us (e.g., "I need $50"), use {latest_rate['buy']} XAF.
            2. **TONE**: Swift, professional, uses emojis (⚡, 💸, 🔒).
            3. **LIMITS**: Max 4 sentences.
            4. **LANGUAGE**: Detect language. Respond in French if user uses French.
            """
            
            headers = {
                "Authorization": f"Bearer {openrouter_api_key}",
                "HTTP-Referer": "https://zaptopay.online", # Required for OpenRouter
                "X-Title": "Zaptopay AI Agent",        # Optional for OpenRouter
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "google/gemini-2.0-flash-001", # High quality, fast choice
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": request.message}
                ],
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                data=json.dumps(payload),
                timeout=15
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_msg = result['choices'][0]['message']['content']
                return {"response": ai_msg.strip(), "source": "openrouter", "rate_used": latest_rate}
            else:
                logging.error(f"OpenRouter Error: {response.text}")
                return {"response": "I'm having a protocol sync issue. Please ask me about rates or contact support!", "source": "error"}
                
        except Exception as e:
            logging.error(f"AI Exception: {e}")
            return {"response": "I'm having trouble processing that right now. Please try again or head to WhatsApp support!", "source": "fallback"}
    
    return {"response": "Welcome to Zaptopay! How can I help you with your crypto exchange today?", "source": "default"}


# ==================== TRANSACTIONS (Public Ledger) ====================

@api_router.get("/transactions")
async def get_transactions(limit: int = 20):
    response = supabase.table("transactions").select("*").order("created_at", desc=True).limit(limit).execute()
    return response.data


# ==================== TEAM ====================

@api_router.get("/team")
async def get_team():
    response = supabase.table("team_members").select("*").execute()
    return response.data


# ==================== STATISTICS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(session: dict = Depends(verify_admin_token)):
    # Simple count using Supabase REST is a bit verbose, but fine for now
    contacts_res = supabase.table("contact_messages").select("id", count="exact").execute()
    faqs_res = supabase.table("faqs").select("id", count="exact").execute()
    bot_res = supabase.table("bot_responses").select("id", count="exact").eq("is_active", True).execute()
    
    latest_rate = await get_current_rates()
    
    return {
        "total_contacts": contacts_res.count if contacts_res.count else 0,
        "total_faqs": faqs_res.count if faqs_res.count else 0,
        "active_bot_responses": bot_res.count if bot_res.count else 0,
        "latest_rate": latest_rate
    }


# ==================== SITE SETTINGS ====================

@api_router.get("/settings")
async def get_site_settings():
    response = supabase.table("site_settings").select("*").execute()
    # Return as a key-value dict for easy frontend consumption
    settings = {row["key"]: row["value"] for row in response.data}
    return settings

@api_router.put("/admin/settings")
async def update_site_settings(
    updates: List[SiteSettingUpdate],
    session: dict = Depends(verify_admin_token)
):
    for item in updates:
        supabase.table("site_settings").upsert({
            "key": item.key,
            "value": item.value,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }, on_conflict="key").execute()

    return {"message": "Settings updated successfully"}


# ==================== BASIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Zaptopay API Powered by Supabase", "version": "2.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
