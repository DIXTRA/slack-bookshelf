module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Topic', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      }
    }
  }, { timestamps: true });
}
