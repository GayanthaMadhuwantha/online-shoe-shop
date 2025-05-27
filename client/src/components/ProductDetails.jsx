import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = ({ addToCart, handleAddToWishlist }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 100); // delay ensures DOM is ready
        }
      }
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/products/${productId}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error("Failed to fetch product", err));

        axios.get(`http://localhost:3000/api/products/${productId}/comments`)
            .then(res => setComments(res.data))
            .catch(err => console.error("Failed to fetch comments", err));
    }, [productId]);

    const transformUsername = (username) => {
        if (!username) return "";
        const firstName = username.split(" ")[0]; // Get the first part of the username (in case there's a full name)
        return firstName.substring(0, 4) + 'xxx'; // Keep first 4 letters and append 'xxx'
    };
    const handleAddToCart = () => {
        if (product && quantity > 0 && selectedSize) {
            addToCart({
                ...product,
                Quantity: quantity,
                SelectedSize: selectedSize,
            });
            navigate("/cart");
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/register", { state: { from: `/products/${productId}` } });
        } else {
            if (newComment.trim() === "") return;
            const commentData = {
                productId,
                content: newComment,
                username: user.FName || "Anonymous",
                date: new Date(),
            };
            axios.post(`http://localhost:3000/api/products/${productId}/comments`, commentData)
                .then(res => {
                    setComments([...comments, res.data]);
                    setNewComment("");
                })
                .catch(err => console.error("Failed to post comment", err));
        }
    };

    if (!product) return <div className="text-center mt-5">Loading product...</div>;

    return (
        <div className="container py-5">
  <div className="row g-5">
    {/* Product Images - Left Column */}
    <div className="col-lg-6">
      <div className="sticky-top" style={{top: "20px"}}>
        {/* Main Image */}
        <div className="mb-4 border rounded-4 overflow-hidden">
          <img
            src={product.Img_URL || "https://via.placeholder.com/800x800"}
            alt={product.Product_Name}
            className="img-fluid w-100"
            style={{height: "500px", objectFit: "cover"}}
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="d-flex gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-3 overflow-hidden cursor-pointer" style={{width: "80px", height: "80px"}}>
              <img
                src={product.Img_URL || "https://via.placeholder.com/200"}
                alt={`Thumbnail ${item}`}
                className="img-fluid h-100 w-100 object-fit-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Product Details - Right Column */}
    <div className="col-lg-6">
      {/* Product Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="fw-bold display-5">{product.Product_Name}</h1>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="d-flex text-warning">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="bi bi-star-fill"></i>
              ))}
            </div>
            <span className="text-muted">(42 reviews)</span>
          </div>
        </div>
        <span className="badge bg-success fs-6">{product.stock > 0 ? "In Stock":"Out of Stock"}{product.stock}</span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <h2 className="text-dark fw-bold">Rs. {product.Price}</h2>
        {product.OriginalPrice && (
          <span className="text-muted text-decoration-line-through ms-2">Rs. {product.OriginalPrice}</span>
        )}
        {product.Discount && (
          <span className="badge bg-danger ms-2">{product.Discount}% OFF</span>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <h5 className="fw-semibold">Description</h5>
        <p className="text-muted">{product.Description}</p>
      </div>

      {/* Size Selector */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-3">Select Size</h5>
        <div className="d-flex flex-wrap gap-2">
          {product.sizes && product.sizes
            .filter((s) => s.stock > 0)
            .map((s) => (
              <button
                key={s.size}
                className={`btn ${selectedSize === s.size ? 'btn-dark' : 'btn-outline-dark'} rounded-pill`}
                onClick={() => setSelectedSize(s.size)}
                style={{minWidth: "60px"}}
              >
                {s.size}
              </button>
            ))}
        </div>
        <small className="text-muted d-block mt-2">Available sizes highlighted</small>
      </div>

      {/* Quantity Selector */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-3">Quantity</h5>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" 
            style={{width: "36px", height: "36px"}}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <i className="bi bi-dash-lg"></i>
          </button>
          <span className="fw-bold fs-5">{quantity}</span>
          <button 
            className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" 
            style={{width: "36px", height: "36px"}}
            onClick={() => setQuantity(quantity + 1)}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={()=>handleAddToCart(product)}
        className="btn btn-dark py-3 w-100 rounded-pill fw-bold mb-3"
        disabled={!selectedSize}
      >
        <i className="bi bi-cart-plus me-2"></i> Add to Cart
      </button>

      {/* Wishlist Button */}
      <button onClick={() => handleAddToWishlist(productId)} className="btn btn-outline-dark py-3 w-100 rounded-pill">
        <i className="bi bi-heart me-2"></i> Add to Wishlist
      </button>

      {/* Product Details Accordion */}
      <div className="accordion mt-4" id="productDetailsAccordion">
        <div className="accordion-item border-0">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#detailsCollapse">
              Product Details
            </button>
          </h2>
          <div id="detailsCollapse" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
            <div className="accordion-body">
              <ul className="list-unstyled">
                <li><strong>Material:</strong> Premium Leather</li>
                <li><strong>Color:</strong> Black/White</li>
                <li><strong>Weight:</strong> 320g (per shoe)</li>
                <li><strong>Style:</strong> Running Shoes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Reviews Section */}
  <div className="row mt-5">
    <div className="col-12">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white">
          <h3 className="mb-0 fw-bold">Customer Reviews</h3>
        </div>
        <div className="card-body">
          {comments.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-chat-square-text fs-1 text-muted mb-3"></i>
              <h5>No reviews yet</h5>
              <p className="text-muted">Be the first to review this product</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {comments.map((comment, index) => (
                <div key={index} className="list-group-item border-0 py-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px"}}>
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-semibold">{transformUsername(comment.username)}</h6>
                      <div className="d-flex align-items-center">
                        <div className="d-flex text-warning small">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>
                        <small className="text-muted ms-2">{new Date(comment.date).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </div>
                  <p className="mb-0">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Review Form */}
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <h5 className="fw-semibold mb-3">Write a Review</h5>
            <div className="mb-3">
              <label className="form-label">Your Rating</label>
              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="bi bi-star-fill fs-4 text-muted cursor-pointer"></i>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <textarea
                className="form-control border-2"
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default ProductDetails;
