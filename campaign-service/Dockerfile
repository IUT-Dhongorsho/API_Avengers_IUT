# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port (change per service)
EXPOSE 5001

# Default command
CMD ["npm", "run", "dev"]
