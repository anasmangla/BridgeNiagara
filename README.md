# BridgeNiagara Deployment Guide

This guide covers deploying the application to a Python environment on Bluehost using cPanel.

## 1. Install Python Dependencies

Use the version of Python configured for your Bluehost application and install the required packages:

```
pip install -r requirements.txt
```

## 2. Run Migrations and Collect Static Files

Apply database migrations and gather static assets before deployment:

```
python manage.py migrate
python manage.py collectstatic --noinput
```

## 3. Configure Environment Variables on Bluehost

1. Log in to Bluehost and open **Advanced → Terminal** or connect via SSH.
2. Edit `~/.bash_profile` (or the virtual environment's `activate` script) to export required variables, e.g.:
   ```bash
   export DJANGO_SETTINGS_MODULE=project.settings
   export SECRET_KEY=your-secret-key
   export DATABASE_URL=mysql://user:password@host/dbname
   ```
3. Reload the profile (`source ~/.bash_profile`) or restart the app so the variables take effect.

## 4. Use `passenger_wsgi.py` as the Entry Point

Create a `passenger_wsgi.py` file at the project root to point Passenger to the Django WSGI application:

```python
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## 5. Deploy via cPanel Git Version Control and Restart the Python App

1. In cPanel, open **Files → Git Version Control** and create or configure a repository pointing to this project.
2. After pushing changes, deploy the latest commit from cPanel or by running `git pull` in the app directory.
3. Go to **Advanced → Python Apps** (or **Setup Python App**) and click **Restart** to reload the application with the new code.

Your application should now be running with the latest code, migrations, and static assets.
