# --- Build Stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm install

# Copy source and compile production build
COPY . .
RUN npm run build

# --- Run Stage ---
FROM nginx:alpine

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start server
CMD ["nginx", "-g", "daemon off;"]
