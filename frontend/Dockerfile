# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
# Remember: we are copying from the monorepo root
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# Run build - this will now pass because we fixed the budgets
RUN npx ng build --configuration=production

# Stage 2: Serve
FROM nginx:alpine
# We use the path identified from your angular.json
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy the SPA fix config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
