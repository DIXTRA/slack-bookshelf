require('dotenv').config();

module.exports = {
  development: {
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
