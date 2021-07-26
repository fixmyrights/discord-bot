FROM node:12.22.3-alpine

RUN apk upgrade --no-cache --update && \
    apk add --no-cache curl

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Copy Source code and set working directory
COPY . /home/node/app
COPY package*.json /home/node/app/

WORKDIR /home/node/app

RUN npm install --production

COPY --chown=node:node . /home/node/app

CMD [ "node", "src/index.js" ]
