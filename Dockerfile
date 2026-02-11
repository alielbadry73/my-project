# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install dependencies
RUN cd backend && npm ci --only=production

# Copy backend application code
COPY backend/ ./backend/

# Copy frontend files
COPY index.html ./
COPY js/ ./js/
COPY css/ ./css/
COPY images/ ./images/
COPY icomoon/ ./icomoon/
COPY admin-panel*.html ./
COPY courses.html ./
COPY frontend_index.html ./

# Create data directory for persistent storage
RUN mkdir -p /data

# Set permissions
RUN chown -R node:node /app /data

# Switch to non-root user
USER node

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start application
CMD ["node", "backend/server.js"]
