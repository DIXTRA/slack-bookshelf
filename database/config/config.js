require('dotenv').config();
const debug = require('debug')('slack-bookshelf:server');

module.exports = {
  development: {
    forceSync: true,
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log,
    pool: { // connection pool configuration
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}
