# Dockerfile - Client

# Stage 1: Build
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the Remix app
RUN npm run build

# Stage 2: Production
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built app from the build stage
COPY --from=build /app/public ./public
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 4000

# Command to run the app with serve
CMD ["serve", "-s", "public"]