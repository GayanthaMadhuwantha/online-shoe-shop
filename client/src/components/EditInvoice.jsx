import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditInvoice = () => {
    const { id } = useParams(); // Get invoice ID from URL
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState({
        OrderID: '',
        Customer_ID: '',
        Quantity: '',
        Unit_Price: '',
        InvoiceDate: ''
    });

    useEffect(() => {
        fetchInvoice();
    }, []);

    // Fetch invoice data by ID
    const fetchInvoice = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/invoices/${id}`);
            setInvoice(response.data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    // Update invoice in database
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/invoices/${id}`, invoice);
            alert('Invoice updated successfully');
            navigate('/invoices'); // Redirect to invoice list
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Failed to update invoice');
        }
    };

    return (
        <div className="container " style={{ maxWidth: '600px', backgroundColor:'rgba(0, 0, 0, 0.44)', borderRadius: '20px', padding: '20px' }}>
            <h2 className="mb-4">Edit Invoice</h2>
            <form onSubmit={handleSubmit} className=" p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">Order ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="OrderID"
                        value={invoice.OrderID}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Customer ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Customer_ID"
                        value={invoice.Customer_ID}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Quantity"
                        value={invoice.Quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Unit Price:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Unit_Price"
                        value={invoice.Unit_Price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Invoice Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="InvoiceDate"
                        value={invoice.InvoiceDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Invoice</button>
            </form>
        </div>
    );
};

export default EditInvoice;
