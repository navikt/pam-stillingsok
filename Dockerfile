FROM node:carbon

WORKDIR /usr/src/app

COPY package.json ./

COPY server/ ./server
COPY dist/ ./dist
COPY node_modules/ ./node_modules
COPY views/ ./views
COPY images/ ./images

EXPOSE 8080

CMD ["npm", "run", "start-express"]
