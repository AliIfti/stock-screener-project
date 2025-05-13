#!/bin/sh

# Replace the port in nginx config
sed -i "s/listen 3000/listen $PORT/g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;" 