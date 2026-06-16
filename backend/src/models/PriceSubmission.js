const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PriceSubmission = sequelize.define('PriceSubmission', {
    Submission_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    User_ID: { type: DataTypes.INTEGER, allowNull: false },
    Product_ID: { type: DataTypes.INTEGER, allowNull: false },
    Store_ID: { type: DataTypes.INTEGER, allowNull: false },
    Submitted_Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },


    Price_Img: DataTypes.STRING(300),
    Price_Img_2: DataTypes.STRING(300),
    Price_Img_3: DataTypes.STRING(300),

    GPS_Lat: DataTypes.DECIMAL(10, 7),
    GPS_Long: DataTypes.DECIMAL(10, 7),

    Submission_Time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    Status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
  }, {
    tableName: 'Price_Submission',
    timestamps: false,
    createdAt: 'Submission_Time',
    updatedAt: false
  });

  return PriceSubmission;
};