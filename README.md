# Introduction
At [Dixtra](https://dixtra.com) one of our main values is enjoy the process which motive us doing what we like, for this reason we have different instances [Learn more](https://dixtra.com) for building apps we enjoy and for the community. For this reason we want to introduce Bookshelf.

## Bookshelf
Bookshelf allows collaborators who belong to the same slack workspace to have their library of articles or links of interest and access easily and quickly with a slack commands.

In addition, the team can have a common library managed by the workspace administrators who are the ones who can accept, decline or delete links or articles that the collaborators added for a specific topic in order to be able to share it with new collaborators or channels.



## Usage



### Running on development

- Install dependencies: `npm install`
- build docker image: `docker-compose build`
- start docker: `docker-compose up`
- setup the database: `docker-compose exec server npm run setup`
- If you need to sync the models: `docker-compose exec server npm run sync_db`

access ngrok dashboard: `http://localhost:4551`

## About Dixtra

![alt text](https://www.dixtra.com/static/assets/images/dixtra-hex.png)

