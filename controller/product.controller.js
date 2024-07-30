const Product = require('../model/product.model')
const cloudinary = require('../cloudinary')
const uploadProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    try {
        let imageURL = '';

        // Check if there's a file to upload
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imageURL = result.secure_url; // Get the URL of the uploaded image
        }

        // Create a new product
        const product = new Product({
            name,
            description,
            price,
            stock,
            image: imageURL
        });

        // Save the product to the database
        await product.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error uploading product:', error); // Log the error
        res.status(500).send('Error uploading product');
    }
};

module.exports = {uploadProduct};