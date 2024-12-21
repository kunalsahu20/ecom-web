const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const initialProducts = [
    {
        name: "Premium Wireless Headphones",
        description: "High-quality noise-cancelling wireless headphones with long battery life",
        price: 2999.99,
        category: "Electronics",
        stock: 50,
        image: "/images/headphones.jpg"
    },
    {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with heart rate monitor and GPS",
        price: 4999.99,
        category: "Electronics",
        stock: 30,
        image: "/images/smartwatch.jpg"
    },
    {
        name: "Comfortable Cotton T-Shirt",
        description: "Soft, breathable cotton t-shirt in multiple colors",
        price: 799.99,
        category: "Fashion",
        stock: 100,
        image: "/images/tshirt.jpg"
    },
    {
        name: "Modern Coffee Table",
        description: "Elegant coffee table with storage space",
        price: 3499.99,
        category: "Home",
        stock: 20,
        image: "/images/coffee-table.jpg"
    },
    {
        name: "LED Smart TV",
        description: "4K Ultra HD Smart LED TV with built-in streaming apps",
        price: 29999.99,
        category: "Electronics",
        stock: 15,
        image: "/images/tv.jpg"
    },
    {
        name: "Denim Jeans",
        description: "Classic fit denim jeans with premium quality",
        price: 1499.99,
        category: "Fashion",
        stock: 75,
        image: "/images/jeans.jpg"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(initialProducts);
        console.log(`Seeded ${insertedProducts.length} products successfully`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();
