const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this field is correct
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Ensure this field is correct
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);
