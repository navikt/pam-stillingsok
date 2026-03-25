FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24

ENV NODE_ENV=production
ENV TZ="Europe/Oslo"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

COPY /public ./public
COPY /.next/standalone ./
COPY /.next/static ./.next/static
COPY /next-logger.config.cjs /app/

EXPOSE 3000

CMD ["server.js"]
