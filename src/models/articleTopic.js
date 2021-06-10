const { Model } = require('sequelize');

class ArticleTopic extends Model {}

module.exports = function (sequelize, DataTypes) {
  return ArticleTopic.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reviewedAt: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    sequelize,
    modelName: 'ArticleTopic',
  });
}
