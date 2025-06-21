# 🛠️ Build stage
FROM node:20.15.1-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Build the Next.js app
RUN npm run build

# 🏁 Production stage
FROM node:20.15.1-alpine

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/models ./models

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose Next.js port
EXPOSE 3000

# Start in production mode
CMD ["npm", "run", "start"]
