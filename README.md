🌱 CropX — AI-Powered Digital Agriculture Platform
Empowering farmers with AI-driven insights, smart crop management, and a digital marketplace.

Python 3.11 Django React 18 Vite Redux Toolkit JWT MUI MIT License

📖 Table of Contents
About the Project
Key Features
Architecture
Tech Stack
Project Structure
Getting Started
API Endpoints
Database Schema
Roadmap
Contributing
License
🌾 About the Project
CropX is a full-stack, AI-powered digital agriculture platform designed to bring the power of modern technology to farmers. It helps farmers manage their entire farming lifecycle — from farm creation and crop planning to AI-based disease detection, digital marketplace selling, real-time weather insights, and personalized government scheme recommendations.

Built as a scalable, production-ready platform using a decoupled React frontend, Django REST Framework backend, and a planned TensorFlow AI layer.

✨ Key Features
Feature	Description	Status
🔐 Authentication & RBAC	JWT-based login/registration with role-based access (Farmer, Buyer, Expert, Admin)	✅ Complete
👨‍🌾 Farmer Profile Management	Detailed farmer profiles with land area, soil type, location & language preferences	✅ Complete
🏡 Farm Management	Create & manage multiple farms with GPS coordinates, irrigation type & soil data	🚧 Planned
🌾 Crop Management	Track crops from planting to harvest with status tracking & farm-wise history	🚧 Planned
🦠 AI Disease Detection	Upload leaf images for CNN-based disease prediction with confidence scores & treatment info	🚧 Planned
🛒 Marketplace	List, search & buy agricultural products with order tracking & payment integration	🚧 Planned
🌦️ Weather Intelligence	Real-time weather data, forecasts, rain alerts & farming recommendations per district	🚧 Planned
📋 Scheme Recommendations	AI-driven eligible government scheme recommendations based on farmer profile	🚧 Planned
🔔 Notifications	In-app alerts for disease, weather, marketplace updates & government schemes	🚧 Planned
📊 Analytics Dashboard	Crop health, revenue & disease statistics dashboard	🔮 Future
🏛️ Architecture
React Frontend (Vite + Redux)
         │
    Axios (REST API calls)
         │
Django REST Framework (Backend API)
         │
  ┌──────┼──────────────────────┐
  │      │                      │
SQLite (Dev) ──► PostgreSQL   TensorFlow AI
  │              (Production)   OpenCV
  │
Cloudinary (Image Storage)

External Services
─────────────────
• OpenWeather API     → Weather Intelligence
• Razorpay            → Marketplace Payments
• Email SMTP          → Notifications
• WhatsApp Cloud API  → Alerts (Future)
• Firebase FCM        → Push Notifications (Future)
🛠️ Tech Stack
Frontend
Technology	Purpose
React.js 18	User Interface
Vite 5	Fast development & bundling
Redux Toolkit	Global state management
React Router v6	Client-side routing
Axios	API communication
Material UI v5	UI components & theming
React Hook Form	Form handling & validation
Backend
Technology	Purpose
Python 3.11	Core language
Django 4.x	Backend framework
Django REST Framework	REST API layer
SimpleJWT	JWT authentication
Django CORS Headers	Cross-origin resource sharing
Pillow	Image processing
Django ORM	Database abstraction
AI / Machine Learning (Planned)
Technology	Purpose
TensorFlow / Keras	Deep learning for disease detection
MobileNetV2 / EfficientNet	CNN transfer learning model
OpenCV	Image preprocessing
Scikit-Learn	Scheme recommendation models
NumPy / Pandas	Numerical & data processing
Deployment
Component	Platform
Frontend	Vercel
Backend	Render
Database	Neon PostgreSQL
Images	Cloudinary
📁 Project Structure
CropX/
│
├── backend/                    # Django REST API
│   ├── accounts/               # Authentication, User & FarmerProfile models
│   │   ├── models.py           # Custom User model + FarmerProfile
│   │   ├── serializers.py      # DRF serializers (register, login, profile)
│   │   ├── views.py            # Auth views (register, login, profile CRUD)
│   │   └── urls.py             # /api/accounts/* routes
│   ├── config/                 # Django project settings
│   │   ├── settings.py
│   │   └── urls.py             # Root URL dispatcher
│   └── manage.py
│
├── frontend/                   # React + Vite client
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Shared UI components (ProtectedRoute, etc.)
│   │   ├── pages/              # Login, Register, Dashboard pages
│   │   ├── store/              # Redux Toolkit store & authSlice
│   │   ├── App.jsx             # Root app with React Router routes
│   │   └── main.jsx            # App entry point with MUI + Redux providers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── ml/                         # Machine Learning models (Planned)
│   └── README.md
│
├── docs/                       # Project documentation
│   ├── CropX_Features_and_DB_Schema.md
│   └── CropX_TechStack.md
│
├── assets/                     # Logos & static assets
├── .gitignore
└── README.md
🚀 Getting Started
Prerequisites
Python 3.11+
Node.js 18+ & npm
Git
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/CropX.git
cd CropX
2️⃣ Backend Setup (Django)
# Navigate to backend
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

