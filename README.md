# BridgeNiagara

This repository contains static site assets for Bridge Niagara.

## Installing Dependencies

Install the required Node.js packages:

```
npm install
```

## Environment Variables

Sensitive credentials should be stored in a local `.env` file which is ignored by git. Start by copying `.env.example` to `.env` and customizing the values.

```
STRIPE_SECRET_KEY=sk_test_yourkeyhere
STRIPE_WEBHOOK_SECRET=whsec_yourwebhooksecret
SUCCESS_URL=https://your-domain.example/success.html
CANCEL_URL=https://your-domain.example/cancel.html
SERVER_URL=https://your-backend-domain
PORT=4242
ALLOWED_ORIGINS=https://your-frontend.example
```

- The Express server requires `STRIPE_SECRET_KEY`, `SUCCESS_URL`, `CANCEL_URL`, and `STRIPE_WEBHOOK_SECRET` for webhook verification. The server will exit on startup if any are missing.
- Never commit the `.env` file.
- In production, configure these values through your hosting provider's environment settings.
- Use the publishable key (`pk_test…`) only for client-side Stripe SDK usage when added.
- The donation page requires a valid backend URL. Copy `js/config.example.js` to `js/config.js` and
  set `window.SERVER_URL` to your backend endpoint (matching `SERVER_URL` above). The `config.js`
  file is ignored by git and must be created per deployment.

If `ALLOWED_ORIGINS` is omitted, the server will automatically allow requests from the same origin as
the page making the request. To restrict cross-origin requests, provide a comma-separated list of
allowed origins or set `ALLOWED_ORIGINS=*` to permit any origin.

## Running Locally

Ensure the `.env` file is in place, then start the server:

```
node server.js
```

`npm start` is also available as a shortcut.

## Running Tests

Execute the test suite:

```
npm test
```


## Deploying to Hosting Platforms

The Stripe integration requires a running Node backend and a static host for the HTML/JS files.

1. **Deploy the backend**
   - Upload `server.js` (and `package.json`) to your host and run `npm install`.
  - Configure `STRIPE_SECRET_KEY`, `SUCCESS_URL`, `CANCEL_URL`, `SERVER_URL`, `ALLOWED_ORIGINS`, `PORT`, and `STRIPE_WEBHOOK_SECRET` as environment variables.
   - Start the server with `npm start` or `node server.js` under a process manager such as `pm2`.
2. **Deploy the static site**
   - Copy `js/config.example.js` to `js/config.js` on the static host.
   - Set `window.SERVER_URL` in `js/config.js` to the URL where the backend is deployed.
   - Upload the HTML and client-side JavaScript (including `js/config.js`) to your static hosting provider.

Platform notes:

- **Vercel** – Set environment variables in the project settings. Deploy `server.js` as a Serverless Function or run `npm start`. Ensure the static site includes a customized `js/config.js` pointing to the Vercel backend.
- **Netlify** – Add the same environment variables in Site settings. Serve the backend via a Netlify Function or external Node server, and deploy the static files with a `js/config.js` referencing it.
- **cPanel or traditional hosting** – Upload the repository, install dependencies, configure the environment variables in the control panel, and run `node server.js` with `pm2`. Create `js/config.js` on the static portion of the site pointing to that server.

### Verifying the Stripe Endpoint

- [ ] `js/config.js` exists and `window.SERVER_URL` matches the deployed backend.
- [ ] From `donate.html`, a network request to `${window.SERVER_URL}/create-checkout-session` returns a `200` response.
- [ ] Clicking the donate button redirects to Stripe Checkout without CORS errors.

## Static Hosting Notes

- GitHub Pages and some static hosts do not serve `.mjs` files with a JavaScript MIME type. Modules should use the `.js` extension (e.g. `donationHelpers.js`), and HTML pages must import them with `.js`.
- If the site is only deployed to `www.bridgeniagara.org`, configure a permanent redirect from `bridgeniagara.org` at the DNS or hosting level so both domains deliver the same assets.
- Avoid meta-refresh or other client-side redirect loops; server-side redirects are preferred.

## Troubleshooting

- **Server exits on startup** – Check that `STRIPE_SECRET_KEY`, `SUCCESS_URL`, `CANCEL_URL`, and `STRIPE_WEBHOOK_SECRET` are present in `.env`.
- **CORS errors** – Ensure `ALLOWED_ORIGINS` matches the domains making requests.

## Contributing

Pull requests are welcome. Please run `npm test` before submitting.

## CI / Deployment

In continuous integration or deployment pipelines, run the tests before releasing changes.

