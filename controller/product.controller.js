const Product = require('../model/product.model')

const uploadProduct = async (req, res)=>{
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : '';



    const product = new Product({
        name,
        description,
        price,
        stock,
        image
      });
    
      try {
        await product.save();
        res.redirect('/');
      } catch (error) {
        console.error('Error uploading product:', error); // Log the error
        res.status(500).send('Error uploading product');
      }
}

module.exports = {uploadProduct};