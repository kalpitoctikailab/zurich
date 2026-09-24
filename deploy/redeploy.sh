#!/usr/bin/env bash
# Pull latest code and restart the app. Run on the EC2 instance from /var/www/zurich.
set -euo pipefail

# S3 bucket that backs the CloudFront distribution (dn2k1twc7nphc.cloudfront.net).
# Change this if the bucket name ever changes.
STATIC_BUCKET="zurich-portfolio-brochures"
CDN_URL="https://dn2k1twc7nphc.cloudfront.net"

git pull
npm ci

# Build with CDN_URL so Next.js bakes the CloudFront domain into asset URLs.
CDN_URL="$CDN_URL" npm run build

# Upload immutable static chunks to S3 so CloudFront can serve them.
# _next/static/ files are content-hashed — safe to cache forever.
aws s3 sync .next/static "s3://$STATIC_BUCKET/_next/static" \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

pm2 restart deploy/ecosystem.config.js --update-env
