$env:NODE_ENV = "development"

# Start Crisp Backend (Port 8000)
Write-Host "Starting Crisp Backend on Port 8000..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd src/crisp-backend; .\venv\Scripts\activate; python main.py"

# Start Livestock Backend (Port 5002)
Write-Host "Starting Livestock Backend on Port 5002..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd src/app/livestock; .\.venv\Scripts\activate; python application.py"

# Start AI Form Filling App (Port 5005)
Write-Host "Starting AI Form Filling App on Port 5005..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd src/app/ai-form-filling; npm run dev"

Write-Host "All services started in separate windows."
