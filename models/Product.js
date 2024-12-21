const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['Electronics', 'Fashion', 'Home & Living', 'Home', 'Books', 'Sports & Fitness', 'Beauty & Health'],
            message: '{VALUE} is not a valid category'
        },
        // Convert input to first letter capitalized
        set: function(v) {
            return v.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        }
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    image: {
        type: String,
        default: '/images/placeholder.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a virtual for easy stock status
ProductSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Validation middleware
ProductSchema.pre('save', function(next) {
    if (!this.image) {
        this.image = '/images/placeholder.jpg';
    }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
