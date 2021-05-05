# slack-bookshelf

### Running on development

- Install dependencies: `npm install`
- build docker image: `docker-compose build`
- start docker: `docker-compose up`
- setup the database: `docker-compose exec server npm run setup`
- If you need to sync the models: `docker-compose exec server npm run sync_db`

access ngrok dashboard: `http://localhost:4551`
