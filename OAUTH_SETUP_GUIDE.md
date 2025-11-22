# Gmail OAuth2 Setup Guide

## Prerequisites
You mentioned you already have:
- ✅ Client ID
- ✅ Client Secret
- ✅ Refresh Token
- ✅ Email User

## Environment Variables Configuration

### For Render.com Deployment

Go to your Render dashboard → Your Web Service → Environment tab and add these variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_OAUTH_CLIENT_ID=your-client-id-here
EMAIL_OAUTH_CLIENT_SECRET=your-client-secret-here
EMAIL_OAUTH_REFRESH_TOKEN=your-refresh-token-here
```

**Important:** 
- Remove or don't set `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT` variables (these are for SMTP)
- The server will automatically use OAuth2 when it detects the OAuth variables

### For Local Testing

Create a `.env` file in the `server` folder:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_OAUTH_CLIENT_ID=your-client-id-here
EMAIL_OAUTH_CLIENT_SECRET=your-client-secret-here
EMAIL_OAUTH_REFRESH_TOKEN=your-refresh-token-here
PORT=10000
```

## How to Get OAuth2 Credentials (Reference)

Since you already have these, this is just for reference:

1. **Google Cloud Console** (https://console.cloud.google.com/)
   - Create a project
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `https://developers.google.com/oauthplayground`
   - Copy Client ID and Client Secret

2. **OAuth2 Playground** (https://developers.google.com/oauthplayground)
   - Click settings gear icon (top right)
   - Check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - In Step 1: Select "Gmail API v1" → "https://mail.google.com"
   - Click "Authorize APIs"
   - In Step 2: Click "Exchange authorization code for tokens"
   - Copy the Refresh Token

## Testing After Deployment

1. After setting environment variables on Render, redeploy your service
2. Check the Render logs for any errors
3. Test the contact form on your deployed site

## Troubleshooting

### 500 Error Checklist:
- ✅ All 4 OAuth environment variables are set on Render
- ✅ No typos in variable names (exact match required)
- ✅ Refresh token is still valid (they can expire if not used)
- ✅ Gmail API is enabled in Google Cloud Console
- ✅ The OAuth consent screen is configured
- ✅ Your email address matches the one used to generate the refresh token

### Common Issues:

**"Invalid grant" error:**
- Refresh token expired → Generate a new one
- Email mismatch → Use the same Gmail account

**"Access token error":**
- Client ID/Secret mismatch → Double-check credentials
- OAuth consent screen not published → Set to "Testing" mode and add test users

**Still getting errors:**
- Check Render logs: Dashboard → Your Service → Logs tab
- Look for specific error messages from nodemailer or googleapis

## Verify Setup

After deploying with OAuth variables, your server logs should show the server starting successfully. When a form is submitted:
- Success: You'll receive an email at gojungleeadventures@gmail.com
- Failure: Check Render logs for specific error details
