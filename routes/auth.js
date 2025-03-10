const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

// Render Login/Register Page
router.get("/login", (req, res) => res.render("login"));

// Handle Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Handle Registration
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.send("User already exists! Try a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user.");
  }
});

// Render Edit Profile Page
router.get("/edit-profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.render("edit-profile", { user: req.user });
});

// Handle Profile Update
router.post("/edit-profile", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const { username, password } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Error updating profile.");
  }
});

// Logout

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/login");
    });
});

module.exports = router;
