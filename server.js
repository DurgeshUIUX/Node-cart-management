const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart")(io); // Import and pass 'io'
const productRoutes = require("./routes/product");
const Product = require("./models/product"); // Import the product model
const { dataConnectionMongo } = require("./database/dataConnection-mongo");

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set("view engine", "ejs");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

// Serve static files from the "public" directory
app.use(express.static("public"));

// View Routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.render("index", { products }); // Pass products to the template
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("a user connected");
// Ensure this name matches exactly with client-side
socket.on('cart-update', (cart) => {
    console.log('Received cart-update:', cart);
    io.emit('cart-update', cart);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

dataConnectionMongo(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
