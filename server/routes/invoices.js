const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Save invoice to the database
router.post('/invoices', (req, res) => {
    const { OrderID, Customer_ID, Quantity, Unit_Price, InvoiceDate } = req.body;

    if (!OrderID || !Customer_ID || !Quantity || !Unit_Price || !InvoiceDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO invoices (OrderID, Customer_ID, is_change_shipping TotalAmount, InvoiceDate) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [OrderID, Customer_ID,, InvoiceDate], (err, result) => {
        if (err) {
            console.error('Error inserting invoice:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Invoice saved successfully', invoiceID: result.insertId });
    });
});

// Get all invoices
router.get('/invoices', (req, res) => {
    const sql = 'SELECT * FROM invoices';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Get invoice by ID
router.get('/invoices/:id', (req, res) => {
    const sql = 'SELECT * FROM invoices WHERE InvoiceID = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching invoice:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(results[0]);
    });
});

router.put('/invoices/:id', (req, res) => {  
    const { OrderID, Customer_ID, Quantity, Unit_Price, InvoiceDate } = req.body;
    const sql = 'UPDATE invoices SET OrderID = ?, Customer_ID = ?,is_change_shipping = ?,TotalAmount = ?, InvoiceDate = ? WHERE InvoiceID = ?';
    db.query(sql, [OrderID, Customer_ID,  InvoiceDate, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating invoice:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice updated successfully' });
    });
});

// Delete an invoice
router.delete('/invoices/:id', (req, res) => {
    const sql = 'DELETE FROM invoices WHERE InvoiceID = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting invoice:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    });
});

module.exports = router;
