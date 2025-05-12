# Use the official Node.js 18 image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
# COPY .env ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your function will run on
EXPOSE 8080

# Start the Lambda function
CMD ["node", "index.js"]