# Apply database migrations
python manage.py migrate

# (Optional) Create an admin superuser
python manage.py createsuperuser

# Start the development server → http://localhost:8000
python manage.py runserver
3️⃣ Frontend Setup (React + Vite)
# Open a new terminal and navigate to the frontend
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server → http://localhost:5173
npm run dev
4️⃣ Environment Variables
Create a .env file inside backend/ (never commit this file):

SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
Create a .env file inside frontend/ (never commit this file):

VITE_API_BASE_URL=http://localhost:8000
📡 API Endpoints
Accounts (/api/accounts/)
Method	Endpoint	Description	Auth Required
POST	/api/accounts/register/	Register a new user (supports Farmer profile fields)	❌
POST	/api/accounts/login/	Login — returns JWT access + refresh tokens	❌
POST	/api/accounts/token/refresh/	Refresh an expired access token	❌
GET	/api/accounts/profile/	Get authenticated user's profile	✅ JWT
PUT	/api/accounts/profile/	Update authenticated user's profile	✅ JWT
🗄️ Database Schema
User (UUID PK)
 ├── FarmerProfile (1:1)
 │      ├── Farm (1:N)
 │      │     └── Crop (1:N)
 │      │           └── DiseaseDetection (N:1 → Disease)
 │      └── Product (1:N) ──► Order (buyer: FK User)
 │
 ├── Notification (1:N)
 └── UserScheme (N:N → Scheme)
Key models:

User — UUID PK, roles: farmer | buyer | expert | admin, JWT auth
FarmerProfile — soil type, land area, state/district/village, language
Farm — GPS coords, irrigation type, area per farm
Crop — planting/harvest dates, crop status
DiseaseDetection — uploaded leaf image, AI confidence score, model version
Product / Order — marketplace listings, order & payment status
WeatherCache — district-level weather snapshots
Scheme / UserScheme — government schemes + eligibility recommendations
Notification — user-targeted alerts with read/unread status
🗺️ Roadmap
 Phase 1 — Project setup, authentication system, JWT + RBAC, Farmer profile
 Phase 2 — Farm & Crop management APIs + frontend pages
 Phase 3 — AI Disease Detection (TensorFlow CNN model integration)
 Phase 4 — Marketplace (product listings, orders, Razorpay payments)
 Phase 5 — Weather Intelligence (OpenWeather API integration)
 Phase 6 — Government Scheme Recommendations (ML model)
 Phase 7 — Notifications system
 Phase 8 — Analytics dashboard
 Phase 9 — Production deployment (Vercel + Render + Neon)
🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the repository
Create your feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'feat: add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
Please follow Conventional Commits for commit messages.

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

Made with ❤️ for Indian Farmers  |  Built by Faizali Ambaliyasana
