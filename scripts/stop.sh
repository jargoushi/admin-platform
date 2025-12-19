#!/bin/bash

# Stop Backend (Port 8000)
echo "Stopping Backend (Port 8000)..."
fuser -k 8000/tcp 2>/dev/null || echo "Backend not running on port 8000."

# Stop Frontend (Port 3000)
echo "Stopping Frontend (Port 3000)..."
fuser -k 3000/tcp 2>/dev/null || echo "Frontend not running on port 3000."
