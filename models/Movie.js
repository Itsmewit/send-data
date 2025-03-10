const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    downloadLink: { type: String, required: true },
    imageUrl: { type: String }, // Stores Image URL (if provided)
    imagePath: { type: String } // Stores uploaded image path (if uploaded)
});

module.exports = mongoose.model("Movie", MovieSchema);
