#!/bin/bash

# Start Crisp Backend
echo "Starting Crisp Backend..."
(cd src/crisp-backend && source venv/bin/activate && python main.py) &

# Start Livestock Backend
echo "Starting Livestock Backend..."
(cd src/app/livestock && source .venv/bin/activate && python application.py) &

# Start AI Form Filling App
echo "Starting AI Form Filling App..."
(cd src/app/ai-form-filling && npm run dev) &

wait
