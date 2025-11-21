# Deployment guide

This project is set up so the Node `server` serves the React `client/build` static files and provides the `/send` API endpoint.

Required environment variables (set these on your host/provider):

- `EMAIL_USER` — SMTP username or sending email address
- `EMAIL_PASS` — SMTP password or API key (keep secret)
- Optional: `EMAIL_SERVICE` — e.g. `gmail` (used when `EMAIL_HOST` is not set)
- Optional: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE` — SMTP details to use instead of a named service
- Optional: `PORT` — server port (defaults to 10000)

Quick local test

PowerShell (from project root):

```powershell
cd client
npm install
npm run build

cd ..\server
# set env vars for this session (replace with real values)
$env:EMAIL_USER='youremail@example.com'; $env:EMAIL_PASS='yourpassword'
node server.js
```

Deploy providers

- Render (recommended for single-repo Node + static build)

  1. Push this repository to GitHub (see "Push to GitHub" below).
  2. In the Render dashboard, click "New" → "Web Service" → connect your GitHub account and select this repository.
  3. Use the following settings (you can also include a `render.yaml` in the repo):

	  - **Environment:** Node
	  - **Build Command:** `cd server && npm install && npm run build`
	  - **Start Command:** `node server/server.js`
	  - **Branch:** choose the branch you pushed (e.g. `main`)

  4. Add the following Environment Variables in the Render service settings (do NOT commit these to git):

	  - `EMAIL_USER` — your sending email (e.g. `gojungleeadventures@gmail.com`)
	  - `EMAIL_PASS` — app password or SMTP password
	  - (optional) `EMAIL_SERVICE` — `gmail` (if using Gmail's SMTP)
	  - (optional) `PORT` — if you want to override default 10000 (Render provides one automatically)

  5. Create the service. Render will run the build and start commands and show logs; watch logs for build errors and the running server.

  Notes:
  - The build command installs server deps and runs the `server` `build` script which builds the React client into `client/build` so the server can serve it.
  - Keep secrets in Render's dashboard (Environment) rather than committing them.

- Heroku: Ensure `Procfile` exists (included). Add config vars for `EMAIL_USER` and `EMAIL_PASS`. Push to Heroku Git and `heroku open` after deploy.
- Railway / Fly / Vercel + Separate server: You can deploy the `server` as a single Node service; if you host `client` separately (Vercel), update the client fetch URL to the server's full URL.

Push to GitHub (example commands)

```powershell
# from project root (only do this once; skip if repo already exists)
git init
git add .
git commit -m "Initial commit - prepare for Render deployment"
# create repo on GitHub via website, then add remote
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

If you'd like, I can create a `render.yaml` (sample) in the repo to codify the service settings — you still must set secrets in Render's dashboard.

Security note

- Do not commit real secrets into the repository. Use provider secret management or a `.env` file kept out of source control.
- Consider using an email provider (SendGrid/Mailgun) and API key instead of a personal Gmail account for reliability.
