module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Team', {
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
    indexes: [
      { fields: ['slackId'], unique: true },
    ],
  }, { timestamps: true });
}
