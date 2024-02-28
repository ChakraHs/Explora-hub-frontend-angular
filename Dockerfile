# Stage 1: Build Angular application
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production and ignore warnings
RUN npm run build -- --configuration=production --warnings=false

# Stage 2: Serve Angular app using NGINX
FROM nginx:latest

# Set the working directory in NGINX container
WORKDIR /usr/share/nginx/html

# Copy the built Angular app to NGINX web server directory
COPY --from=builder /app/dist/* ./

# Expose port 80 (NGINX default port)
EXPOSE 80



# docker build -t explora-hub-front .
# docker run -d -p 4200:80 explora-hub-front