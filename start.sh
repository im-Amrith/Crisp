#!/bin/bash

# Start Crisp Backend
echo "Starting Crisp Backend..."
cd /app/src/crisp-backend
python main.py &

# Start Livestock Backend
echo "Starting Livestock Backend..."
cd /app/src/app/livestock
python application.py &

# Start AI Form Filling App
echo "Starting AI Form Filling App..."
cd /app/src/app/ai-form-filling
# Use PORT environment variable if set, otherwise default to 5005 (but Dockerfile exposes 7860)
export PORT=7860
npm run start
