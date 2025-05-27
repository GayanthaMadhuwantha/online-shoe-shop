import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './compare.css';

const ProductComparisonPage = ({ compareProducts, setCompareProducts, addToCart }) => {
  const [products, setProducts] = useState(Array.isArray(compareProducts) ? compareProducts : []);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(compareProducts);
  }, [compareProducts]);

  const handleRemoveProduct = (productId) => {
    setCompareProducts(prev => prev.filter(product => product.Product_ID !== productId));
  };

  if (!products || products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{maxWidth: "600px"}}>
          <i className="bi bi-arrow-left-right text-muted" style={{fontSize: "4rem", opacity: 0.3}}></i>
          <h3 className="mt-3 fw-bold">No Products Selected</h3>
          <p className="text-muted mb-4">Select products to compare their features side by side</p>
          <button 
            className="btn btn-dark rounded-pill px-4 py-2"
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-arrow-left me-2"></i> Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Define comparison attributes
  const comparisonAttributes = [
    { name: 'Price', key: 'Price', format: value => `$${value}` },
    { name: 'Material', key: 'Material' },
    { name: 'Weight', key: 'Weight', format: value => `${value}g` },
    { name: 'Color', key: 'Color' },
    { name: 'Rating', key: 'Rating' },
    { name: 'Warranty', key: 'Warranty', format: value => `${value} years` },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5 mb-3">
          <i className="bi bi-bar-chart text-primary me-2"></i>
          Compare Products
        </h1>
        <p className="text-muted">Compare {products.length} product{products.length > 1 ? 's' : ''} side by side</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-compare mb-0">
            <thead>
              <tr>
                <th style={{width: '200px'}}>Features</th>
                {products.map(product => (
                  <th key={product.Product_ID} className="text-center position-relative">
                    <div className="p-3">
                      <button 
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                        style={{width: "28px", height: "28px",justifyContent: "center", alignItems: "center"}}
                        onClick={() => handleRemoveProduct(product.Product_ID)}
                        title="Remove"
                      >
                        <i className="bi bi-x" style={{marginLeft: "-1px"}}></i>
                      </button>
                      <img 
                        src={product.Img_URL || "https://via.placeholder.com/200"} 
                        alt={product.Product_Name} 
                        className="img-fluid mb-3 rounded-3 object-fit-cover" 
                        style={{height: "150px", width: "100%", cursor: "pointer"}}
                        onClick={() => navigate(`/product/${product.Product_ID}`)}
                      />
                      <h5 className="mb-2">{product.Product_Name}</h5>
                      <h4 className="text-primary fw-bold mb-3">Rs.{product.Price}</h4>
                      <button 
                        className="btn btn-sm btn-dark rounded-pill w-100"
                        onClick={() => addToCart(product)}
                      >
                        <i className="bi bi-cart-plus me-2"></i> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonAttributes.map(attr => (
                <tr key={attr.name}>
                  <td className="bg-light fw-semibold">{attr.name}</td>
                  {products.map(product => (
                    <td key={`${product.Product_ID}-${attr.key}`} className="text-center">
                      {attr.format 
                        ? attr.format(product[attr.key] || 'N/A') 
                        : product[attr.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-5">
        <button 
          className="btn btn-outline-dark rounded-pill px-4 py-2 me-3"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-plus-lg me-2"></i> Add More Products
        </button>
        <button 
          className="btn btn-dark rounded-pill px-4 py-2"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Home
        </button>
      </div>
    </div>
  );
};

// Add this to your CSS


  export default ProductComparisonPage;
  