# Deployment Plan — ProbSol

## Frontend → Netlify
- Build the React app
- Add `_redirects` for React Router (SPA support)
- Install Netlify CLI and deploy

## Backend → Render.com (free)
- Netlify only hosts static files — Express.js backend needs a real server
- Render.com has a free tier that's perfect for Node.js/Express apps
- Update frontend `.env.production` with the Render backend URL
