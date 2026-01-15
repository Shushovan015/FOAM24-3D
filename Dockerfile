FROM node:20-bullseye

WORKDIR /app

# Install Python + system deps needed by OpenCV
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Frontend deps
COPY package*.json ./
RUN npm install

# Backend deps
COPY src/outline_detection_service/requirements.txt ./src/outline_detection_service/requirements.txt
RUN python3 -m pip install --no-cache-dir -r src/outline_detection_service/requirements.txt

# App source
COPY . .

EXPOSE 5174 5000

# Start backend + frontend together
CMD sh -c "python3 /app/src/outline_detection_service/app.py & npm run dev -- --host 0.0.0.0"