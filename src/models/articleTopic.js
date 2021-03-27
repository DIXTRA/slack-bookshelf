module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ArticleTopic', {
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
  }, { timestamps: true });
}
