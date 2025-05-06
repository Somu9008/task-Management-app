const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });

    req.session.userId = user._id;

    await user.save();
    res.status(201).json({
      message: "user reqgisterd successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credantials" });

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user._id;

    return res.status(200).json({
      message: "Login successfull",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error" });
  }
};

exports.me = async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId).select("-password");
      if (user) {
        res.json({ user }); // send full user object
      } else {
        res.status(401).json({ message: "User not found" });
      }
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie();
    res.status(200).json({ message: "Logged out" });
  });
};

exports.allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
