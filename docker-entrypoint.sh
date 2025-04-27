#!/bin/bash
set -e

# Start Firebase emulators
echo "Starting Firebase emulators..."
firebase emulators:start --project demo-project --import=/app/data --export-on-exit=/app/data

# Keep container running
exec "$@" 