const express = require("express");
const router = express.Router();
const db = require("../config/db");


// Fetch all products
router.get("/products", (req, res) => {
  const sql = "SELECT p.*,c.Category_Name FROM Product p JOIN Category c ON p.Category_ID = c.Category_ID";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});

// GET product by ID
router.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT p.Product_ID, p.Product_Name, p.Brand, p.Description, p.Price, p.Img_URL, p.Category_ID, p.Created_Date,v.Size, v.Stock_Quantity FROM Product p 
LEFT JOIN Product_variants v ON p.Product_ID = v.Product_ID WHERE p.Product_ID = ?`;

  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });

    const product = {
      Product_ID: results[0].Product_ID,
      Product_Name: results[0].Product_Name,
      Brand: results[0].Brand,
      Description: results[0].Description,
      Price: results[0].Price,
      Img_URL: results[0].Img_URL,
      Category_ID: results[0].Category_ID,
      sizes: results.map(row => ({
        size: row.Size,
        stock: row.Stock_Quantity
      }))
    };

    res.json(product);
  });
});


router.get('/products/:id/comments', (req, res) => {
  const productId = req.params.id;
  db.query('SELECT * FROM product_comments WHERE product_id = ?', [productId], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(result); // Return all comments for the product
  });
});

// Add a new comment for a specific product
router.post('/products/:id/comments', (req, res) => {
  const productId = req.params.id;
  const { content} = req.body;
  const {username} = req.body;
  // Validate input
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content cannot be empty" });
  }

  // Insert new comment into the database
  const query = 'INSERT INTO product_comments (product_id, content, username) VALUES (?, ?, ?)';
  db.query(query, [productId, content, username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'DB error', details: err });
    }

    // Return the newly created comment with the date inserted
    const newComment = {
      id: result.insertId,
      product_id: productId,
      content: content,
      username: username,
      date: new Date(),
    };
    res.status(201).json(newComment); // Return the new comment with the ID and date
  });
});


module.exports = router;
