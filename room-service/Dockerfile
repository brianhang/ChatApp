FROM node:6

RUN npm config set registry https://registry.npmjs.org/
RUN npm install nodemon -g
RUN npm install @angular/cli -g

WORKDIR /usr/app

COPY . .
RUN npm install --quiet

EXPOSE 8080
CMD ["nodemon", "-L", "/usr/app/index.js"]