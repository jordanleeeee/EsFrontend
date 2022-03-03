FROM node:16
WORKDIR /app
COPY package.json .

RUN npm install --only=production
COPY . ./

RUN npm run build

RUN npm install -g serve

CMD serve -s build
