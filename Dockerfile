FROM node:14-alpine

WORKDIR /app 
COPY package.json /app 
COPY yarn.lock /app
RUN yarn install 
COPY . /app 
CMD ["node", "app.js"] 
EXPOSE 3000