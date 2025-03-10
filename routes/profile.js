const express = require("express");
const router = express.Router();

// Profile Page Route
router.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.user });
});

module.exports = router;
