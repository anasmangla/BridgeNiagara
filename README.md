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
SUCCESS_URL=https://your-domain.example/success.html
CANCEL_URL=https://your-domain.example/cancel.html
SERVER_URL=https://your-backend-domain
PORT=4242
ALLOWED_ORIGINS=https://your-frontend.example
```

- The Express server requires `STRIPE_SECRET_KEY`, `SUCCESS_URL`, and `CANCEL_URL` to be defined. The server will exit on startup if any are missing.
- Never commit the `.env` file.
- In production, configure these values through your hosting provider's environment settings.
- Use the publishable key (`pk_test…`) only for client-side Stripe SDK usage when added.
- The donation page requires a valid backend URL. Copy `js/config.example.js` to `js/config.js` and
  set `window.SERVER_URL` to match `SERVER_URL` above or define `SERVER_URL` via your build system.

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

- **Vercel** – Set the environment variables in the project settings. Use `npm start` as the start command or create a Serverless Function.
- **Netlify** – Add the same environment variables and serve the `server.js` file via a Netlify Function or an external server.
- **cPanel or traditional hosting** – Upload the repository, install dependencies on the server, set the environment variables through the hosting control panel, and run `node server.js` using a process manager like `pm2`.

## Static Hosting Notes

- GitHub Pages and some static hosts do not serve `.mjs` files with a JavaScript MIME type. Modules should use the `.js` extension (e.g. `donationHelpers.js`), and HTML pages must import them with `.js`.
- If the site is only deployed to `www.bridgeniagara.org`, configure a permanent redirect from `bridgeniagara.org` at the DNS or hosting level so both domains deliver the same assets.
- Avoid meta-refresh or other client-side redirect loops; server-side redirects are preferred.

## Troubleshooting

- **Server exits on startup** – Check that `STRIPE_SECRET_KEY`, `SUCCESS_URL`, and `CANCEL_URL` are present in `.env`.
- **CORS errors** – Ensure `ALLOWED_ORIGINS` matches the domains making requests.

## Contributing

Pull requests are welcome. Please run `npm test` before submitting.

## CI / Deployment

In continuous integration or deployment pipelines, run the tests before releasing changes.

