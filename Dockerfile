# Multi-stage build for HireMind fullstack application
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install ALL frontend dependencies (including dev dependencies needed for build)
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Setup backend and serve frontend
FROM node:18-alpine AS production

# Install wget for healthchecks
RUN apk add --no-cache wget

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install only production backend dependencies
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend from previous stage to backend public directory
RUN mkdir -p public
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose backend port
EXPOSE 3001

# Set environment to production
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "-r", "dotenv/config", "src/server.js"]
