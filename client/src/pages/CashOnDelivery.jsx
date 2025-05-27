import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CashOnDelivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const [customerID, setCustomerID] = useState("");

  // Handle Order Submission
  const placeOrder = async () => {
    if (!customerID) {
      alert("Please enter your Customer ID.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/orders/place-order", {
        customerID,
        cart,
      });

      if (response.data.success) {
        alert("Order placed successfully! Your Order ID: " + response.data.orderID);
        navigate("/"); // Redirect to homepage
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Failed to place order. Please try again."+error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Cash on Delivery</h2>
      <p className="text-center">Enter your details to place the order.</p>

      {/* Customer ID Input */}
      <div className="mb-3">
        <label className="form-label">Customer ID</label>
        <input
          type="text"
          className="form-control"
          value={customerID}
          onChange={(e) => setCustomerID(e.target.value)}
          required
        />
      </div>

      <h4>Order Summary</h4>
      <ul className="list-group">
        {cart.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            {item.Product_Name} - ${item.Price} x {item.Quantity}
          </li>
        ))}
      </ul>

      {/* Place Order Button */}
      <div className="text-center mt-4">
        <button className="btn btn-success" onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default CashOnDelivery;
