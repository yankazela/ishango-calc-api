#!/bin/bash
set -e

echo "=== Deploying ishango-calc-api ==="

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/server_key

echo "1. Pulling latest from main..."
git pull origin main

echo "2. Installing dependencies..."
npm install

echo "3. Building project..."
npm run build

# . ../env.sh 2>/dev/null || true

# set -a
# [ -f .env ] && . ./.env
# set +a

# DB_NAME="${DB_NAME:-Ishango_SAAS}"

# echo "4. Running migration..."
# mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST"
# use "$DB_NAME";
# source migrations/Ishango_SAAS.sql;

echo "5. Starting PM2 instance..."
if pm2 describe ishango-calc-api >/dev/null 2>&1; then
	pm2 restart ishango-calc-api --update-env
else
	pm2 start dist/main.js --name ishango-calc-api
fi

echo "=== Deploy complete ==="
