const express = require("express");
const path = require("path");

const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const profileRoutes = require("./routes/profile"); // Add this line

const app = express();
require("dotenv").config();
require("./passport-config");

connectDB();


// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", profileRoutes); // Ensure this is present

app.get("/", (req, res) => {
    res.redirect("/login"); // Redirect to login page
  });
  

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
