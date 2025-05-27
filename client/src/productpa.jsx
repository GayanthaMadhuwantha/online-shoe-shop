import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from backend
    axios.get("http://localhost:3000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Format price as LKR 1,800.00


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.Product_ID === product.Product_ID);
    if (existingProduct) {
      setCart(cart.map((item) =>
        item.Product_ID === product.Product_ID
          ? { ...item, Quantity: item.Quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, Quantity: 1 }]);
    }
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3">Rave Collection</h1>
        <p className="text-muted">Discover the perfect pair for every step</p>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.Product_ID} className="col-lg-3 col-md-4 col-6">
            <div className="card border-0 h-100 product-card shadow-sm rounded-4 overflow-hidden">
              {/* Product Image with Hover Effect */}
              <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                <img 
                  src={product.Img_URL || 'https://via.placeholder.com/300'} 
                  className="card-img-top h-100 object-fit-cover" 
                  alt={product.Product_Name}
                  style={{ transition: "transform 0.3s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Quick View Badge */}
                <button 
                  className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 rounded-circle"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => navigate(`/product/${product.Product_ID}`)}
                >
                  <i className="bi bi-eye"></i>
                </button>
              </div>

              {/* Product Info */}
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0 fw-semibold">{product.Product_Name}</h5>
                  <span className="badge bg-success rounded-pill">New</span>
                </div>
                <p className="text-muted small mb-2">{product.Category || 'Running Shoes'}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                  <span className="fw-bold fs-5 text-dark">
  {formatCurrency(product.Price)}
</span>
{product.OriginalPrice && (
  <span className="text-muted text-decoration-line-through ms-2 small">
    {formatCurrency(product.OriginalPrice)}
  </span>
)}
                  </div>
                  <button 
                    className="btn btn-outline-dark rounded-pill px-3 py-1"
                    onClick={() => addToCart(product)}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Button - Fixed at bottom on mobile */}
      <div className="fixed-bottom d-lg-none bg-white p-3 shadow-lg">
        <button 
          className="btn btn-success w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center"
          onClick={() => navigate("/cart")}
          disabled={cart.length === 0}
        >
          <i className="bi bi-cart3 me-2"></i>
          Proceed to Checkout ({cart.length})
        </button>
      </div>

      {/* Checkout Button - Regular on desktop */}
      <div className="text-center mt-5 d-none d-lg-block">
        <button 
          className="btn btn-success px-5 py-3 rounded-pill fw-bold"
          onClick={() => navigate("/cart")}
          disabled={cart.length === 0}
        >
          <i className="bi bi-cart3 me-2"></i>
          Proceed to Checkout ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </button>
      </div>
    </div>
  );
};

export default ProductPage;