
FROM node:14-alpine

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

COPY . /usr/src/nuxt-app/
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
