const { sequelize } = require('../src/models');

sequelize.sync({ force: true });
