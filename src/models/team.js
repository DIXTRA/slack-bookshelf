module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Team', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slackId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    indexes: [
      { fields: ['slackId'], unique: true },
    ],
  })
}
