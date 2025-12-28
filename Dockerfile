# Use a base image with both Python and Node.js
FROM nikolaik/python-nodejs:python3.11-nodejs20

# Set working directory
WORKDIR /app

# Copy the entire repository
COPY . .

# Install dependencies for Crisp Backend
WORKDIR /app/src/crisp-backend
RUN pip install --no-cache-dir -r requirements.txt

# Install dependencies for Livestock Backend
WORKDIR /app/src/app/livestock
RUN pip install --no-cache-dir -r requirements.txt

# Install dependencies and build AI Form Filling App
WORKDIR /app/src/app/ai-form-filling
RUN npm install
RUN npm run build

# Go back to root
WORKDIR /app

# Expose the port HF Spaces expects
EXPOSE 7860

# Make start script executable
RUN chmod +x start.sh

# Start command
CMD ["./start.sh"]
