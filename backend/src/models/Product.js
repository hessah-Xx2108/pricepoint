const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    Product_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Product_Name: { type: DataTypes.STRING(200), allowNull: false },
    Barcode: { type: DataTypes.STRING(50), unique: true },
    Brand: DataTypes.STRING(100),
    Category: DataTypes.STRING(100)
  }, { tableName: 'Product', timestamps: false });
  return Product;
};