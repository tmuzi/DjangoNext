#!/bin/bash
# This script is run after dependencies are installed by @vercel/python
# Dependencies are automatically installed by Vercel, so we only need to:
# 1. Collect static files
# 2. Run migrations
# 3. Create superuser (if needed)

python3.12 manage.py collectstatic --no-input --clear || true
python3.12 manage.py makemigrations || true
python3.12 manage.py migrate || true
python3.12 manage.py createsuperuser --noinput || echo "Superuser already exists or could not be created"