# OAuth 2.0 PKCE Demo

A complete OAuth 2.0 PKCE (Proof Key for Code Exchange) authentication flow with **Auth0**, featuring:

- **Frontend**: Single Page Application with login button that initiates PKCE flow
- **Backend**: Express API with JWT token validation
- **Security**: No client secrets exposed in frontend; PKCE protects against authorization code interception

---

## Project Structure

```
oauth-demo/
├── backend/
│   ├── middleware/
│   │   └── checkJwt.js          # express-jwt middleware for token validation
│   ├── routes/
│   │   └── hello.js             # Protected API route (returns user info)
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Auth0 credentials (git-ignored)
├── frontend/
│   ├── js/
│   │   ├── pkce.js              # PKCE helper functions (verifier, challenge, token exchange)
│   │   └── config.js            # Auth0 client config (CLIENT_ID, DOMAIN, REDIRECT_URI, API_AUDIENCE)
│   ├── css/
│   │   └── styles.css           # Basic styling
│   ├── index.html               # Login page with Auth0 button
│   └── callback.html            # Receives authorization code, exchanges for tokens, displays user info
├── README.md
└── .gitignore
```

---

## Prerequisites

- **Node.js** (v14+) and **npm**
- **Auth0 account** with an application created
- **Local ports available**: 3000 (frontend), 3001 (backend)

---

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/oauth-demo.git
cd oauth-demo

cd backend
npm install
cd ../frontend
# No npm install needed for frontend (uses npx serve for static hosting)
cd ..
```

### 2. Configure Auth0 application

1. Go to your [Auth0 Dashboard](https://manage.auth0.com)
2. Create a new application (type: Single Page Application)
3. In **Settings**, add to **Allowed Callback URLs**:
   ```
   http://localhost:3000/callback
   ```
4. Add to **Allowed Web Origins** (for CORS):
   ```
   http://localhost:3000
   ```
5. Create or select an API and note its **identifier** (e.g., `https://api.example.com`)

### 3. Configure backend (.env)

Create `backend/.env`:

```
AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
API_AUDIENCE=https://api.example.com
BACKEND_PORT=3001
```

Get these values from your Auth0 Application Settings.

### 4. Update frontend config

Edit `frontend/js/config.js` with your Auth0 credentials:

```javascript
export const CLIENT_ID = "YOUR_CLIENT_ID";
export const DOMAIN = "your-auth0-domain.us.auth0.com";
export const API_AUDIENCE = "https://api.example.com";
export const REDIRECT_URI = "http://localhost:3000/callback";
```

### 5. Start the servers

**Terminal 1 — Backend:**

```bash
cd backend
npm start
```

Expected output: `API running on http://localhost:3001`

**Terminal 2 — Frontend:**

```bash
cd frontend
npx serve . -l 3000
```

Expected output: Serving on `http://localhost:3000`

### 6. Test the flow

1. Open `http://localhost:3000` in your browser
2. Click **Login with Auth0**
3. Sign in with your Auth0 credentials
4. You'll be redirected to `http://localhost:3000/callback`
5. The page will:
   - Exchange the authorization code for tokens
   - Display the token response (access_token, id_token, etc.)
   - Show a "Call API" button
6. Click **Call API** to invoke `http://localhost:3001/hello`:
   - The request includes `Authorization: Bearer <access_token>`
   - Backend validates the token with express-jwt
   - Response shows: `{ message: "Hello! Your token is valid.", user: {...} }`
   - **User Info** displays the decoded JWT payload (claims like `sub`, `aud`, etc.)

---

## How PKCE Works (Simplified)

1. **Frontend generates** a random `code_verifier` (stored in localStorage)
2. **Frontend derives** a `code_challenge` (SHA-256 hash of verifier) and sends it to Auth0
3. **Auth0 authenticates** the user and returns an authorization `code`
4. **Frontend exchanges** the `code` + `code_verifier` for tokens with Auth0
5. **Auth0 verifies** that the `code_verifier` matches the `code_challenge` (security checkpoint)
6. **Tokens are returned** and used to call the protected backend API

This prevents attackers from intercepting the authorization code and using it (they'd need the verifier too).

---

## Security Notes

- **`.env` file**: Contains Auth0 credentials — **never commit to version control**. Already in `.gitignore`.
- **`frontend/js/config.js`**: Contains CLIENT_ID and REDIRECT_URI — these are public (frontend) but REDIRECT_URI must match Auth0 settings exactly.
- **No client secret in frontend**: The PKCE flow doesn't require a client secret (unlike the Authorization Code flow with backend exchange).
- **HTTPS in production**: Always use HTTPS in production to protect tokens in transit.

---

## Troubleshooting

### No authorization code returned to callback
- Check that `REDIRECT_URI` in `frontend/js/config.js` **exactly matches** "Allowed Callback URLs" in Auth0 Application Settings (including protocol and path).
- Verify the app is set as Single Page Application (not Regular Web Application) in Auth0.

### "UnauthorizedError: No authorization token was found"
- Confirm the frontend Call API request includes the `Authorization: Bearer <token>` header.
- Check browser DevTools Network tab to see the request headers.

### Token validation fails (audience/issuer mismatch)
- Verify `API_AUDIENCE` in `frontend/js/config.js` matches the API identifier in Auth0.
- Verify `AUTH0_DOMAIN` in `backend/.env` is correct (should match the domain in frontend config).
- In Auth0 API settings, confirm "Signing Algorithm" is RS256.

### CORS errors when calling backend
- Backend already has `cors()` enabled with default settings (allow all origins).
- If you see 403 errors, check that the Authorization header is being sent correctly.

---

## Optional Enhancements

- [ ] Display and decode the ID token to show user profile info (name, picture, etc.)
- [ ] Add refresh token handling for long-lived sessions
- [ ] Add logout button to clear localStorage
- [ ] Deploy frontend to Vercel/Netlify and backend to Heroku/Railway
- [ ] Add role-based access control (RBAC) using Auth0 roles
- [ ] Store tokens in secure HTTP-only cookies instead of localStorage (more secure)



### Explanation of the Diagram Steps
- Frontend (3000)
- Generates code_verifier
- Hashes it → code_challenge
- Sends user to Auth0 /authorize
- User logs in at Auth0
- Auth0 redirects back with ?code=XYZ
- Frontend retrieves code + code_verifier
- Exchanges code for tokens at /oauth/token
- Calls API with Authorization: Bearer <access_token>

Auth0

- Verifies login credentials
- Verifies PKCE proof (challenge vs verifier)
- Issues tokens (ID & Access)
- Backend API (3001)
- Middleware validates JWT signature using JWKS
- Confirms issuer, audience, expiry, signature
- Attaches decoded user → req.user
- Returns protected response