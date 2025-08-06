# BridgeNiagara

This repository contains static site assets for Bridge Niagara.

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

