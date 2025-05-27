import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css';

const WishlistPage = ({addToCart}) => {
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                axios
                    .get(`http://localhost:3000/api/wishlist/${user.UserID}`)
                    .then((res) => {
                        setWishlist(res.data);
                    })
                    .catch((err) => alert("Fetching wishlist..."+err));

        }
        } catch (error) {
            alert("Fetching wishlist..."+error);
        }
       
    }, [user, navigate]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await axios.delete("http://localhost:3000/api/wishlist", {
                data: {
                    userId: user.UserID,
                    productId: productId,
                },
            });
            setWishlist((prev) =>
                prev.filter((item) => item.Product_ID !== productId)
            );
        } catch (err) {
            console.error("Failed to remove from wishlist:", err);
        }
    };

  


    return (
        <div className="container py-5">
        {/* Page Header */}
       
      
        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          

<div className="container py-5 text-center">
<div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{maxWidth: "600px"}}>
  <i className="bi bi-heart text-muted" style={{fontSize: "4rem", opacity: 0.3}}></i>
  <h3 className="mt-3 fw-bold">Your wishlist is empty</h3>
  <p className="text-muted mb-4">Save your favorite items to see them here</p>
  <button 
    className="btn btn-dark rounded-pill px-4 py-2"
    onClick={() => navigate("/products")}
  >
    <i className="bi bi-arrow-left me-2"></i> Browse Products
  </button>
</div>
</div>
        ) : (
          <>
           <div className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3">
            <i className="bi bi-heart-fill text-danger me-2 fa-sm" style={{ fontSize: "2.5rem" }}></i>
            Your Wishlist
          </h1>
          <p className="text-muted">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
            <div className="row g-4">
              {wishlist.map((product) => (
                <div className="col-lg-3 col-md-4 col-6" key={product.Product_ID}>
                  <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden hover-scale">
                    {/* Product Image with Remove Button */}
                    <div className="position-relative">
                      <img
                        src={product.Img_URL || "https://via.placeholder.com/500"}
                        alt={product.Product_Name}
                        className="card-img-top object-fit-cover"
                        style={{ height: "200px" }}
                      />
                      <button
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleRemoveFromWishlist(product.Product_ID)}
                        title="Remove"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
      
                    {/* Product Info */}
                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        <h5 className="card-title fw-semibold mb-1">{product.Product_Name}</h5>
                        <p className="text-muted small mb-2">{product.Category || 'Sneakers'}</p>
                      </div>
      
                      {/* Price */}
                      <div className="mb-3">
                        <span className="fw-bold fs-5">${product.Price}</span>
                        {product.OriginalPrice && (
                          <span className="text-muted text-decoration-line-through ms-2 small">
                            ${product.OriginalPrice}
                          </span>
                        )}
                      </div>
      
                      {/* Action Buttons */}
                      <div className="mt-auto d-grid gap-2">
                        <button
                          className="btn btn-outline-dark rounded-pill"
                          onClick={() => navigate(`/product/${product.Product_ID}`)}
                        >
                          <i className="bi bi-eye me-2"></i> View Details
                        </button>
                        <button
                          className="btn btn-dark rounded-pill"
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart-plus me-2"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      
            {/* Continue Shopping Button */}
            <div className="text-center mt-5">
              <button 
                className="btn btn-outline-dark rounded-pill px-4 py-2"
                onClick={() => navigate('/products')}
              >
                <i className="bi bi-arrow-left me-2"></i> Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
      
    );
};

export default WishlistPage;
