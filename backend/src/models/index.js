const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const User = require("./User")(sequelize);
const Admin = require("./Admin")(sequelize);
const Product = require("./Product")(sequelize);
const Store = require("./Store")(sequelize);
const PriceSubmission = require("./PriceSubmission")(sequelize);
const RewardTransaction = require("./RewardTransaction")(sequelize);
const Notification = require("./Notification")(sequelize);
const Voucher = require("./Voucher")(sequelize);

User.hasMany(PriceSubmission, { foreignKey: "User_ID" });
PriceSubmission.belongsTo(User, { foreignKey: "User_ID" });

Product.hasMany(PriceSubmission, { foreignKey: "Product_ID" });
PriceSubmission.belongsTo(Product, { foreignKey: "Product_ID" });

Store.hasMany(PriceSubmission, { foreignKey: "Store_ID" });
PriceSubmission.belongsTo(Store, { foreignKey: "Store_ID" });

User.hasMany(RewardTransaction, { foreignKey: "User_ID" });

User.hasMany(Notification, { foreignKey: "User_ID" });

User.hasMany(Voucher, { foreignKey: "User_ID" });
Voucher.belongsTo(User, { foreignKey: "User_ID" });

module.exports = {
  sequelize,
  User,
  Admin,
  Product,
  Store,
  PriceSubmission,
  RewardTransaction,
  Notification,
  Voucher,
};
