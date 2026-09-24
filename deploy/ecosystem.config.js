module.exports = {
  apps: [
    {
      name: 'zurich',
      cwd: '/var/www/zurich',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        BROCHURE_CDN_URL: 'https://dn2k1twc7nphc.cloudfront.net/portfolio-brochures',
        NEXT_PUBLIC_CDN_URL: 'https://dn2k1twc7nphc.cloudfront.net',
      },
    },
  ],
}
