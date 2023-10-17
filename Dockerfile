FROM navikt/node-express:16

USER root
RUN sed -i 's/^apprunner:x:[0-9]*:/apprunner:x:1069:/' /etc/group
RUN sed -i 's|^apprunner:x:[0-9]*:[0-9]*:\([^:]*\):/var/server|apprunner:x:1069:1069:\1:/app|' /etc/passwd
RUN rm /run-script.sh   # /entry-point.sh from base image prefers this file, but we discard it to use our own CMD.
WORKDIR /app
RUN chown apprunner:apprunner /app
USER apprunner

COPY --chown=apprunner package.json ./
COPY --chown=apprunner server/ ./server
COPY --chown=apprunner dist/ ./dist
COPY --chown=apprunner node_modules/ ./node_modules
COPY --chown=apprunner views/ ./views
COPY --chown=apprunner images/ ./images

VOLUME /app

EXPOSE 8080

CMD ["npm", "run", "start-express"]
