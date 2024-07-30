// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadProduct} = require('../controller/product.controller'); // Adjust the path according to your project structure



const router = express();


// Set up storage and file naming for multer
// Set up memory storage for multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });




// Define the route for uploading products
router.post('/uploadProduct', upload.single('image'), uploadProduct);

module.exports = router;
