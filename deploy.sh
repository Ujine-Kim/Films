#!/bin/bash
set -e

# ============================================
# Armenak Films — VPS Deploy Script
# Run on fresh Ubuntu 22.04/24.04
# Usage: ssh root@YOUR_IP 'bash -s' < deploy.sh
# ============================================

DOMAIN="${1:-YOUR_DOMAIN.com}"
APP_DIR="/opt/armenak-films"

echo "=== Installing dependencies ==="
apt-get update
apt-get install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git

# Enable docker
systemctl enable docker
systemctl start docker

echo "=== Cloning repository ==="
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull
else
  git clone https://github.com/Ujine-Kim/Films.git "$APP_DIR"
  cd "$APP_DIR"
fi

echo "=== Creating .env file ==="
if [ ! -f .env ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  DB_PASSWORD=$(openssl rand -hex 16)
  cat > .env << EOF
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
RESEND_API_KEY=
EOF
  echo "Created .env — add your RESEND_API_KEY later"
else
  echo ".env already exists, skipping"
fi

echo "=== Creating videos directory ==="
mkdir -p videos

echo "=== Building and starting containers ==="
docker compose up -d --build

echo "=== Configuring Nginx ==="
# Replace domain in nginx config
sed "s/YOUR_DOMAIN.com/$DOMAIN/g" nginx.conf > /etc/nginx/sites-available/armenak-films
ln -sf /etc/nginx/sites-available/armenak-films /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo "=== Setting up SSL ==="
if [ "$DOMAIN" != "YOUR_DOMAIN.com" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || echo "SSL setup failed — run certbot manually later"
fi

echo ""
echo "============================================"
echo "  Deploy complete!"
echo "  Site: http://$DOMAIN"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Upload video files to $APP_DIR/videos/"
echo "  2. Add RESEND_API_KEY to $APP_DIR/.env"
echo "  3. Run: cd $APP_DIR && docker compose restart app"
echo ""
