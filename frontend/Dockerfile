# Use the official Node.js 18 image
FROM node:18-alpine

# Set the working directory
WORKDIR app/

# Copy package files and install dependencies
COPY package.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Install a simple HTTP server to serve the frontend
RUN npm install -g serve

# Expose the port for the frontend
EXPOSE 3000

# Serve the built frontend
CMD ["serve", "-s", "build", "-l", "3000"]
