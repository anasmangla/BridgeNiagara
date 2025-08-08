# BridgeNiagara

## Setup

1. Create a virtual environment and install dependencies:

```
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in the values:

```
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=bridgeniagara.org,www.bridgeniagara.org

MYSQL_DB=bridgeniagara_db
MYSQL_USER=bridgeniagara_user
MYSQL_PASSWORD=CHANGE_ME

STRIPE_SECRET_KEY=sk_test_or_live_here
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_here
STRIPE_WEBHOOK_SECRET=whsec_xxx
DONATION_SUCCESS_URL=https://www.bridgeniagara.org/success/
DONATION_CANCEL_URL=https://www.bridgeniagara.org/cancel/
```

3. Run migrations and collect static files:

```
python manage.py migrate
python manage.py collectstatic --noinput
```

## Deploying on cPanel

Deployment is managed by `.cpanel.yml`. After pushing to the repository, cPanel will:

- copy the project to `/home3/aerosevo/public_html/bridgeniagara`
- touch `tmp/restart.txt` to reload the application

Ensure `passenger_wsgi.py` is present at the project root and points to `bridgeniagara.settings`.
