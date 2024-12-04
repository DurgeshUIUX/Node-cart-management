const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

Product.deleteMany({})
    .then(result => {
        console.log(`${result.deletedCount} products deleted`);
        mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    });
