# 🎉 Zaptopay Complete System Documentation (v2.2.0 'Institutional Hybrid')

## 🔐 Admin Access

### Admin Dashboard Credentials

- **Username**: `admin`
- **Password**: `zaptopay2025`
- **⚠️ IMPORTANT**: Change these credentials in production!

### How to Change Admin Password

1. Set environment variables in `/app/backend/.env`:

   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```

2. Restart the backend service

---

## 🚀 Features Implemented

### 1. Interactive Hero Section ✅

- **Live Amount Input**: Users can type the amount they want to trade
- **Sell/Buy Toggle**: Switch between selling and buying crypto
- **Instant Quote**: Real-time XAF calculation as user types
- **Smart WhatsApp Integration**: Pre-fills message with user's amount and action
- **3D Spline Background**: Fully visible, high-performance liquid monolith background

### 2. Live Crypto Price Tracker ✅

- **Real-time Prices**: Fetches live prices from CoinGecko API
- **Supported Coins**: Bitcoin (BTC), Ethereum (ETH), Tether (USDT), BNB
- **24h Change**: Shows price movement with up/down indicators
- **Auto-refresh**: Updates every 60 seconds
- **Manual Refresh**: Button to refresh prices on demand

### 3. Enhanced Rate Calculator ✅

- **Multi-Crypto Support**: Calculate for USDT, BTC, or ETH
- **Live Crypto Prices**: Uses real-time market prices
- **Your XAF Rates**: Combines live crypto prices with your custom XAF rates
- **Accurate Calculations**:
  - Sell: `crypto_amount × crypto_price × xaf_sell_rate`
  - Buy: `crypto_amount × crypto_price × xaf_buy_rate`
- **Breakdown Display**: Shows crypto price and XAF rate used

### 4. WhatsApp Preview Modal ✅

- **Message Preview**: See the message before sending
- **Editable**: Users can modify the message
- **Professional UI**: Looks like WhatsApp interface
- **Agent Status**: Shows "Agent available • Responds in ~2 min"

### 5. Admin Dashboard Backend ✅

- **Rate Management**: Update USDT sell/buy rates daily
- **Rate History**: View all rate changes with timestamps
- **Contact Messages**: Manage user inquiries
- **FAQ Management**: Create, edit, delete FAQs
- **Bot Responses**: Manage WhatsApp auto-replies
- **Statistics**: Dashboard with key metrics

### 6. WhatsApp Bot System ✅

- **Auto-Responses**: Dynamic rate synchronization with admin settings
- **Keyword Triggers**: Responds to greetings, rate inquiries, how-to, security, speed, support
- **Customizable**: Admin can add/edit/delete responses
- **Active/Inactive Toggle**: Enable/disable specific responses

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

#### Get Current Rates

```
GET /api/rates/current
```

**Response:**

```json
{
  "sell_rate": 580,
  "buy_rate": 605,
  "currency": "USDT",
  "updated_at": "2025-03-28T12:00:00Z"
}
```

#### Submit Contact Message

```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

#### Get FAQs

```
GET /api/faq
```

#### Get Bot Responses

```
GET /api/bot/responses
```

---

### Admin Endpoints (Require Bearer Token)

#### Admin Login

```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "zaptopay2025"
}
```

**Response:**

```json
{
  "token": "abc123...",
  "username": "admin",
  "message": "Login successful"
}
```

#### Update Rates

```
PUT /api/admin/rates
Authorization: Bearer <token>
Content-Type: application/json

{
  "sell_rate": 580,
  "buy_rate": 605,
  "currency": "USDT"
}
```

---

## 🔧 Technical Details

### Frontend Components

- `MainTitle.js` - Hero section with 3D Spline background and interactive input
- `Crypto3DScroller.js` - 3D diagonal marquee for crypto assets
- `CryptoTracker.js` - Live crypto price display
- `EnhancedRateCalculator.js` - Smart calculator with live prices
- `WhatsAppBotWidget.js` - Dynamic bot widget with rate synchronization
- `FounderSection.js` - Restored founder section with official asset
- `FAQAccordion.js` - Mobile-optimized FAQ component

### Backend

- `server.py` - FastAPI backend powered by Supabase
- `seed_data.py` - Supabase-native database initialization script

### Database Collections (Supabase Tables)

- `rates` - Exchange rate history
- `admin_sessions` - Admin authentication tokens
- `contact_messages` - User inquiries
- `faqs` - Frequently asked questions
- `bot_responses` - WhatsApp auto-reply configurations
- `team_members` - Team and founder profile data

---

## 🎨 Design Features

### Colors

- **Vault Navy**: #0a0e27 (primary background)
- **Charcoal**: #1a1f3a (secondary background)
- **Zap Green**: #00ff88 (primary accent)
- **Electric Blue**: #00d4ff (secondary accent)

### Effects

- **Glassmorphism**: Frosted glass effect with backdrop-blur
- **Glow Effects**: Text shadows and box shadows with brand colors
- **Smooth Animations**: GSAP and Framer Motion transitions

---

## 📊 Release Notes - v2.2.0 'Institutional Hybrid'

1. **Spline Occlusion Fix**: Resolved hero background visibility by removing opaque section containers.
2. **Bot Sync**: WhatsApp Bot now pulls live rates directly from the Supabase backend.
3. **Asset Restoration**: Corrected missing asset path for the Founder profile.
4. **Code Sanitization**: Removed all Spider-Man and Deadpool placeholder components and styles.
5. **Database Migration**: Fully transitioned seeding logic from MongoDB to Supabase.

---

## 📞 Support

- WhatsApp: +237 676 339 620
- Email: <rosvelmelong@gmail.com>

---

**Last Updated**: April 1, 2026
**Version**: 2.2.0
**Status**: 🚀 PRODUCTION READY
