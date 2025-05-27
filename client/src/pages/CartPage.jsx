import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { AuthContext } from "../components/AuthContext";
import './cart.css'; // Import custom CSS for styling

const CartPage = ({ cart, setCart }) => {
  const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const handleQuantityChange = (index, delta) => {
        const newCart = [...cart];
        newCart[index].Quantity += delta;
        if (newCart[index].Quantity === 0) {
            newCart.splice(index, 1); // Remove item if quantity is zero
        }
        setCart(newCart);
    };

    const handleCheckout = () => {
      if (user) {
        navigate("/checkout");
      } else {
        navigate("/login", { state: { from: "/checkout" } });
      }
    };

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + item.Quantity * item.Price, 0);

    return (
   
      <div className="container py-5">
      <div className="row row justify-content-center">
        {/* Main Cart Content */}
        <div className="col-lg-8">
          {/* Cart Header */}
         
    
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="container py-5 text-center">
               <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{maxWidth: "600px"}}>
              <i className="bi bi-cart-x text-muted" style={{fontSize: "5rem", opacity: 0.3}}></i>
              <h3 className="mt-3 fw-bold">Your Cart is Empty</h3>
              <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet</p>
              <button 
                className="btn btn-dark rounded-pill px-4 py-2"
                onClick={() => navigate("/products")}
              >
                <i className="bi bi-arrow-left me-2"></i> Continue Shopping
              </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold mb-0">
              <i className="bi bi-bag-heart-fill text-primary me-2"></i>
              Your Shopping Bag
            </h1>
            <span className="badge bg-primary rounded-pill px-3 py-2">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              
                <div className="card-body p-0">
                  {cart.map((item, index) => (
                    <div key={index} className="p-4 border-bottom">
                      <div className="d-flex">
                        {/* Product Image */}
                        <div 
                          className="flex-shrink-0 me-4 cursor-pointer"
                          onClick={() => navigate(`/product/${item.Product_ID}`)}
                          style={{width: "120px", height: "120px"}}
                        >
                          <img
                            src={item.Img_URL || 'https://via.placeholder.com/300'}
                            alt={item.Product_Name}
                            className="img-fluid rounded-3 h-100 w-100 object-fit-cover"
                          />
                        </div>
    
                        {/* Product Details */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5 className="fw-semibold mb-1">{item.Product_Name}</h5>
                              <p className="text-muted small mb-2">
                                Size: {item.SelectedSize || 'M'} | Color: {item.Color || 'Black'}
                              </p>
                            </div>
                            <h5 className="text-primary fw-bold">Rs.{(item.Price * item.Quantity).toFixed(2)}</h5>
                          </div>
    
                          {/* Quantity Controls */}
                          <div className="d-flex align-items-center mt-3">
                            <div className="quantity-control d-flex align-items-center border rounded-pill px-3">
                              <button 
                                className="btn btn-link p-0 border-0"
                                onClick={() => handleQuantityChange(index, -1)}
                                disabled={item.Quantity <= 1}
                              >
                                <i className="bi bi-dash-lg"></i>
                              </button>
                              <span className="mx-3 fw-medium">{item.Quantity}</span>
                              <button 
                                className="btn btn-link p-0 border-0"
                                onClick={() => handleQuantityChange(index, 1)}
                              >
                                <i className="bi bi-plus-lg"></i>
                              </button>
                            </div>
                            
                            <button 
                              className="btn btn-link text-danger ms-auto"
                              onClick={() => handleQuantityChange(index, -item.Quantity)}
                            >
                              <i className="bi bi-trash-fill me-1"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Promo Code */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">
                    <i className="bi bi-tag-fill text-success me-2"></i>
                    Apply Promo Code
                  </h5>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control py-3" 
                      placeholder="Enter promo code"
                    />
                    <button className="btn btn-success px-4" type="button">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <button 
              className="btn btn-dark w-100 py-3 rounded-pill fw-bold mb-3"
              onClick={handleCheckout}
            >
              <i className="bi bi-lock-fill me-2"></i> Secure Checkout
            </button>
            
            <button 
              className="btn btn-outline-dark w-100 py-3 rounded-pill"
              onClick={() => navigate("/products")}
            >
              <i className="bi bi-arrow-left me-2"></i> Continue Shopping
            </button>
            </>
          )}
        </div>
    
        {/* Order Summary - Sticky on desktop 
        {cart.length > 0 && (
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{top: "20px"}}>
              <div className="card-body">
                <h5 className="fw-semibold mb-4">Order Summary</h5>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>Rs.{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Discount</span>
                    <span className="text-success">- Rs.{(0).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax</span>
                    <span>Rs.{(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5 py-2">
                    <span>Total</span>
                    <span>Rs.{(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
    
                <button 
                  className="btn btn-dark w-100 py-3 rounded-pill fw-bold mb-3"
                  onClick={handleCheckout}
                >
                  <i className="bi bi-lock-fill me-2"></i> Secure Checkout
                </button>
                
                <button 
                  className="btn btn-outline-dark w-100 py-3 rounded-pill"
                  onClick={() => navigate("/products")}
                >
                  <i className="bi bi-arrow-left me-2"></i> Continue Shopping
                </button>
    
               
                <div className="mt-4 pt-3 border-top text-center">
                  <p className="small text-muted mb-2">We accept</p>
                  <div className="d-flex justify-content-center gap-3">
                    <i className="bi bi-credit-card-2-back-fill fs-4 text-muted"></i>
                    <i className="bi bi-paypal fs-4 text-primary"></i>
                    <i className="bi bi-google-pay fs-4 text-success"></i>
                    <i className="bi bi-apple fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}*/}
      </div>
    </div>
    
   
    );
};

export default CartPage;
