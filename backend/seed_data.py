import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import hashlib

# Connect to MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zaptopay')]

async def seed_data():
    print("🌱 Seeding Zaptopay database...")
    
    # 1. Seed initial rates
    print("📊 Adding initial exchange rates...")
    initial_rate = {
        "id": "initial-rate-001",
        "sell_rate": 573.0,
        "buy_rate": 598.0,
        "currency": "USDT",
        "updated_at": datetime.now(timezone.utc),
        "updated_by": "system"
    }
    await db.rates.insert_one(initial_rate)
    print("✅ Initial rates added")
    
    # 2. Seed FAQs
    print("❓ Adding FAQ items...")
    faqs = [
        {
            "id": "faq-001",
            "question": "How long does a transaction take?",
            "answer": "Most transactions are completed in under 2 minutes. Our verified agents process your request immediately upon receiving your message.",
            "order": 1
        },
        {
            "id": "faq-002",
            "question": "What cryptocurrencies do you support?",
            "answer": "We currently support USDT (TRC20/BEP20), Bitcoin (BTC), and Ethereum (ETH). Contact us for other cryptocurrencies.",
            "order": 2
        },
        {
            "id": "faq-003",
            "question": "Is Zaptopay safe and secure?",
            "answer": "Yes! We use bank-level security protocols. All transactions are verified, and we have a proven track record of safe, reliable exchanges.",
            "order": 3
        },
        {
            "id": "faq-004",
            "question": "What are your operating hours?",
            "answer": "We operate 24/7! Our agents are available around the clock to process your crypto-to-XAF exchanges.",
            "order": 4
        },
        {
            "id": "faq-005",
            "question": "What payment methods do you accept?",
            "answer": "We support Mobile Money (MTN MoMo, Orange Money) for XAF transfers. For crypto, we accept wallet transfers.",
            "order": 5
        },
        {
            "id": "faq-006",
            "question": "Do you charge any fees?",
            "answer": "Our rates are all-inclusive. The rate you see is the rate you get - no hidden fees or surprises.",
            "order": 6
        }
    ]
    await db.faqs.insert_many(faqs)
    print(f"✅ Added {len(faqs)} FAQ items")
    
    # 3. Seed WhatsApp Bot Responses
    print("🤖 Adding WhatsApp bot auto-responses...")
    bot_responses = [
        {
            "id": "bot-001",
            "trigger_keywords": ["hello", "hi", "hey", "bonjour", "salut"],
            "response_message": "👋 Hello! Welcome to Zaptopay. I'm here to help you with crypto-to-XAF exchanges. What would you like to do today?\n\n📊 Current rates:\n🟢 Sell: 573 XAF/$\n🔴 Buy: 598 XAF/$\n\nJust tell me: 'I want to sell $X' or 'I want to buy $X'",
            "is_active": True
        },
        {
            "id": "bot-002",
            "trigger_keywords": ["rate", "rates", "price", "prix", "taux"],
            "response_message": "📊 TODAY'S LIVE RATES (USDT):\n\n🟢 YOU SELL to us: 573 XAF/$\n🔴 YOU BUY from us: 598 XAF/$\n\nRates updated daily. Ready to trade? Just tell me the amount!",
            "is_active": True
        },
        {
            "id": "bot-003",
            "trigger_keywords": ["how", "comment", "process", "steps"],
            "response_message": "✨ HOW IT WORKS:\n\n1️⃣ Tell me what you need (e.g., 'I want to sell $100 USDT')\n2️⃣ I'll give you payment details\n3️⃣ Send crypto/money\n4️⃣ Receive your XAF/crypto in under 2 minutes!\n\nIt's that simple! What would you like to do?",
            "is_active": True
        },
        {
            "id": "bot-004",
            "trigger_keywords": ["safe", "secure", "trust", "scam", "sûr", "sécurisé"],
            "response_message": "🔒 SECURITY & TRUST:\n\n✅ Verified business\n✅ 1000+ successful transactions\n✅ Bank-level security\n✅ Real agents, real support\n✅ Transparent rates\n\nYour safety is our priority. Ready to trade securely?",
            "is_active": True
        },
        {
            "id": "bot-005",
            "trigger_keywords": ["time", "fast", "quick", "rapide", "temps"],
            "response_message": "⚡ TRANSACTION SPEED:\n\nMost transactions complete in UNDER 2 MINUTES!\n\n⏱️ Average time: 90 seconds\n🚀 We're the fastest in Cameroon\n\nReady for instant service? Tell me what you need!",
            "is_active": True
        },
        {
            "id": "bot-006",
            "trigger_keywords": ["support", "help", "problem", "issue", "aide"],
            "response_message": "💬 NEED HELP?\n\nI'm here 24/7! Tell me your issue and I'll assist you immediately.\n\nCommon questions:\n• Transaction status\n• Rate inquiries\n• Payment issues\n• Account questions\n\nWhat can I help you with?",
            "is_active": True
        }
    ]
    await db.bot_responses.insert_many(bot_responses)
    print(f"✅ Added {len(bot_responses)} bot auto-responses")
    
    print("\n🎉 Database seeding complete!")
    print("\n📝 ADMIN CREDENTIALS:")
    print("   Username: admin")
    print("   Password: zaptopay2025")
    print("   ⚠️  CHANGE THESE IN PRODUCTION!")
    print("\n🔗 Access admin dashboard at: /admin")

if __name__ == "__main__":
    asyncio.run(seed_data())
    print("\n✨ All done! Your Zaptopay system is ready.")
