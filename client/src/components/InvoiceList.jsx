import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Fetch all invoices
    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/invoices');
            setInvoices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setLoading(false);
        }
    };

    // Delete an invoice
    const handleDelete = async (invoiceID) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await axios.delete(`http://localhost:3000/api/invoices/${invoiceID}`);
                alert('Invoice deleted successfully');
                fetchInvoices(); // Refresh list
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('Failed to delete invoice');
            }
        }
    };

    // Navigate to edit invoice page
    const handleEdit = (invoiceID) => {
        navigate(`/edit-invoice/${invoiceID}`);
    };

    return (
        <div className="container" >
            <h2 className="mb-4">Invoice List</h2>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Invoice ID</th>
                                <th>Order ID</th>
                                <th>Customer ID</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Invoice Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No invoices found.</td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.InvoiceID}>
                                        <td>{invoice.InvoiceID}</td>
                                        <td>{invoice.OrderID}</td>
                                        <td>{invoice.Customer_ID}</td>
                                        <td>{invoice.Quantity}</td>
                                        <td>${invoice.Unit_Price}</td>
                                        <td>{invoice.InvoiceDate}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(invoice.InvoiceID)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(invoice.InvoiceID)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;
