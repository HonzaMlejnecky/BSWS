# Stage 1: Build FE
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # vytvoří dist

# Stage 2: Production není potřeba, Apache mountuje dist
CMD ["/bin/true"]
