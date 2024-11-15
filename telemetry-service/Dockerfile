# Use Node.js 18 as the base image
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json if present
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files to the container
COPY . .

# Expose the port the app runs on
EXPOSE 6000

# Start the application
CMD ["node", "server.js"]
