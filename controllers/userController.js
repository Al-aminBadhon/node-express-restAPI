const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("express-validator");
const mailer = require("../helper/mailer");
const PasswordReset = require("../models/passwordResetModel");
const randomString = require("randomstring");
const { sendMailVerificationValidator } = require("../helper/validation");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blackList");

const userRegister = async (req, res) => {
  try {
    const isError = validator.validationResult(req);
    if (!isError.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: isError.array(),
      });
    }
    const { name, email, mobile, password } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exist",
      });
    }
    const hashdPass = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      password: hashdPass,
    });
    if (req.file) {
      userData.image = "images/" + req.file.filename;
    }
    const userData = await user.save();

    const msg = `<p>This is a confirmation email for user - ${userData.name} </p>. Please <a href= ${process.env.VERFICATION_LINK}${userData._id}>Verify</a> your account.`;

    mailer.sendMail(email, "Test Mail Verification", msg);

    return res.status(200).json({
      success: true,
      msg: "Registration completed successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const mailVerification = async (req, res) => {
  try {
    if (req.query.id == undefined) {
      return res.render("404");
    }

    const userId = await User.findOne({ _id: req.query.id });
    if (userId) {
      if (userId.isVerified == 1) {
        return res.render("mail-verification", {
          message: "Mail already verified succesfully!",
        });
      }
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            isVerified: 1,
          },
        }
      );

      return res.render("mail-verification", {
        message: "Mail has been verified succesfully!",
      });
    } else {
      return res.render("mail-verification", { message: "user not found!!!" });
    }
  } catch (error) {
    console.log("from catch", error.message);
    return res.render("404");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user doesn't exist for security
      return res.status(200).json({
        success: true,
        msg: "If your email is registered, you will receive a reset link",
      });
    }

    // Generate random token
    const token = randomString.generate();

    // Delete existing tokens for this user
    await PasswordReset.deleteMany({ user_id: user._id });

    // Save new token
    const passwordReset = new PasswordReset({
      user_id: user._id,
      token,
    });
    await passwordReset.save();

    // Send email with reset link
    const resetLink = `${process.env.RESET_PASSWORD_LINK}?token=${token}`;
    const message = `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`;

    mailer.sendMail(email, "Password Reset Request", message);

    return res.status(200).json({
      success: true,
      msg: "Password reset link sent to your email",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const sendMailVerification = async (req, res) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Generic response for security
      return res.status(200).json({
        success: true,
        msg: "If your email is registered, you will receive a verification link",
      });
    }

    // Check if already verified
    if (user.isVerfied) {
      return res.status(400).json({
        success: false,
        msg: "Email is already verified",
      });
    }

    // Resend verification email
    const msg = `<p>This is a confirmation email for user - ${user.name} </p>. 
        Please <a href="${process.env.VERFICATION_LINK}${user._id}">Verify</a> your account.`;

    mailer.sendMail(email, "Email Verification", msg);

    return res.status(200).json({
      success: true,
      msg: "Verification email sent successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
  } catch (error) {
    return res.render("404");
  }
};

const genAccessToken = async (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });
  return token;
};

const loginUser = async (req, res) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: errors.array(),
      });
    }

    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email or Password is incorrect!!!",
      });
    }
    const passwordMatched = await bcrypt.compare(password, userData.password);
    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        msg: "Email or Password is incorrect!!!",
      });
    }

    if (userData.isVerified == 0) {
      return res.status(400).json({
        success: false,
        msg: "Please Varify your account",
      });
    }
    const accessToken = await genAccessToken({ user: userData });

    return res.status(200).json({
      success: true,
      msg: "Logged in ",
      token: accessToken,
      user: userData,
      tokenType: "Bearer",
    });
  } catch (error) {
    return res.render("404");
  }
};

const userProfile = async (req, res) => {
  try {
    const userDetails = req.user.user;

    return res.status(200).json({
      success: true,
      msg: "User profile data",
      data: userDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.msg,
    });
  }
};
const userLogout = async (req, res) => {
  try {
    const bearerToken = req.token;
    console.log("logout token is :", bearerToken);
    const newBlackList = new BlackList({
      token: bearerToken,
    });
    await newBlackList.save();
    console.log("blacklisted");

    res.setHeader("Clear-site-Data", '"cookies", "storage"');
    console.log("cleared cache");

    return res.status(200).json({
      success: true,
      msg: "Successfully logged out!!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.msg,
    });
  }
};

module.exports = {
  userRegister,
  mailVerification,
  sendMailVerification,
  forgotPassword,
  resetPassword,
  loginUser,
  userProfile,
  userLogout,
};
