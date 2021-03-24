module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    slackId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['slackId'], unique: true },
    ],
  });
}
