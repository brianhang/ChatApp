FROM node:6

RUN npm config set registry https://registry.npmjs.org/
RUN npm install nodemon -g

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]