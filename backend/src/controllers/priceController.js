const { Op } = require("sequelize");
const {
  PriceSubmission,
  Product,
  Store,
  User,
  RewardTransaction,
  Voucher,
} = require("../models");
const GPSService = require("../services/gpsService");

const generateVoucherCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "VP-";

  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user.id || req.user.User_ID || req.user.userId;

    const user = await User.findByPk(userId);

    const submissions = await PriceSubmission.findAll({
      where: { User_ID: userId },
      order: [["Submission_Time", "DESC"]],
    });

    const formatted = [];

    for (const item of submissions) {
      const product = await Product.findByPk(item.Product_ID);

      formatted.push({
        Submission_ID: item.Submission_ID,
        ProductName: product?.Product_Name || "Unknown",
        Submitted_Price: item.Submitted_Price,
        Status: item.Status,
        Price_Img: item.Price_Img,
      });
    }

    res.json({
      success: true,
      submissions: formatted,
      trustScore: user?.Total_Points || 0,
    });
  } catch (error) {
    console.error("GET MY SUBMISSIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const submitPrice = async (req, res) => {
  try {
    const {
      Submitted_Price,
      GPS_Lat,
      GPS_Long,
      Product_Name,
      Barcode,
      Brand,
      Category,
      Store_Name,
    } = req.body;

    const User_ID = req.user.id || req.user.User_ID || req.user.userId;

    let product = null;

    if (Product_Name) {
      product = await Product.findOne({
        where: {
          Product_Name: {
            [Op.iLike]: Product_Name,
          },
        },
      });
    }

    if (!product) {
      product = await Product.create({
        Product_Name,
        Barcode: Barcode || null,
        Brand: Brand || null,
        Category: Category || null,
      });
    }

    if (!Store_Name) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    const store = await Store.findOne({
      where: {
        Store_Name: {
          [Op.iLike]: Store_Name,
        },
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found. Please select a valid store.",
      });
    }

    if (!store.GPS_Lat || !store.GPS_Long) {
      return res.status(400).json({
        success: false,
        message:
          "This store is not supported for submissions yet. Please choose another store.",
      });
    }

    if (!GPS_Lat || !GPS_Long) {
      return res.status(400).json({
        success: false,
        message: "Location is required to submit a price.",
      });
    }

    const gpsCheck = GPSService.isWithinStoreRadius(
      GPS_Lat,
      GPS_Long,
      store.GPS_Lat,
      store.GPS_Long,
      20
    );

    if (!gpsCheck.isWithin) {
      return res.status(400).json({
        success: false,
        message: `You are too far from the store. Distance: ${Math.round(
          gpsCheck.distance
        )} meters.`,
      });
    }

    const submission = await PriceSubmission.create({
      User_ID,
      Product_ID: product.Product_ID,
      Store_ID: store.Store_ID,
      Submitted_Price,
      Price_Img: req.files?.main?.[0]?.path || null,
      Price_Img_2: req.files?.second?.[0]?.path || null,
      Price_Img_3: req.files?.third?.[0]?.path || null,
      GPS_Lat,
      GPS_Long,
      Status: "pending",
    });

    res.status(201).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("SUBMIT PRICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await PriceSubmission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.Status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Submission is already approved.",
      });
    }

    submission.Status = "approved";
    await submission.save();

    const user = await User.findByPk(submission.User_ID);

    const currentPoints = Number(user.Total_Points) || 0;
    const newPoints = currentPoints + 10;
    

    let voucherEarned = false;

    if (newPoints >= 100) {
      await Voucher.create({
        User_ID: user.User_ID,
        Store_Name: "Carrefour",
        Amount: 50,
        Voucher_Code: generateVoucherCode(),
        Expiry_Date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      user.Total_Points = 0;
      voucherEarned = true;
    } else {
      user.Total_Points = newPoints;
    }

    await user.save();

    await RewardTransaction.create({
      User_ID: submission.User_ID,
      Submission_ID: submission.Submission_ID,
      Points_Added: 10,
    });

    res.json({
      success: true,
      message: "Submission approved",
      voucherEarned,
    });
  } catch (error) {
    console.error("APPROVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getNearbyPrices = async (req, res) => {
  try {
    const { productId } = req.query;

    const prices = await PriceSubmission.findAll({
      where: { Product_ID: productId, Status: "approved" },
      include: [{ model: Store }],
      limit: 10,
    });

    res.json(prices);
  } catch (error) {
    console.error("GET NEARBY PRICES ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPricesByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const searchName = name.trim();

    const products = await Product.findAll({
      where: {
        Product_Name: {
          [Op.iLike]:
            searchName.length <= 1 ? `${searchName}%` : `%${searchName}%`,
        },
      },
    });

    if (products.length === 0) {
      return res.json({
        success: true,
        prices: [],
      });
    }

    const productIds = products.map((product) => product.Product_ID);

    const prices = await PriceSubmission.findAll({
      where: {
        Product_ID: {
          [Op.in]: productIds,
        },
        Status: "approved",
      },
      include: [{ model: Store }, { model: Product }],
      order: [["Submitted_Price", "ASC"]],
      limit: 3,
    });

    const formatted = prices.map((item) => ({
      store: item.Store?.Store_Name || "Unknown Store",
      price: item.Submitted_Price,
      status: item.Status,
      productName: item.Product?.Product_Name || name,
    }));

    res.json({
      success: true,
      prices: formatted,
    });
  } catch (error) {
    console.error("GET PRICES BY NAME ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await PriceSubmission.findAll({
      where: { Status: "pending" },
      order: [["Submission_Time", "DESC"]],
    });

    const formatted = [];

    for (const item of submissions) {
      const product = await Product.findByPk(item.Product_ID);
      const store = await Store.findByPk(item.Store_ID);
      const user = await User.findByPk(item.User_ID);

      formatted.push({
        Submission_ID: item.Submission_ID,
        User_Name: user?.Name || "Unknown User",
        User_Points: user?.Total_Points || 0,
        Product_Name: product?.Product_Name || "Unknown Product",
        Store_Name: store?.Store_Name || "Unknown Store",
        Submitted_Price: item.Submitted_Price,
        Status: item.Status,
        Submission_Time: item.Submission_Time,
        Price_Img: item.Price_Img,
        Price_Img_2: item.Price_Img_2,
        Price_Img_3: item.Price_Img_3,
      });
    }

    res.json({
      success: true,
      submissions: formatted,
    });
  } catch (error) {
    console.error("GET ALL SUBMISSIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProductName = async (req, res) => {
  try {
    const { submissionId, newName } = req.body;

    if (!submissionId || !newName) {
      return res.status(400).json({
        success: false,
        message: "Submission ID and product name are required.",
      });
    }

    const submission = await PriceSubmission.findByPk(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const product = await Product.findByPk(submission.Product_ID);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.Product_Name = newName.trim();
    await product.save();

    res.json({
      success: true,
      message: "Product name updated successfully.",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT NAME ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await PriceSubmission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.Status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Submission is already rejected.",
      });
    }

    submission.Status = "rejected";
    await submission.save();

    const user = await User.findByPk(submission.User_ID);

    const currentPoints = Number(user.Total_Points) || 0;
    const newPoints = Math.max(0, currentPoints - 10);

    user.Total_Points = newPoints;
    await user.save();

    res.json({
      success: true,
      message: "Submission rejected and trust score decreased",
      totalPoints: user.Total_Points,
    });
  } catch (error) {
    console.log("REJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyVouchers = async (req, res) => {
  try {
    const userId = req.user.id || req.user.User_ID || req.user.userId;

    const vouchers = await Voucher.findAll({
      where: { User_ID: userId },
      order: [["Created_At", "DESC"]],
    });

    res.json({
      success: true,
      vouchers,
    });
  } catch (error) {
    console.error("GET VOUCHERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMySubmissions,
  submitPrice,
  getNearbyPrices,
  getPricesByName,
  approveSubmission,
  getAllSubmissions,
  updateProductName,
  rejectSubmission,
  getMyVouchers,
};
