# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server code to the container
COPY . .

# Expose the port on which the server will listen
EXPOSE 3001

# Define the command to run your server
CMD [ "node", "server.js" ]
