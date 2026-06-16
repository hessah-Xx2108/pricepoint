const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    Admin_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Admin_Name: DataTypes.STRING(100),
    Email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    Password: { type: DataTypes.STRING(250), allowNull: false }
  }, { tableName: 'Admin', timestamps: false });
  return Admin;
};