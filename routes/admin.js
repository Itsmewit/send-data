const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Movie = require("../models/Movie");

// Multer Storage Configuration (Stores files in "uploads" folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store uploaded files in the "uploads/" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({ storage: storage });

// Render Admin Dashboard (List Movies)
router.get("/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");

    try {
        const movies = await Movie.find();
        res.render("dashboard", { movies });
    } catch (error) {
        res.status(500).send("Error fetching movies.");
    }
});

// Render Add Movie Page
router.get("/add-movie", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    res.render("add-movie");
});

// Handle Adding a Movie
router.post("/add-movie", upload.single("moviePoster"), async (req, res) => {
    try {
        console.log("📥 Received movie data:", req.body);
        console.log("🖼 Uploaded file:", req.file);

        const { name, description, tags, downloadLink } = req.body;
        if (!name || !description || !tags || !downloadLink) {
            console.log("❌ Missing required fields!");
            return res.status(400).send("All fields are required.");
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newMovie = new Movie({
            name,
            description,
            tags: tags.split(",").map(tag => tag.trim()),
            downloadLink,
            imageUrl
        });

        await newMovie.save();
        console.log("✅ Movie added successfully!");
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("❌ Error adding movie:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

// Render Edit Movie Page
router.get("/edit-movie/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");

    try {
        const movie = await Movie.findById(req.params.id);
        res.render("edit-movie", { movie });
    } catch (error) {
        res.status(500).send("Movie not found.");
    }
});

// Handle Updating a Movie
router.post("/edit-movie/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");

    const { name, description, tags, downloadLink } = req.body;
    try {
        await Movie.findByIdAndUpdate(req.params.id, {
            name,
            description,
            tags: tags.split(","),
            downloadLink,
        });

        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(500).send("Error updating movie.");
    }
});

// Handle Deleting a Movie
router.get("/delete-movie/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");

    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(500).send("Error deleting movie.");
    }
});

// Route to get all movies
router.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("admin-movies", { movies });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
