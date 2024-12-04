const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Import the Cart model
const Product = require('../models/product'); // Import the Product model
const { protect } = require('../middleware');
module.exports = (io) => {
    // Middleware to check authentication if needed

    // Add item to cart
    router.post('/add', protect, async (req, res) => {
        try {
            const { productId, quantity } = req.body; // Ensure 'productId' is used
            const userId = req.user._id.toString(); // Ensure 'userId' is correct

            console.log(productId ,quantity,  userId);
    
            if (!productId || !quantity) {
                return res.status(400).json({ message: 'Product ID and quantity are required' });
            }
    
            let cart = await Cart.findOne({ userId: userId });
    
            if (!cart) {
                cart = new Cart({ userId: userId, items: [] });
            }
    
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId: productId, quantity: quantity });
            }
    
            await cart.save();
            console.log('cart: ', cart)
            // Emitting an event
            io.emit('cart-update', cart);
            // Redirect to cart page
            res.json(cart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
    

    // Update item quantity in cart
    router.post('/update', protect, async (req, res) => {
        try {
            const { itemId, quantity } = req.body;
            const userId = req.user._id;

            // Find the user's cart
            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            // Update item quantity
            const item = cart.items.find(item => item.product.equals(itemId));
            if (!item) return res.status(404).json({ message: 'Item not found in cart' });

            item.quantity = quantity;
            await cart.save();

            // Emit cart update event
            io.emit('cart-update', cart);

            res.json(cart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });

    // Remove item from cart
    router.post('/remove', protect, async (req, res) => {
        try {
            const { itemId } = req.body;
            const userId = req.user._id;

            // Find the user's cart
            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            // Remove item
            cart.items = cart.items.filter(item => !item.product.equals(itemId));
            await cart.save();

            // Emit cart update event
            io.emit('cart-update', cart);

            res.json(cart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });

    // Get cart details
    router.get('/cart', protect, async (req, res) => {
        try {
            const userId = req.user._id; // Ensure `req.user` is populated by the authentication middleware
            
            // Fetch the cart for the user from the database
            const cart = await Cart.findOne({ userId: userId }).populate('items.product');
            console.log('cart : ', cart)
            
            if (!cart) {
                // If the cart is not found, render an empty cart page
                return res.render('cart', { cart: { items: [] } }); // Pass an empty cart object
            }
            
            // Render the cart page with the cart data
            res.render('cart', { cart });
        } catch (err) {
            console.error('Error fetching cart:', err);
            res.status(500).send('Server error');
        }
    });
    

    return router;
};
