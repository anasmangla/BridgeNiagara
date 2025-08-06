# BridgeNiagara

This repository contains static site assets for Bridge Niagara.

## Installing Dependencies

Install the required Node.js packages:

```
npm install
```

## Environment Variables

Sensitive credentials should be stored in a local `.env` file which is ignored by git. An example file is provided as `.env.example`.

```
STRIPE_SECRET_KEY=sk_test_yourkeyhere
SUCCESS_URL=https://your-domain.example/success.html
CANCEL_URL=https://your-domain.example/cancel.html
PORT=4242
```

- Never commit the `.env` file.
- In production, configure these values through your hosting provider's environment settings.
- Use the publishable key (`pk_test…`) only for client-side Stripe SDK usage when added.

## Running the Express server

Start the development server:

```
npm start
```

## Running Tests

Execute the test suite:

```
npm test
```

## Building CSS

This site uses Tailwind CSS. Generate the stylesheet before deploying:

```
npm run build:css
```

## Deployment

Run the Tailwind build command above before publishing the site to ensure `css/tailwind.css` is up to date.

## Contributing

Pull requests are welcome. Please run `npm test` and `npm run build:css` before submitting.

## CI / Deployment

In continuous integration or deployment pipelines, run the tests and CSS build before releasing changes.

