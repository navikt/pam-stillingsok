FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=optional_secret \
  npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/optional_secret)
RUN npm ci --prefer-offline --no-audit --ignore-scripts
COPY . .
RUN npm run build && npm prune --production --offline

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
CMD ["./node_modules/.bin/next", "start"]