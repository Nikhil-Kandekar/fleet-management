#!/bin/sh

# Wait for a given host and port to be ready
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 host port"
    exit 1
fi

host="$1"
port="$2"

while ! nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 2
done

echo "$host:$port is available"
exec "${@:3}"
