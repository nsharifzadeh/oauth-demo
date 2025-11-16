# OAuth 2.0 PKCE Demo

This project demonstrates a full **OAuth 2.0 PKCE flow** with Auth0, including:

- Frontend SPA login
- Authorization code exchange
- Backend Express API protected with JWT

---

## Folder Structure

```
oauth-demo/
├── backend/
│   ├── middleware/
│   │   └── checkJwt.js          # JWT validation middleware
│   ├── routes/
│   │   └── hello.js             # Protected API route
│   ├── server.js                # Express server entry point
│   └── package.json
├── frontend/
│   ├── js/
│   │   ├── pkce.js              # PKCE helper functions
│   │   └── config.js            # Auth0 configuration (git-ignored)
│   ├── index.html               # Login page
│   └── callback.html            # Callback page for token exchange
└── README.md
```

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/oauth-demo.git
cd oauth-demo
```

### 2. Create .env for backend

```
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
API_AUDIENCE=https://api.example.com
BACKEND_PORT=3001
```

### 3. Install dependencies

```bash
cd backend
npm install
```

### 4. Start the servers

Backend:
```bash
npm start
```

Frontend:
```bash
cd frontend
npx serve . -l 3000
```

### 5. Using the demo

1. Open http://localhost:3000/index.html in your browser
2. Click **Login** → Auth0 will redirect to your callback page
3. The frontend exchanges the authorization code for an access token
4. Access token is automatically sent to the `/hello` backend route
5. The backend validates the token and responds with user info

### 6. Security Notes

- `.env` and `frontend/js/config.js` are ignored in GitHub to avoid exposing credentials
- Never push client secrets or sensitive tokens to version control

### 7. Optional Improvements

- Display user profile info (id_token) on frontend
- Add refresh token handling for long-lived sessions
- Deploy frontend and backend to a server for a production demo