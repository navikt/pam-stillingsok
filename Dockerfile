FROM gcr.io/distroless/nodejs20-debian12

ENV NODE_ENV production
ENV TZ "Europe/Oslo"
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

WORKDIR /app

COPY /public ./public
COPY /.next/standalone ./
COPY /.next/static ./.next/static

EXPOSE 3000

CMD ["server.js"]
