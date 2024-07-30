// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadProduct} = require('../controller/product.controller'); // Adjust the path according to your project structure



const router = express();


// Set up storage and file naming for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/uploads'); // Directory to store the file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File naming
    }
});

const upload = multer({ storage: storage });




// Define the route for uploading products
router.post('/uploadProduct', upload.single('image'), uploadProduct);

module.exports = router;
