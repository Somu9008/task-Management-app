const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: "https://task-management-app-mu-ten.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRETEKEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      maxAge: 86400000,
      httpOnly: true,
      secure: "production", // important
      sameSite: "none", // 💥 required for cookies across Vercel <-> Render
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("server runing");
});

module.exports = app;
