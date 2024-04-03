FROM node:18-alpine3.18 as build

WORKDIR /build
COPY / .
# Install global dependencies
RUN npm install

# Install & Build common
WORKDIR /build/common
RUN npm install
RUN npm run build
RUN cp -r /build/common /common

# Install & Run backend
WORKDIR /build/backend
RUN npm install
RUN npm run build

RUN mkdir /backend
RUN cp -r dist /backend/dist
RUN cp -r node_modules /backend/node_modules

WORKDIR /backend
RUN rm -rf /web

RUN mkdir attachments

EXPOSE 3000
CMD ["node", "dist/src/main"]
#CMD tail -f /dev/null
