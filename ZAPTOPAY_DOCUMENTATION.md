# 🎉 Zaptopay Complete System Documentation

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
- **Auto-Responses**: 6 pre-configured responses
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
  "sell_rate": 573,
  "buy_rate": 598,
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
  "sell_rate": 575,
  "buy_rate": 600,
  "currency": "USDT"
}
```

#### Get Rate History
```
GET /api/admin/rates/history?limit=50
Authorization: Bearer <token>
```

#### Get Contact Messages
```
GET /api/admin/contacts?status=new
Authorization: Bearer <token>
```

#### Update Contact Status
```
PATCH /api/admin/contacts/{message_id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "read"
}
```

#### Create FAQ
```
POST /api/admin/faq
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "How long does it take?",
  "answer": "Under 2 minutes!",
  "order": 1
}
```

#### Create Bot Response
```
POST /api/admin/bot/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "trigger_keywords": ["hello", "hi"],
  "response_message": "Welcome to Zaptopay!",
  "is_active": true
}
```

#### Get Dashboard Stats
```
GET /api/admin/stats
Authorization: Bearer <token>
```
**Response:**
```json
{
  "total_contacts": 45,
  "new_contacts": 12,
  "total_faqs": 6,
  "active_bot_responses": 6,
  "latest_rate": {
    "sell_rate": 573,
    "buy_rate": 598
  }
}
```

---

## 🤖 WhatsApp Bot Auto-Responses

### Pre-configured Responses

1. **Greetings** (hello, hi, hey, bonjour, salut)
   - Welcomes user
   - Shows current rates
   - Guides next steps

2. **Rate Inquiry** (rate, rates, price, prix, taux)
   - Displays current USDT rates
   - Prompts user to trade

3. **How-to** (how, comment, process, steps)
   - 4-step trading process
   - Clear instructions

4. **Security** (safe, secure, trust, scam)
   - Security assurances
   - Trust indicators

5. **Speed** (time, fast, quick, rapide)
   - "Under 2 minutes" promise
   - Average transaction time

6. **Support** (support, help, problem, aide)
   - 24/7 availability
   - Common questions list

---

## 💡 How to Use the System

### For Users:
1. **Visit Homepage**: See live rates and crypto prices
2. **Enter Amount**: Type amount in hero section
3. **Choose Action**: Select "Sell" or "Buy"
4. **See Quote**: Instant XAF calculation
5. **Click WhatsApp**: Opens WhatsApp with pre-filled message
6. **Trade**: Agent responds in under 2 minutes

### For Admin:
1. **Login**: Use admin credentials
2. **Update Rates**: Change daily USDT rates
3. **Manage Messages**: Respond to contact form submissions
4. **Edit FAQs**: Keep information up-to-date
5. **Configure Bot**: Add/edit auto-responses
6. **Monitor Stats**: Track system usage

---

## 🔧 Technical Details

### Frontend Components:
- `MainTitle.js` - Hero section with interactive input
- `CryptoTracker.js` - Live crypto price display
- `EnhancedRateCalculator.js` - Smart calculator with live prices
- `WhatsAppModal.js` - Message preview modal
- `FloatingWhatsApp.js` - Floating action button
- `Navigation.js` - Header with Zaptopay branding

### Backend:
- `server.py` - FastAPI backend with all endpoints
- `seed_data.py` - Database initialization script

### Database Collections:
- `rates` - Exchange rate history
- `admin_sessions` - Admin authentication tokens
- `contact_messages` - User inquiries
- `faqs` - Frequently asked questions
- `bot_responses` - WhatsApp auto-reply configurations

### External APIs:
- **CoinGecko API**: Live cryptocurrency prices
- **WhatsApp API**: `wa.me` deep linking

---

## 🎨 Design Features

### Colors:
- **Vault Navy**: #0a0e27 (primary background)
- **Charcoal**: #1a1f3a (secondary background)
- **Zap Green**: #00ff88 (primary accent)
- **Electric Blue**: #00d4ff (secondary accent)
- **Soft Silver**: #e5e7eb (text)

### Typography:
- **Primary Font**: Space Grotesk (geometric sans-serif)
- **Fallback**: Inter, system fonts

### Effects:
- **Glassmorphism**: Frosted glass effect with backdrop-blur
- **Glow Effects**: Text shadows and box shadows with brand colors
- **Smooth Animations**: CSS transitions and keyframe animations

---

## 📊 Rate Calculation Logic

### Example: User wants to sell 100 USDT

1. **Get Live USDT Price**: $1.00 (from CoinGecko)
2. **Get Your XAF Rate**: 573 XAF/$ (from your database)
3. **Calculate**: 100 × 1.00 × 573 = **57,300 XAF**

### Example: User wants to buy 0.001 BTC

1. **Get Live BTC Price**: $95,000 (from CoinGecko)
2. **Get Your XAF Rate**: 598 XAF/$ (from your database)
3. **Calculate**: 0.001 × 95,000 × 598 = **56,810 XAF**

---

## 🚨 Important Notes

1. **Change Admin Password**: Default password is for development only
2. **Rate Limits**: CoinGecko free tier has rate limits (50 calls/minute)
3. **CORS**: Currently allows all origins - restrict in production
4. **HTTPS**: Use HTTPS in production for security
5. **Environment Variables**: Never commit `.env` files to git
6. **Database Backups**: Regularly backup MongoDB data
7. **Monitor API Usage**: Track CoinGecko API calls

---

## 🎯 Next Steps

### Immediate:
- [ ] Build admin dashboard frontend UI
- [ ] Complete removal of Spider-Man content
- [ ] Make crypto scroller 3D and diagonal
- [ ] Add GSAP scroll animations
- [ ] Create FAQ accordion section
- [ ] Add contact form to website

### Future Enhancements:
- [ ] Multi-currency support (EUR, GBP, etc.)
- [ ] Transaction history for users
- [ ] Email notifications for admins
- [ ] SMS integration for transaction alerts
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Automated rate updates based on market

---

## 📞 Support

For technical issues or questions:
- WhatsApp: +237 676 339 620
- Email: admin@zaptopay.com (configure this)

---

**Last Updated**: March 28, 2025
**Version**: 1.0.0
**Status**: ✅ Operational
