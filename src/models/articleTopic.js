const { Model } = require('sequelize');

class ArticleTopic extends Model {}

module.exports = function (sequelize, DataTypes) {
  return ArticleTopic.init({
    // Model attributes are defined here
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    reviewedAt: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: true,
    sequelize,
    modelName: 'ArticleTopic',
  });
}
