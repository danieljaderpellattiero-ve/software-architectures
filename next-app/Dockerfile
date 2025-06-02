# Use official Node.js image as the base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port 3000
EXPOSE 3000

# Set the entrypoint to the script
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Start the application (this becomes the default command to the entrypoint script)
CMD ["npm", "run", "dev"]