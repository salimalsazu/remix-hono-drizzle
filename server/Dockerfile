# Dockerfile - Server

FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose port
EXPOSE 5000

# Command to run the server
CMD ["npm", "start"]
