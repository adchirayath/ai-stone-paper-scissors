FROM node:20-alpine

WORKDIR /app

# Expose production environment variable
ENV NODE_ENV=production \
    PORT=4000

# Install dependencies first for better Docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Run as non-root user for security best practices
USER node

EXPOSE 4000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "server.js"]
