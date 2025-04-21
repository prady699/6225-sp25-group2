# start.sh
#!/usr/bin/env bash
# If EB passed a port arg ($1), use it; else fall back to $PORT or 3000
if [ -n "$1" ]; then
  PORT="$1"
elif [ -n "$PORT" ]; then
  PORT="$PORT"
else
  PORT=3000
fi

echo "Starting Next.js on port $PORT…"
exec npm run start -- -p "$PORT"
