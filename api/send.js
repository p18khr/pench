const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  const origin = (req.headers.origin || '').replace(/\/$/, '');
  const configured = (process.env.CORS_ALLOW_ORIGIN || 'https://enchsafaribooking.in').replace(/\/$/, '');
  const allow = origin && origin === configured ? origin : configured;
  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, number, date, message } = req.body || {};
  if (!name || !email || !number || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const gmailClientId = process.env.GMAIL_CLIENT_ID;
  const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
  const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const gmailUser = process.env.GMAIL_USER;

  if (!gmailClientId || !gmailClientSecret || !gmailRefreshToken || !gmailUser) {
    return res.status(500).json({ message: 'Email service not configured.' });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(gmailClientId, gmailClientSecret);
    oAuth2Client.setCredentials({ refresh_token: gmailRefreshToken });
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse && accessTokenResponse.token ? accessTokenResponse.token : null;

    if (!accessToken) {
      return res.status(500).json({ message: 'Unable to obtain Gmail access token.' });
    }

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const html = `
      <h2>Visitor Details</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile Number:</strong> ${number}</p>
      <p><strong>Date of Visit:</strong> ${date}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
    `;

    const raw = [
      `From: ${gmailUser}`,
      `To: gojungleeadventures@gmail.com`,
      `Reply-To: ${email}`,
      `Subject: New Visitor Entry from ${name}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
    ].join('\r\n');

    const encoded = Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encoded } });
    return res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error('Vercel Gmail API send error:', msg);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.', error: msg });
  }
}
