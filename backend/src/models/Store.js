const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    Store_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Store_Name: { type: DataTypes.STRING(100), allowNull: false },
    Branch_Location: DataTypes.STRING(100),
    GPS_Lat: DataTypes.DECIMAL(10, 7),
    GPS_Long: DataTypes.DECIMAL(10, 7)
  }, { tableName: 'Store', timestamps: false });
  return Store;
};