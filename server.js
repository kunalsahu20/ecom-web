const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Colorful console logging
const chalk = require('chalk');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(chalk.green('✓ MongoDB connected successfully')))
.catch(err => {
    console.error(chalk.red('✗ MongoDB connection error:'), err);
    process.exit(1); // Exit the process if database connection fails
});

// Log any mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// GET all products with optional filtering
app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        
        // Build query object for filtering
        const query = {};
        
        // Filter by category (case-insensitive)
        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        
        // Filter by search term (case-insensitive)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Fetch products based on query
        const products = await Product.find(query);
        
        // If no products found, return empty array
        if (products.length === 0) {
            return res.json([]);
        }
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            message: 'Error fetching products', 
            error: error.message 
        });
    }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ 
            message: 'Error fetching product details', 
            error: error.message 
        });
    }
});

// POST new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;
        
        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ 
                message: 'Missing required product fields' 
            });
        }

        const newProduct = new Product({
            name, 
            description, 
            price, 
            category, 
            stock: stock || 0,
            image: image || '/images/placeholder.jpg'
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ 
            message: 'Error creating product', 
            error: error.message 
        });
    }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ 
            message: 'Error updating product', 
            error: error.message 
        });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await Product.findByIdAndDelete(productId);
        
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Routes
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: 'INR',
            receipt: 'order_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/verify-payment', (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

    if (razorpay_signature === expectedSign) {
        res.json({ success: true });
    } else {
        console.error('Error verifying payment:', 'Invalid signature');
        res.status(400).json({ success: false });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Print available URLs
function printAvailableURLs(port) {
    console.log(chalk.blue('\n🌐 Available URLs:'));
    console.log(chalk.green(`• Main Site:        http://localhost:${port}`));
    console.log(chalk.green(`• Admin Login:      http://localhost:${port}/admin/login.html`));
    console.log(chalk.yellow('\n💡 Tip: Open these URLs in your browser'));
}

// Start the server
const server = app.listen(PORT, () => {
    console.log(chalk.blue(`\n🚀 Server running on port ${PORT}`));
    printAvailableURLs(PORT);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await server.close();
        console.log('Server closed');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
