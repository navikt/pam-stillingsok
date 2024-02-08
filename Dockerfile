FROM node:20-alpine as build
ARG VERSION_TAG
ENV SENTRY_RELEASE pam-stillingsok@$VERSION_TAG
ENV TZ=Europe/Oslo
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=optional_secret \
  npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/optional_secret)
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build


FROM gcr.io/distroless/nodejs20-debian12
COPY --from=build --chown=nonroot:nonroot /app /app
WORKDIR /app
USER nonroot
EXPOSE 8080
CMD ["server/server.js"]
