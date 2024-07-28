//all the imported libaries for my projects 
const express =require("express");
const app =express();
const PORT = process.env.PORT || 2300;
const mongoose = require("mongoose")
const path = require("path")
const authRoutes = require('./routes/auth.route')
const bodyparser = require('body-parser')
const errorHandler = require('./util/error')
const nodemailer = require('nodemailer')
const multer = require('multer')
const Product = require("./model/product.model")
const User = require("./model/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const session = require('express-session');
//connecttion to the mongo db database using mongoose.


// Configure session middleware
app.use(session({
    secret: 'latoyastore', // replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set secure: true if using HTTPS
}));





//middleware to parse json requests
app.use(bodyparser.json())
//mongoDb connnection URL
var connectionUrl = "mongodb+srv://shazaniyu:shazaniyu@cluster0.jiw1f31.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(connectionUrl).then(
    ()=>{
        console.log("DataBase connected")
    }
).catch((err)=>{
    console.log(err)
})
//to host statics files
app.use(express.static(path.join(__dirname, 'assets')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'assets/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });


// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.urlencoded({extended: false}))

let cart = [];
// Route to add an item to the cart
app.post('/cart/add', async (req, res) => {
    const { productId, quantity, productImage } = req.body;

    try {
        // Use async/await to find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Initialize cart in session if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Find if the product is already in the cart
        const cartItem = req.session.cart.find(item => item.productId === productId);

        if (cartItem) {
            // Update quantity if item already exists
            cartItem.quantity += parseInt(quantity, 10);
        } else {
            // Add new item to cart
            req.session.cart.push({
                productId,
                quantity: parseInt(quantity, 10),
                name: product.name,
                price: product.price,
                image: productImage
            });
        }

        // Optionally store the cart in the session if needed
        // req.session.cart = req.session.cart;

        // Redirect to the cart page
        res.redirect('/cart');

    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).send('Error adding item to cart');
    }
});

// Route to remove an item from the cart
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;

    // Initialize cart in session if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Find index of the product to remove
    const itemIndex = req.session.cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
        req.session.cart.splice(itemIndex, 1); // Remove the item
        res.redirect('/cart'); // Redirect to the cart page
    } else {
        res.status(404).send('Item not found');
    }
});


app.get('/cart', (req, res) => {
    // Ensure cart is initialized
    const cart = req.session.cart || [];
    let total = 0;

    // Calculate total price
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    res.render('cart', {
        cart: cart,
        total: total
    });
});






// Login Route
app.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create and sign JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "JWT_SECRET", { expiresIn: '1h' });

               // Set the token as a cookie
               res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token expires in 1 hour
               res.render('upload');


    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to authenticate JWT tokens
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, "JWT_SECRET", (err, decoded) => {
        if (err) {
            return res.redirect('/adminlogin');
        }
        req.user = decoded;
        next();
    });
};


// Admin Dashboard Route (protected)
app.get('/admin-dashboard', authMiddleware, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    // res.json({ message: 'Welcome to the admin dashboard!' });
      res.render('upload', { user: req.user });
});


// Routes to render frontend html
// app.get('/upload', (req, res) => {
//     res.render('upload');
//   });
  
  //upload functionality to upload the image to the product database
  app.post('/upload', upload.single('image'), async (req, res) => {
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
      res.status(500).send('Error uploading product');
    }
  });
  
  //display all the product from the mongodb in my index page
  app.get('http://153.92.211.45:2300/',  async(req, res) => {
    
    try {
      const products = await Product.find();
      res.render('index');
    } catch (error) {
      res.status(500).send('Error fetching products');
    }

    // res.render('index')
  });


  //get product by their Id that is on the mongoDb database collections.
  app.get('/cart/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const products = await Product.findById(id);

        if (!products) {
            return res.status(404).send('Product not found');
        }

        res.render('productDetails', { products });
    } catch (error) {
        res.status(500).send('Error fetching product');
    }
});

// api routes for email those who message ur email
app.post('/send-email', (req, res) => {
    const { fullname, email, message } = req.body;

    console.log(fullname, email, message)

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        // Specify your email service provider
        service: 'Gmail', // e.g., 'gmail', 'hotmail', etc.
        auth: {
            user: 'shazaniyu@gmail.com', // Your email address
            pass: 'qkyfkijphqdixilh' // Your email password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // Setup email data
    let mailOptions = {
        from: 'shaazaniyu@gmail.com', // Sender address
        to: 'zoeadoree33@gmail.com, shazaniyu@gmail.com, ebere.tracy@yahoo.com', // List of recipients
        subject: 'LatayoStore', // Subject line
        text: `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
        // You can add HTML to the email if needed
        // html: '<p>Name: ' + name + '</p><p>Email: ' + email + '</p><p>Message: ' + message + '</p>'
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
          res.send(`Email sent successfully!`);
    });
});


//api routes for user who send their email to subscribe to news letter
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    console.log( email)

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        // Specify your email service provider
        service: 'Gmail', // e.g., 'gmail', 'hotmail', etc.
        auth: {
            user: 'shazaniyu@gmail.com', // Your email address
            pass: 'qkyfkijphqdixilh' // Your email password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // Setup email data
    let mailOptions = {
        from: 'shaazaniyu@gmail.com', // Sender address
        to: 'zoeadoree33@gmail.com, shazaniyu@gmail.com, ebere.tracy@yahoo.com',// List of recipients
        subject: 'LatayoStore Subscribers Email', // Subject line
        text: `Name: Email: ${email}`, // Plain text body
        // You can add HTML to the email if needed
        // html: '<p>Name: ' + name + '</p><p>Email: ' + email + '</p><p>Message: ' + message + '</p>'
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
          res.send(`Email sent successfully!`);
    });
});


app.use('/api/auth', authRoutes)

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/product', async (req,res)=>{
    try {
        const products = await Product.find();
        res.render('product', { products });
      } catch (error) {
        res.status(500).send('Error fetching products');
      }
})


app.get('/about', (req,res)=>{
    res.render( 'about')
})

app.get('/login', (req,res)=>{
    res.render('login')
})


app.get('/admin', (req, res)=>{
    res.render('adminlogin')
})



app.get('/contact', (req,res)=>{
    res.render('contact')
})

app.get('/signup', (req,res)=>{
    res.render('signup')
})

app.get('/checkout', (req, res) => {
    // Assuming you have some way to get the cart data from the session or database
    const cart = req.session.cart || []; // Example: Get cart from session
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Example: Calculate total

    res.render('checkoutpage', { cart, total });
});


app.listen(PORT, ()=>{
    console.log(`server runnings at http://153.92.211.45:2300/:${PORT}`)
})