// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadProduct} = require('../controller/product.controller'); // Adjust the path according to your project structure

const router = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Define the route for uploading products
router.post('/uploadProduct', upload.single('image'), uploadProduct);

module.exports = router;
