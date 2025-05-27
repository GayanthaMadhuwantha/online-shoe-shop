import React, { useState } from 'react';
import { jsPDF } from "jspdf";

import '../invoice.css';
import { useNavigate } from 'react-router-dom';

import axios from "axios";
const InvoiceForm = () => {
    const navigate = useNavigate();
    // Set initial states
    const [InvID, setInvoiceID] = useState('');
    const [orderID, setOrderID] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]); // Default to today


    // Calculate total amount based on quantity and unit price
    const totalAmount = (quantity * unitPrice).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoiceData = {
            OrderID: orderID,
            Customer_ID: customerID,
            Quantity: quantity,
            Unit_Price: unitPrice,
            InvoiceDate: invoiceDate,

        };
if(!InvID || !orderID || !customerID || quantity <= 0 || unitPrice <= 0) {
    alert("Please fill all fields correctly.");
    return;
}
        try {
            
            const response = await axios.post("http://localhost:3000/api/invoices", invoiceData);
            console.log("Invoice submitted successfully:", response.data);
            generatePDF(invoiceData);
            alert("Invoice submitted successfully!");
        } catch (error) {
            console.error("Error submitting invoice:", error);
            alert("Failed to submit invoice.");
        }
       
    };

    // Generate PDF
    const generatePDF = (data) => {
        if (!data || Object.keys(data).length === 0 || !data.InvoiceID || !data.OrderID) {
            alert("No data available to generate PDF.");
            return;
        }
        const totalAmount = (data.Quantity * data.Unit_Price).toFixed(2);
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Rave Collection - Invoice", 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        //doc.text(`Invoice ID: ${data.InvoiceID}`, 20, 40);
        doc.text(`Order ID: ${data.OrderID}`, 20, 50);
        doc.text(`Customer ID: ${data.Customer_ID}`, 20, 60);
        doc.text(`Quantity: ${data.Quantity}`, 20, 70);
        doc.text(`Unit Price: Rs. ${data.Unit_Price}`, 20, 80);
        doc.text(`Invoice Date: ${new Date()}`, 20, 85);
        doc.text(`Total Amount: Rs. ${totalAmount}`, 20, 90);

        doc.save(`Invoice_${data.InvoiceID}.pdf`);
    };

    // Simulating View, Update, and Delete Actions
    const handleView = () => {
        navigate('/invoices'); // Navigate to the Invoice List page
    };

    const handleUpdate = () => {
        console.log(`Updating Invoice: ${InvID}`);
        alert(`Updating Invoice: ${InvID}`);
    };

    const handleDelete = () => {
        console.log(`Deleting Invoice: ${InvID}`);
        alert(`Invoice ${InvID} Deleted`);
        // Reset Form Fields
        setInvoiceID('');
        setOrderID('');
        setCustomerID('');
        setQuantity(0);
        setUnitPrice(0);
    };

    return (
<div className="container" >
            <div className="row d-flex align-items-center justify-content-center">
                
                {/* Left Side: Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img 
                        src={require('../assest/shoes.png')} 
                        alt="Invoice" 
                        className="img-fluid "
                        style={{ width: "100%", height: "auto" }} 
                    />
                </div>

                {/* Right Side: Form */}
                <div className="col-md-6" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                    <div className="card shadow-lg p-4 mb-3 mt-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.51)',borderRadius: '20px'}}>
                        <div className="card-header  text-white text-center" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                            <h4>Create Invoice</h4>
                        </div>
                        <div className="card-body " style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}>
                            <form onSubmit={handleSubmit}>
                                
                                {/* Invoice ID */}
                                <div className="mb-3">
                                    <label className="form-label text-white ">Invoice ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={InvID}
                                        onChange={(e) => setInvoiceID(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Order ID */}
                                <div className="mb-3">
                                    <label className="form-label text-white">Order ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={orderID}
                                        onChange={(e) => setOrderID(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Customer ID */}
                                <div className="mb-3">
                                    <label className="form-label text-white">Customer ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={customerID}
                                        onChange={(e) => setCustomerID(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Quantity & Unit Price (Row Layout) */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-white">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-white">Unit Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Total Amount (Disabled) */}
                                <div className="mb-3">
                                    <label className="form-label text-white">Total Amount</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={totalAmount}
                                        disabled
                                    />
                                </div>

                                {/* Submit & PDF Buttons */}
                                <div className="d-flex gap-2 mb-3">
                                    <button type="submit" className="btn btn-success w-50">
                                        Submit Invoice
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-info w-50"
                                        onClick={generatePDF}
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </form>

                            {/* Action Buttons (View/Update/Delete) */}
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-warning flex-grow-1" onClick={handleView}>
                                    View Invoices
                                </button>
                               
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoiceForm;