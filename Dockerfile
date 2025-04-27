FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache bash curl openjdk11-jre-headless

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY functions/package.json ./functions/
COPY admin/package.json ./admin/

# Copy the rest of the application
COPY . .

# Install dependencies
RUN npm run setup

# Install Firebase CLI globally
RUN npm install -g firebase-tools

# Expose ports for Firebase Emulators
# Firebase UI
EXPOSE 4000
# Auth
EXPOSE 9099
# Functions
EXPOSE 5004
# Firestore
EXPOSE 8080
# Emulator Suite UI
EXPOSE 4400
# Pub/Sub
EXPOSE 8085
# UI Development Server
EXPOSE 5173

# Set environment variables
ENV FIREBASE_TOKEN=""
ENV HOST=0.0.0.0

# Build functions and admin
RUN cd functions && npm run build
RUN cd admin && npm run build

# Entry point
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"] 