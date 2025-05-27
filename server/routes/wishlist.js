const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get user's wishlist
router.get('/:userId', (req, res) => {
    db.query(
        'SELECT p.* FROM Wishlist w JOIN Product p ON w.Product_ID = p.Product_ID WHERE w.User_ID = ?',
        [req.params.userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            res.json(result);
        }
    );
});

// Add to wishlist
router.post('/', (req, res) => {
    const { userId, productId } = req.body;
    db.query(
        'INSERT INTO Wishlist (User_ID, Product_ID) VALUES (?, ?)',
        [userId, productId],
        (err) => {
            if (err) return res.status(500).json({ error: 'DB error or already added' });
            res.json({ message: 'Added to wishlist' });
        }
    );
});

// Remove from wishlist
router.delete('/', (req, res) => {
    const { userId, productId } = req.body;
    db.query(
        'DELETE FROM Wishlist WHERE User_ID = ? AND Product_ID = ?',
        [userId, productId],
        (err) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            res.json({ message: 'Removed from wishlist' });
        }
    );
});

module.exports = router;
