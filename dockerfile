# ---- STAGE 1: Build the app ----
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source
COPY . .

# Build the production bundle (adjust command if you use yarn or a different script)
RUN npm run build

# ---- STAGE 2: Serve with NGINX ----
FROM nginx:alpine
# Copy the compiled files from 'build' stage into /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 in the container
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
