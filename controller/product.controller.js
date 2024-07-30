const Product = require('../model/product.model');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');

const uploadProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    try {
        let imageURL = '';

        // Check if there's a file to upload
        if (req.file) {
            // Create a stream from the file buffer
            const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).send('Error uploading image to Cloudinary');
                }
                imageURL = result.secure_url; // Get the URL of the uploaded image

                // Create and save the product after image upload
                createAndSaveProduct();
            });

            // Convert file buffer to stream and pipe it to Cloudinary
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            // Handle cases where no file is included
            createAndSaveProduct();
        }

        async function createAndSaveProduct() {
            const product = new Product({
                name,
                description,
                price,
                stock,
                image: imageURL
            });

            try {
                await product.save();
                res.redirect('/');
            } catch (error) {
                console.error('Error saving product:', error);
                res.status(500).send('Error saving product');
            }
        }
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).send('Error uploading product');
    }
};

module.exports = { uploadProduct };
