const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    Notification_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    User_ID: { type: DataTypes.INTEGER, allowNull: false },
    Message: { type: DataTypes.STRING(250), allowNull: false },
    Created_At: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    Is_Read: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'Notification', timestamps: false, createdAt: 'Created_At', updatedAt: false });
  return Notification;
};