const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RewardTransaction = sequelize.define('RewardTransaction', {
    Transaction_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    User_ID: { type: DataTypes.INTEGER, allowNull: false },
    Submission_ID: { type: DataTypes.INTEGER, allowNull: false },
    Points_Added: { type: DataTypes.INTEGER, allowNull: false },
    Transaction_Time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'Reward_Transaction', timestamps: false, createdAt: 'Transaction_Time', updatedAt: false });
  return RewardTransaction;
};