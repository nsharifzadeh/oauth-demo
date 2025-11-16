# OAuth 2.0 PKCE Demo

This project demonstrates a full **OAuth 2.0 PKCE flow** with Auth0, including:

- Frontend SPA login
- Authorization code exchange
- Backend Express API protected with JWT

---

## Folder Structure

oauth-demo/
│
├── backend/
│ ├── middleware/
│ │ └── checkJwt.js # JWT validation middleware
│ ├── routes/
│ │ └── hello.js # Protected API route
│ ├── server.js # Express server entry point
│ └── package.json
│
├── frontend/
│ ├── js/
│ │ ├── pkce.js # PKCE helper functions
│ │ └── config.js # Config for Auth0 client ID, domain (ignored in git)
│ ├── index.html # Login page
│ └── callback.html # Callback page for token exchange
│
├── .gitignore
└── README.md


---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/oauth-demo.git
cd oauth-demo

### 2. Create .env for backend


AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
API_AUDIENCE=https://api.example.com
BACKEND_PORT=3001

### 3. Install dependencies

cd backend
npm install

### 4. Start the servers

cd frontend
npx serve . -l 3000

### 5. Use the demo

Open http://localhost:3000/index.html in your browser.

Click Login → Auth0 will redirect to your callback page.

The frontend exchanges the authorization code for an access token.

Access token is automatically sent to /hello backend route.

The backend validates the token and responds with user info.

### 6. Security Notes

.env and frontend/js/config.js are ignored in GitHub to avoid exposing credentials.

Never push client secrets or sensitive toke