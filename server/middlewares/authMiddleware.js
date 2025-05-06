// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const auth = async (req, res, next) => {
//   const token = req.header.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Unauthorized" });
//   try {
//     const decoded = jwt.verify(token, "AUTHSECRETE");
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = auth;

const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res
        .status(400)
        .json({ message: "you are not authenticated ,please login" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { isLoggedIn };
