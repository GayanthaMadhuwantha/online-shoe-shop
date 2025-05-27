require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const invoiceRoutes = require('./routes/invoices');
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const wishlistRoutes = require('./routes/wishlist');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// API Routes
app.use('/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Handle React routing, return all requests to React app

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
