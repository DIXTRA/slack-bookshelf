# slack-bookshelf

### Running on development

- Install dependencies: `npm install`
- build docker image: `docker-compose build`
- start docker: `docker-compose up`
- create database: `docker-compose exec server npx sequelize-cli db:create`
- sync models `docker-compose exec server npm run sync_db`
- seed database `docker-compose exec server npx sequelize-cli db:seed:all`

access ngrok dashboard: `http://localhost:4551`
