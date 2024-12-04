const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    category: String,
    quantity: Number,
    rating: Object
});

module.exports = mongoose.model('Product', productSchema);
