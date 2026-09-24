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
  CDN_URL="$CDN_URL" NEXT_PUBLIC_CDN_URL="$CDN_URL" npm run build

  # JS + CSS chunks — immutable (content-hashed), cache forever
  aws s3 sync .next/static "s3://$STATIC_BUCKET/_next/static" \
    --cache-control "public, max-age=31536000, immutable" \
    --delete

  # Public images — long cache, but not immutable (filenames can be reused)
  for dir in gallery-image portfolio case-study images assets Brochure-image daily-schedule; do
    if [ -d "public/$dir" ]; then
      aws s3 sync "public/$dir" "s3://$STATIC_BUCKET/$dir" \
        --cache-control "public, max-age=2592000" \
        --delete
      echo "Synced public/$dir to S3."
    fi
  done

  # Root-level images (hero banners, blog covers)
  aws s3 sync public/ "s3://$STATIC_BUCKET/" \
    --exclude "*" \
    --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" --include "*.svg" \
    --cache-control "public, max-age=2592000"

  echo "All assets synced to S3."
else
  echo "Warning: aws CLI not found — building without CDN. Install AWS CLI to enable CloudFront."
  npm run build
fi

pm2 restart deploy/ecosystem.config.js --update-env
