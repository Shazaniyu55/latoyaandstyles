// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadProduct} = require('../controller/product.controller'); // Adjust the path according to your project structure

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Adjust the destination folder as needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Define the route for uploading products
router.post('/uploadProduct', upload.single('image'), uploadProduct);

module.exports = router;
