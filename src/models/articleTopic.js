module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ArticleTopic', {
    // Model attributes are defined here
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
    }
  }, { timestamps: true });
}
