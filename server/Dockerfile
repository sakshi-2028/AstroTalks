FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]