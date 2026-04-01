import os
import asyncio
import random
import secrets
from supabase import create_client, Client
from datetime import datetime, timezone, timedelta
import uuid

# Supabase connection
# Priority: Environment variables > server.py fallback constants
supabase_url = os.environ.get("SUPABASE_URL", "https://flpxaxovqcpxzyotnvwe.supabase.co")
supabase_key = os.environ.get("SUPABASE_KEY", "sb_publishable_ftR4a1zz0RU79mG2INJEPw_-OjFQrdq")

supabase: Client = create_client(supabase_url, supabase_key)

async def seed_data():
    print("Seeding Zaptopay (Supabase) database...")
    
    # 1. Seed initial rates
    print("Adding initial exchange rates...")
    initial_rate = {
        "sell_rate": 580.0,
        "buy_rate": 605.0,
        "currency": "USDT",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": "system"
    }
    try:
        supabase.table("rates").insert(initial_rate).execute()
        print("Initial rates added")
    except Exception as e:
        print(f"Error adding rates: {e}")
    
    # 2. Seed FAQs
    print("Adding FAQ items...")
    faqs = [
        {
            "question": "How long does a transaction take?",
            "answer": "Most transactions are completed in under 2 minutes. Our verified agents process your request immediately upon receiving your message.",
            "order_index": 1
        },
        {
            "question": "What cryptocurrencies do you support?",
            "answer": "We currently support USDT (TRC20/BEP20), Bitcoin (BTC), and Ethereum (ETH). Contact us for other cryptocurrencies.",
            "order_index": 2
        },
        {
            "question": "Is Zaptopay safe and secure?",
            "answer": "Yes! We use bank-level security protocols. All transactions are verified, and we have a proven track record of safe, reliable exchanges.",
            "order_index": 3
        },
        {
            "question": "What are your operating hours?",
            "answer": "We operate 24/7! Our agents are available around the clock to process your crypto-to-XAF exchanges.",
            "order_index": 4
        },
        {
            "question": "What payment methods do you accept?",
            "answer": "We support Mobile Money (MTN MoMo, Orange Money) for XAF transfers. For crypto, we accept wallet transfers.",
            "order_index": 5
        },
        {
            "question": "Do you charge any fees?",
            "answer": "Our rates are all-inclusive. The rate you see is the rate you get - no hidden fees or surprises.",
            "order_index": 6
        }
    ]
    try:
        supabase.table("faqs").insert(faqs).execute()
        print(f"Added {len(faqs)} FAQ items")
    except Exception as e:
        print(f"Error adding FAQs: {e}")
    
    # 3. Seed WhatsApp Bot Responses
    print("Adding WhatsApp bot auto-responses...")
    bot_responses = [
        {
            "trigger_keywords": ["hello", "hi", "hey", "bonjour", "salut"],
            "response_message": "👋 Hello! Welcome to Zaptopay. I'm here to help you with crypto-to-XAF exchanges. What would you like to do today?\n\n📊 Current rates:\n🟢 Sell: 580 XAF/$\n🔴 Buy: 605 XAF/$\n\nJust tell me: 'I want to sell $X' or 'I want to buy $X'",
            "is_active": True
        },
        {
            "trigger_keywords": ["rate", "rates", "price", "prix", "taux"],
            "response_message": "📊 TODAY'S LIVE RATES (USDT):\n\n🟢 YOU SELL to us: 580 XAF/$\n🔴 YOU BUY from us: 605 XAF/$\n\nRates updated daily. Ready to trade? Just tell me the amount!",
            "is_active": True
        },
        {
            "trigger_keywords": ["how", "comment", "process", "steps"],
            "response_message": "✨ HOW IT WORKS:\n\n1️⃣ Tell me what you need (e.g., 'I want to sell $100 USDT')\n2️⃣ I'll give you payment details\n3️⃣ Send crypto/money\n4️⃣ Receive your XAF/crypto in under 2 minutes!\n\nIt's that simple! What would you like to do?",
            "is_active": True
        },
        {
            "trigger_keywords": ["safe", "secure", "trust", "scam", "sûr", "sécurisé"],
            "response_message": "🔒 SECURITY & TRUST:\n\n✅ Verified business\n✅ 1000+ successful transactions\n✅ Bank-level security\n✅ Real agents, real support\n✅ Transparent rates\n\nYour safety is our priority. Ready to trade securely?",
            "is_active": True
        },
        {
            "trigger_keywords": ["time", "fast", "quick", "rapide", "temps"],
            "response_message": "⚡ TRANSACTION SPEED:\n\nMost transactions complete in UNDER 2 MINUTES!\n\n⏱️ Average time: 90 seconds\n🚀 We're the fastest in Cameroon\n\nReady for instant service? Tell me what you need!",
            "is_active": True
        },
        {
            "trigger_keywords": ["support", "help", "problem", "issue", "aide"],
            "response_message": "💬 NEED HELP?\n\nI'm here 24/7! Tell me your issue and I'll assist you immediately.\n\nCommon questions:\n• Transaction status\n• Rate inquiries\n• Payment issues\n• Account questions\n\nWhat can I help you with?",
            "is_active": True
        }
    ]
    try:
        supabase.table("bot_responses").insert(bot_responses).execute()
        print(f"Added {len(bot_responses)} bot auto-responses")
    except Exception as e:
        print(f"Error adding bot responses: {e}")
    
    # 4. Seed Team Members
    print("Adding team information...")
    team = [
        {
            "name": "Rosvel Melong",
            "role": "Founder & CEO",
            "bio": "Visionary leader bridging the gap between digital assets and local currency for Africa.",
            "image_url": "/assets/founder.jpg"
        }
    ]
    try:
        supabase.table("team_members").insert(team).execute()
        print("Team info added")
    except Exception as e:
        print(f"Error adding team members: {e}")

    # 5. Clean up old data (handled via SQL, but good to have here)
    # 6. Seed Testimonials (100+ Cameroon names)
    print("Generating 105 realistic Cameroon testimonials...")
    names = [
        "Moussa", "Abamba", "Nkwenti", "Tanyi", "Fote", "Kamga", "Essomba", "Atangana", "Zebaze", "Fokam",
        "Eboa", "Mvondo", "Ngapeth", "Che", "Tiku", "Balla", "Onana", "Abega", "Njoh", "Luma",
        "Sande", "Babila", "Tendo", "Wandji", "Nounkeu", "Tchuente", "Dongmo", "Mbah", "Fossuo", "Simo",
        "Jato", "Ngong", "Wankah", "Teh", "Kouam", "Tagne", "Fotso", "Deffo", "Kamdem", "Sikati",
        "Kuete", "Talla", "Momo", "Tidjo", "Nguele", "Ewane", "Mpondo", "Sende", "Libih", "Kunde",
        "Omam", "Biyik", "Milla", "Akono", "Song", "Njitap", "Mboma", "Eto'o", "Kameni", "Nkoulou",
        "Matip", "Mbia", "Anguissa", "Aboubakar", "Toko", "Ekambi", "Choupo", "Moting", "Onana", "Ngadeu",
        "Castelletto", "Tolo", "Fai", "Gouet", "Hongla", "Mbeumo", "Ntcham", "Kunde", "Malong", "Gwan",
        "Enow", "Tabi", "Bisong", "Ayuk", "Besong", "Takang", "Nkongho", "Agbor", "Egbe", "Arrey",
        "Ebai", "Orock", "Tabot", "Eta", "Ebot", "Ako", "Ashu", "Eyong", "Mbi", "Tataw",
        "Ndip", "Akem", "Acho", "Fon", "Niba"
    ]
    suffixes = ["Jr", "Sr", "III", ""]
    praise = [
        "Extremely fast and reliable!", "Best crypto service in Douala/Yaoundé.", "Saved me a lot of time and hassle.",
        "Smooth transaction, 100% trusted.", "Very professional agent, received my XAF in 2 mins.",
        "Zaptopay is the future of exchange.", "Highly recommended for massive swaps.",
        "I was skeptical but they delivered instantly.", "Easy to use WhatsApp bot, good rates.",
        "Fair prices and great support.", "Fastest withdrawal I've seen in Cameroon.",
        "Professional service and secure protocol.", "I always use Zapto for my USDT sales.",
        "Top-notch liquidity. Never a delay.", "Excellent customer service from the team."
    ]
    
    testimonials = []
    for i in range(105):
        name = f"{random.choice(names)} {random.choice(names)} {random.choice(suffixes)}".strip()
        testimonials.append({
            "name": name,
            "role": random.choice(["Trader", "Merchant", "Freelancer", "VIP User", "Investor", "Business Owner"]),
            "content": random.choice(praise),
            "rating": random.choice([5, 5, 5, 4]),
            "approved": True,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).isoformat()
        })
        
    try:
        supabase.table("testimonials").insert(testimonials).execute()
        print(f"Added {len(testimonials)} realistic Cameroon testimonials")
    except Exception as e:
        print(f"Error adding testimonials: {e}")

    # 7. Seed Public Ledger (Transactions)
    print("Generating 40 realistic public ledger data entries...")
    
    def generate_transaction(is_recent=False):
        coin = random.choice(['USDT', 'BTC', 'ETH', 'SOL', 'BCH'])
        if is_recent:
            hours_ago = random.uniform(0.1, 3.0)
        else:
            hours_ago = random.uniform(4.0, 72.0)
        
        timestamp = (datetime.now(timezone.utc) - timedelta(hours=hours_ago)).isoformat()
        amount_usd = round(random.uniform(50, 5000), 2)
        USD_XAF_RATE = 580
        amount_xaf = round(amount_usd * USD_XAF_RATE)
        
        return {
            "id": str(uuid.uuid4()),
            "created_at": timestamp,
            "amount_usd": amount_usd,
            "amount_xaf": amount_xaf,
            "coin": coin,
            "status": "completed",
            "is_generated": True,
            "tx_hash": secrets.token_hex(32)
        }

    transactions = []
    for _ in range(10):
        transactions.append(generate_transaction(is_recent=True))
    for _ in range(30):
        transactions.append(generate_transaction(is_recent=False))
    
    transactions.sort(key=lambda x: x["created_at"], reverse=True)
    
    try:
        supabase.table("transactions").insert(transactions).execute()
        print(f"Generated {len(transactions)} realistic transactions")
    except Exception as e:
        print(f"Error adding transactions: {e}")

    print("\nSupabase seeding complete!")
    print("\n📝 ADMIN CREDENTIALS:")
    print("   Username: admin")
    print("   Password: zaptopay2025")
    print("   WARNING: CHANGE THESE IN PRODUCTION!")
    print("\n🔗 Access admin dashboard at: /admin")

if __name__ == "__main__":
    asyncio.run(seed_data())
    print("\nAll done! Your Zaptopay system is ready.")
