FROM node:18-alpine3.18 as build
COPY / ./web

WORKDIR /web
# Install global dependencies
RUN npm install

# Install & Build common
WORKDIR /web/common
RUN npm install
RUN npm run build

# Install & Build frontend
WORKDIR /web/frontend
RUN npm install
RUN npm run build --prod

# Move frontend to nginx & expose
FROM nginx:latest
COPY --from=build /web/frontend/dist/task-app /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
