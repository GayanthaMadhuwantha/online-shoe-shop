import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const CheckoutPage = ({ cart, setCart }) => {
  const { user } = useContext(AuthContext);
  const [shippingAddress, setShippingAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [UserID, setUserID] = useState(null);
  const [showShippingFields, setShowShippingFields] = useState(false);

  const navigate = useNavigate();
  const totalPrice = cart.reduce((sum, item) => sum + item.Quantity * item.Price, 0);
  const delivery = 350.0;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      setUserID(user.UserID);
      setUserAddress(user.Address);
      setUserName(user.FName+" "+user.LName);
    }
  }, [user]);
  

  const handleCompleteOrder = async () => {

    if (!user) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
    try {
      const isChangeShipping = showShippingFields ? "yes" : "no";
      const newShippingAddress = showShippingFields
        ? `${shippingAddress}, ${city}, ${postalCode}`
        : userAddress;

      const response = await axios.post("http://localhost:3000/api/orders/complete-order", {
        customerID: UserID,
        customerName: userName,
        cart,
        totalPrice,
        is_change_shipping: isChangeShipping,
        new_shipping_address: newShippingAddress,
      });

      alert("Order placed successfully!");
      console.log("Invoice saved at:", response.data.invoicePath);
      setCart([]);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Checkout Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold">Checkout</h1>
            <div className="progress" style={{ height: "4px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="row g-4">
            {/* Shipping Information */}
            <div className="col-md-7">
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0">Shipping Information</h5>
                </div>
                <div className="card-body">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="toggleShipping"
                      checked={showShippingFields}
                      onChange={(e) => setShowShippingFields(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="toggleShipping">
                      Ship to a different address?
                    </label>
                  </div>

                  {showShippingFields && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Shipping Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Street address, apartment, suite"
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0">Payment Method</h5>
                </div>

                <div className="card-body">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="creditCard"
                      defaultChecked
                    />
                    <label className="form-check-label d-flex align-items-center" htmlFor="creditCard">
                      <i className="bi bi-truck "> </i>
                      &nbsp;&nbsp;  Cash on Delivery
                    </label>
                  </div>

                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-3 sticky-top" style={{ top: "20px" }}>
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  {cart.map((item) => (
                    <div key={item.Product_ID} className="d-flex justify-content-between mb-3">
                      <div>
                        <p className="mb-1 fw-medium">{item.Product_Name}</p>
                        <small className="text-muted ">Size: {item.SelectedSize}</small>
                        <small className="text-muted ms-2">Qty: {item.Quantity}</small>
                        
                      </div>
                      <p className="fw-semibold">Rs.{(item.Quantity * item.Price).toFixed(2)}</p>
                    </div>
                  ))}

                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Delivery</span>
                    <span>Rs.{delivery.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>Rs.{(totalPrice + delivery).toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-success w-100 py-3 mt-4 rounded-pill fw-bold"
                    onClick={handleCompleteOrder}
                  >
                    Complete Order
                  </button>
                  <p className="text-center small text-muted mt-3">
                    <i className="bi bi-lock-fill me-2"></i>Your Details is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
