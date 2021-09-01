'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Packages.init(
    {
      package_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      code_package: DataTypes.STRING,
      name_package: DataTypes.STRING,
      size_limit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Packages',
      timestamps: false,
      // I don't want createdAt
      createdAt: false,
      updatedAt: false,
      id: false,
    },
  );
  return Packages;
};
