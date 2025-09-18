# Use a slim Node.js image
# Stage 1: Build the application
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:20-slim

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Copy built application and config from build stage
COPY --from=build /app/dist/ ./dist/

# Expose port 8080 for App Engine
EXPOSE 8080

# Run the HTTP server
CMD ["node", "dist/http.js"]
