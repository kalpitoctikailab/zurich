#!/usr/bin/env bash
# Pull latest code and restart the app. Run on the EC2 instance from /var/www/zurich.
set -euo pipefail

STATIC_BUCKET="zurich-portfolio-brochures"
CDN_URL="https://dn2k1twc7nphc.cloudfront.net"

git pull
npm ci

# Only use CloudFront assetPrefix if aws CLI is available.
# Without it, Next.js serves JS/CSS directly from EC2 (safe fallback).
if command -v aws &>/dev/null; then
  CDN_URL="$CDN_URL" npm run build
  aws s3 sync .next/static "s3://$STATIC_BUCKET/_next/static" \
    --cache-control "public, max-age=31536000, immutable" \
    --delete
  echo "Static assets synced to S3."
else
  echo "Warning: aws CLI not found — building without CDN. Install AWS CLI to enable CloudFront."
  npm run build
fi

pm2 restart deploy/ecosystem.config.js --update-env
