#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Start Backend
echo "Starting Backend..."
(cd "$PROJECT_ROOT/backend" && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &

# Start Frontend
echo "Starting Frontend..."
(cd "$PROJECT_ROOT/frontend" && pnpm dev) &

# Wait for both
echo "Both services are starting in the background."
wait
