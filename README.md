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

## Building Static Assets

This site uses Tailwind CSS. Generate the stylesheet before deploying:

```
npm run build:css
```

## Deploying to Hosting Platforms

Before deploying, run `npm run build:css` so `css/tailwind.css` is current.

- **Vercel** – Set the environment variables in the project settings and configure a build step of `npm run build:css`. Use `npm start` as the start command or create a Serverless Function.
- **Netlify** – Add the same environment variables, run `npm run build:css` during build, and serve the `server.js` file via a Netlify Function or an external server.
- **cPanel or traditional hosting** – Upload the repository, install dependencies on the server, set the environment variables through the hosting control panel, build the CSS, and run `node server.js` using a process manager like `pm2`.

## Troubleshooting

- **Server exits on startup** – Check that `STRIPE_SECRET_KEY`, `SUCCESS_URL`, and `CANCEL_URL` are present in `.env`.
- **CORS errors** – Ensure `ALLOWED_ORIGINS` matches the domains making requests.
- **CSS not updating** – Run `npm run build:css` and confirm the output file exists at `css/tailwind.css`.

## Contributing

Pull requests are welcome. Please run `npm test` and `npm run build:css` before submitting.

## CI / Deployment

In continuous integration or deployment pipelines, run the tests and CSS build before releasing changes.

