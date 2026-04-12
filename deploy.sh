#!/bin/bash
set -e

echo "=== Deploying ishango-calc-api ==="

echo "1. Pulling latest from main..."
git pull origin main

echo "2. Installing dependencies..."
npm install

echo "3. Building project..."
npm run build

bash ../env.sh

echo "4. Running migration..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" < migrations/Ishango_SAAS.sql

echo "5. Restarting PM2 instance..."
pm2 restart ishango-calc-api

echo "=== Deploy complete ==="
