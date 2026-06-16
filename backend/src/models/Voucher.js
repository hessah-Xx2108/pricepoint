const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Voucher = sequelize.define(
    "Voucher",
    {
      Voucher_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      Store_Name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      Expiry_Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      Created_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      Voucher_Code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Voucher",
      timestamps: false,
    }
  );

  return Voucher;
};