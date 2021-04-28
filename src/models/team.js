const { Model } = require('sequelize');

class Team extends Model {}

module.exports = function (sequelize, DataTypes) {
  return Team.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slackId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    modelName: 'Team',
    timestamps: true,
    sequelize,
    indexes: [
      { fields: ['slackId'], unique: true },
    ],
  });
}
