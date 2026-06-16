const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      User_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      Name: DataTypes.STRING(100),

      Email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },

      Password: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },

      Phone: {
        type: DataTypes.STRING(20),
        unique: true,
      },

      Role: {
        type: DataTypes.STRING(20),
        defaultValue: "user",
      },

     

      Total_Points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      Date_Created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      Date_Of_Birth: {
  type: DataTypes.DATEONLY,
  allowNull: true,
},
    },
    
    {
      tableName: "User",
      timestamps: false,
      createdAt: "Date_Created",
      updatedAt: false,
    }
  );

  return User;
};