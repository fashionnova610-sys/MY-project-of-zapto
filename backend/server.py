from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

class Rate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sell_rate: float  # Rate when user sells crypto to us
    buy_rate: float   # Rate when user buys crypto from us
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

class AdminSession(BaseModel):
    token: str
    username: str
    created_at: datetime

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"  # new, read, replied

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

class FAQItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0

class WhatsAppBotResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trigger_keywords: List[str]
    response_message: str
    is_active: bool = True


# ==================== SECURITY ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

async def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    session = await db.admin_sessions.find_one({"token": token}, {"_id": 0})
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return session


# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    # Default admin credentials (change these!)
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD_HASH = hash_password(os.environ.get("ADMIN_PASSWORD", "zaptopay2025"))
    
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if hash_password(credentials.password) != ADMIN_PASSWORD_HASH:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    token = generate_token()
    session = {
        "token": token,
        "username": credentials.username,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.admin_sessions.insert_one(session)
    
    return {
        "token": token,
        "username": credentials.username,
        "message": "Login successful"
    }

@api_router.post("/admin/logout")
async def admin_logout(session: dict = Depends(verify_admin_token)):
    await db.admin_sessions.delete_one({"token": session["token"]})
    return {"message": "Logged out successfully"}


# ==================== RATE MANAGEMENT ====================

@api_router.get("/rates/current")
async def get_current_rates():
    """Public endpoint - get current exchange rates"""
    rate = await db.rates.find_one(
        {"currency": "USDT"},
        {"_id": 0},
        sort=[("updated_at", -1)]
    )
    
    if not rate:
        # Return default rates if none exist
        return {
            "sell_rate": 573,
            "buy_rate": 598,
            "currency": "USDT",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    
    return rate

@api_router.put("/admin/rates")
async def update_rates(
    rate_update: RateUpdate,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - update exchange rates"""
    new_rate = Rate(
        sell_rate=rate_update.sell_rate,
        buy_rate=rate_update.buy_rate,
        currency=rate_update.currency,
        updated_by=session["username"]
    )
    
    await db.rates.insert_one(new_rate.dict())
    
    return {
        "message": "Rates updated successfully",
        "rate": new_rate.dict()
    }

@api_router.get("/admin/rates/history")
async def get_rate_history(
    limit: int = 50,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - get rate change history"""
    rates = await db.rates.find(
        {},
        {"_id": 0}
    ).sort("updated_at", -1).limit(limit).to_list(limit)
    
    return rates


# ==================== CONTACT MESSAGES ====================

@api_router.post("/contact")
async def submit_contact_message(message: ContactMessageCreate):
    """Public endpoint - submit contact form"""
    contact = ContactMessage(**message.dict())
    await db.contact_messages.insert_one(contact.dict())
    
    return {
        "message": "Message sent successfully",
        "id": contact.id
    }

@api_router.get("/admin/contacts")
async def get_contact_messages(
    status: Optional[str] = None,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - get contact messages"""
    query = {}
    if status:
        query["status"] = status
    
    messages = await db.contact_messages.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return messages

@api_router.patch("/admin/contacts/{message_id}/status")
async def update_contact_status(
    message_id: str,
    status: str,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - update message status"""
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Status updated"}


# ==================== FAQ MANAGEMENT ====================

@api_router.get("/faq")
async def get_faqs():
    """Public endpoint - get all FAQs"""
    faqs = await db.faqs.find(
        {},
        {"_id": 0}
    ).sort("order", 1).to_list(100)
    
    return faqs

@api_router.post("/admin/faq")
async def create_faq(
    faq: FAQItem,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - create FAQ"""
    await db.faqs.insert_one(faq.dict())
    return {"message": "FAQ created", "faq": faq.dict()}

@api_router.put("/admin/faq/{faq_id}")
async def update_faq(
    faq_id: str,
    faq: FAQItem,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - update FAQ"""
    result = await db.faqs.update_one(
        {"id": faq_id},
        {"$set": faq.dict()}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return {"message": "FAQ updated"}

@api_router.delete("/admin/faq/{faq_id}")
async def delete_faq(
    faq_id: str,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - delete FAQ"""
    result = await db.faqs.delete_one({"id": faq_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return {"message": "FAQ deleted"}


# ==================== WHATSAPP BOT ====================

@api_router.get("/bot/responses")
async def get_bot_responses():
    """Public endpoint - get active bot responses"""
    responses = await db.bot_responses.find(
        {"is_active": True},
        {"_id": 0}
    ).to_list(100)
    
    return responses

@api_router.post("/admin/bot/response")
async def create_bot_response(
    response: WhatsAppBotResponse,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - create bot auto-response"""
    await db.bot_responses.insert_one(response.dict())
    return {"message": "Bot response created", "response": response.dict()}

@api_router.get("/admin/bot/responses")
async def get_all_bot_responses(
    session: dict = Depends(verify_admin_token)
):
    """Admin only - get all bot responses"""
    responses = await db.bot_responses.find(
        {},
        {"_id": 0}
    ).to_list(100)
    
    return responses

@api_router.put("/admin/bot/response/{response_id}")
async def update_bot_response(
    response_id: str,
    response: WhatsAppBotResponse,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - update bot response"""
    result = await db.bot_responses.update_one(
        {"id": response_id},
        {"$set": response.dict()}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Response not found")
    
    return {"message": "Bot response updated"}

@api_router.delete("/admin/bot/response/{response_id}")
async def delete_bot_response(
    response_id: str,
    session: dict = Depends(verify_admin_token)
):
    """Admin only - delete bot response"""
    result = await db.bot_responses.delete_one({"id": response_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Response not found")
    
    return {"message": "Bot response deleted"}


# ==================== STATISTICS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(session: dict = Depends(verify_admin_token)):
    """Admin only - get dashboard statistics"""
    total_contacts = await db.contact_messages.count_documents({})
    new_contacts = await db.contact_messages.count_documents({"status": "new"})
    total_faqs = await db.faqs.count_documents({})
    active_bot_responses = await db.bot_responses.count_documents({"is_active": True})
    
    # Get latest rate
    latest_rate = await db.rates.find_one(
        {"currency": "USDT"},
        {"_id": 0},
        sort=[("updated_at", -1)]
    )
    
    return {
        "total_contacts": total_contacts,
        "new_contacts": new_contacts,
        "total_faqs": total_faqs,
        "active_bot_responses": active_bot_responses,
        "latest_rate": latest_rate
    }


# ==================== BASIC ROUTES ====================

@api_router.get("/")
async def root():
    return {
        "message": "Zaptopay API",
        "version": "1.0.0",
        "status": "operational"
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
