FROM node

WORKDIR /src
ADD . /src

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
