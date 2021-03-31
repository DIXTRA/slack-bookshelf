const { Sequelize, DataTypes } = require('sequelize');
const envConfigs =  require('../config/database');
const env = process.env.NODE_ENV || 'development';

const config = envConfigs[env];

let sequelize;

if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// create models
const models = {
  Team: require('./team')(sequelize, DataTypes),
  User: require('./user')(sequelize, DataTypes),
  Article: require('./article')(sequelize, DataTypes),
  Topic: require('./topic')(sequelize, DataTypes),
  ArticleTopic: require('./articleTopic')(sequelize, DataTypes),
};

// User belongs to a Team
models.Team.hasMany(models.User);
models.User.belongsTo(models.Team);
// Topic belongs to a Team
models.Topic.belongsTo(models.Team);
models.Team.hasMany(models.Topic);
// Article is added to a Topic
models.Article.belongsToMany(models.Topic, { through: models.ArticleTopic });
// Article is added to a User
models.Article.belongsToMany(models.User, { through: 'UserArticles' });

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  ...models,
};

module.exports = db;
