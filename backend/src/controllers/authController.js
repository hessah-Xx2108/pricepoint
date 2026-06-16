const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

const register = async (req, res) => {
  try {
    const { Name, Email, Password, Phone } = req.body;

    if (!validatePassword(Password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.",
      });
    }

    const existingEmail = await User.findOne({ where: { Email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingPhone = await User.findOne({ where: { Phone } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      Name,
      Email,
      Password: hashedPassword,
      Phone,
      Role: "user",
      Total_Points: 0,
    });

    const token = jwt.sign(
      { id: user.User_ID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        phone: user.Phone,
        role: user.Role,
        totalPoints: user.Total_Points,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.User_ID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        phone: user.Phone,
        role: user.Role,
        totalPoints: user.Total_Points,
        dateOfBirth: user.Date_Of_Birth,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["Password"] },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.User_ID || req.user.userId;
    const { Name, Phone, Date_Of_Birth } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.Name = Name;
    user.Phone = Phone;
    user.Date_Of_Birth = Date_Of_Birth || null;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        phone: user.Phone,
        role: user.Role,
        totalPoints: user.Total_Points,
        dateOfBirth: user.Date_Of_Birth,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = { register, login, getProfile , updateProfile};
