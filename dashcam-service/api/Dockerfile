# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 7000 (the port your API listens on)
EXPOSE 7002

# Command to run your application
CMD ["node", "server.js"]
