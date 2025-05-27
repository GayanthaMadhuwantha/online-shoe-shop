import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './product.css';

const ProductPage = ({ cart, setCart, handleAddProductCompare, handleAddToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [compareError, setCompareError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("All");
  const subcategorySectionRef = useRef(null);
  const productSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/api/products")
      .then((response) => {
        const data = response.data;
      setProducts(data);
      setAllProducts(data);

        //get unique main Categories
        const uniqueMain = ['All', ...new Set(data.map(p => p.Main_category).filter(Boolean))];
        setMainCategory(uniqueMain);

        // Generate unique categories **after** data is fetched
        const uniqueSub = ['All', ...new Set(data.map(p => p.Category_Name).filter(Boolean))];
        setAllCategories(uniqueSub);
        setFilteredCategories(uniqueSub);

        
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // search for the product
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter((product) =>
      product.Product_Name.toLowerCase().includes(searchTerm)
    );
    setProducts(filteredProducts);
  };

  // Add product to Compare
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
      setCart([...cart, { ...product, Quantity: 1 }]); // ✅ Ensure Quantity is set
    }
  };

  const getCategoryCount = (category) => {
    return allProducts.filter(product => product.Category_Name === category).length;
  }

  const getSubcategoryCount = (mainCategory) => {
    return allProducts.filter(product => product.Main_category === mainCategory).length;
  }

  /*const handleAddToWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/wishlist', {
        userId: user.UserID,
        productId
      });
      alert("Added to wishlist!");
    } catch (err) {
      alert("Already in wishlist or failed");
    }
  };*/
  const getCategoryImage = (Category_Name) => {
    const categoryImages = {
      'All': 'https://plus.unsplash.com/premium_photo-1661606021743-12feba886af0',
      'Running Shoes': 'https://images.unsplash.com/photo-1593642632859-0e5b3c4f2a1d',
      'Formal Shoes': 'https://images.unsplash.com/photo-1593642632859-0e5b3c4f2a1d',
    };

    return categoryImages[Category_Name] || 'https://via.placeholder.com/150';
  };

  const getMainCategoryImage = (Main_category) => {
    const categoryImages = {
      'man': 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28',
      'woman': 'https://images.squarespace-cdn.com/content/v1/66edcdea9c01584fc3df9f17/1727160325884-68HQOTJXD5JMK52S4EHJ/DVG.jpg',
      'kids': 'https://plus.unsplash.com/premium_photo-1670509096112-995f9414ca01',
    };
  
    return categoryImages[Main_category?.toLowerCase()] || 'https://via.placeholder.com/150';
  };
  

  const filterProducts = (category) => {
    if (category === 'All') {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => product.Category_Name === category);
      setProducts(filtered);
    }
  };

  const filterCategories = (category) => {
    setSelectedMainCategory(category);

    if (category === 'All') {
      setFilteredCategories(allCategories);
    } else {
      const relatedSubcategories = [
        ...new Set(
          allProducts
            .filter(p => p.Main_category === category)
            .map(p => p.Category_Name)
            .filter(Boolean)
        )
      ];
      setFilteredCategories(relatedSubcategories);
    }
  };

  

  const scrollToSubcategories = () => {
    if (subcategorySectionRef.current) {
      document.getElementById("subcategorySection").style.display = "block";
      subcategorySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="container-fluid px-0" >
      {/* Hero Section */}
      <div className="hero-section position-relative overflow-hidden mb-5" style={{
        height: "90vh",
        minHeight: "600px",
        background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%), url('https://134145.cmstrial.net/uploads/72034/images/devin-berko-lAYaL3WxyjQ-unsplash-1600.jpg') center/cover",
        backgroundAttachment: 'fixed'
      }}>
        {/* Animated gradient overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: "linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
          animation: "gradientShift 15s ease infinite",
          backgroundSize: "400% 400%"
        }}></div>

        <div className="container h-100 d-flex flex-column justify-content-center text-white position-relative z-index-1">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              {/* Headline with animated text */}
              <h1 className="display-2 fw-bold mb-3 text-white" style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                animation: 'fadeInUp 1s ease'
              }}>
                Step Into <span className="text-gradient-primary">Style</span>
              </h1>

              <p className="lead mb-4 text-white opacity-75" style={{
                fontSize: '1.5rem',
                animation: 'fadeInUp 1s ease 0.2s forwards',
                opacity: 0
              }}>
                Discover footwear that combines cutting-edge design with unparalleled comfort
              </p>

              {/* Search bar with floating animation */}
              <div className="search-container mt-4" style={{
                animation: 'fadeInUp 1s ease 0.4s forwards',
                opacity: 0
              }}>
                <div className="input-group input-group-lg shadow-lg rounded-pill overflow-hidden">
                  <input id="searchInput"
                    type="text"
                    className="form-control border-0 ps-4"
                    placeholder="Search for shoes, brands, styles..."
                    style={{ height: '60px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  />

                  <button onClick={handleSearch} className="btn btn-dark px-4 bg-transparent border-0" type="button">
                    <i className="bi bi-search fs-5"></i>
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex gap-3 mt-4" style={{
                animation: 'fadeInUp 1s ease 0.6s forwards',
                opacity: 0
              }}>
                <button
                  className=" btn-lg rounded-pill px-4 py-3 fw-bold d-flex align-items-center border-0"
                  onClick={() => document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' })}
                  style={{ backgroundColor: 'rgba(0, 81, 255, 0.56)' }}>
                  Shop Collection <i className="bi bi-arrow-down ms-2"></i>
                </button>
                <button
                  className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-bold d-flex align-items-center"
                  onClick={() => navigate('/new-arrivals')}
                >
                  New Arrivals <i className="bi bi-lightning-charge-fill ms-2"></i>
                </button>
              </div>
            </div>

            {/* Floating shoe showcase (visible on larger screens) */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative" style={{ height: '500px' }}>
                <img
                  src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
                  alt="Featured shoe"
                  className="position-absolute shoe-float"
                  style={{
                    width: '80%',
                    bottom: 0,
                    right: 0,
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
                    animation: 'float 6s ease-in-out infinite'
                  }}
                />
                <div className="position-absolute bg-primary rounded-circle" style={{
                  width: '400px',
                  height: '400px',
                  bottom: '-100px',
                  right: '-100px',
                  opacity: 0.1,
                  animation: 'pulse 8s ease infinite'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{
          animation: 'bounce 2s ease infinite'
        }}>
          <button
            className="btn btn-outline-light rounded-circle"
            onClick={() => document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll down"
          >
            <i className="bi bi-chevron-down fs-4"></i>
          </button>
        </div>
      </div>



  {/* Category Navigation Section */}
{allCategories.length === 0 ? (
  <div className="text-center py-5">
    <div className="spinner-grow text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted">Loading categories...</p>
  </div>
) : (
  <div className="container mb-5">
    {/* Section Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold display-5">Browse Collections</h2>
      <button 
        className="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center"
        onClick={() => navigate('/categories')}
      >
        Explore All <i className="bi bi-arrow-right ms-2"></i>
      </button>
    </div>

    {/* Main Categories - Large Cards */}
    <div className="main-category-scroll-container mb-5">
  {mainCategory.map((Main_category, index) => (
    <div key={index} className="main-category-item me-3">
      <div
        className="main-category-card card border-0 overflow-hidden rounded-4 shadow-sm h-100 transition-all"
        onClick={() => {
          filterCategories(Main_category);
          scrollToSubcategories();
        }}
        style={{ width: "280px", minWidth: "280px" }} // control card width
      >
        <div className="position-relative" style={{ height: "300px" }}>
          {/* Gradient Overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}></div>

          {/* Image */}
          <img
            src={getMainCategoryImage(Main_category)}
            className="h-100 w-100 object-fit-cover"
            alt={Main_category}
          />

          {/* Label */}
          <div className="position-absolute bottom-0 start-0 p-4 text-white w-100">
            <h3 className="fw-bold mb-2">{Main_category}</h3>
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-primary rounded-pill">
                {getSubcategoryCount(Main_category)} subcategories
              </span>
              <button className="btn btn-light rounded-circle">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


    {/* Subcategories Section - Only shown when a main category is selected */}
    {selectedMainCategory && (
      <div className="mt-5" id="subcategorySection" style={{ display: 'none' }} ref={subcategorySectionRef}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">
            <button 
              className="btn btn-link text-decoration-none me-3"
              onClick={() => setSelectedMainCategory(null)}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            {selectedMainCategory}
          </h3>
          <span className="text-muted">
            {filteredCategories.length} subcategories
          </span>
        </div>

        {/* Subcategories Grid */}
        <div className="row g-4 ">
          {filteredCategories.map((Category_Name, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
              <div
                className="subcategory-card card border-0 h-100 overflow-hidden rounded-3 shadow-sm transition-all hover-lift"
                onClick={() => {
                  filterProducts(Category_Name); 
                  scrollToProducts();}}
              >
                <div className="position-relative" style={{ height: "160px" }}>
                  {/* Image */}
                  <img
                    src={getCategoryImage(Category_Name)}
                    className="h-100 w-100 object-fit-cover"
                    alt={Category_Name}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 transition-all hover-show">
                    <span className="text-white fw-bold">View Products</span>
                  </div>
                </div>
                
                <div className="card-body p-3">
                  <h5 className="mb-0 fw-semibold text-truncate">{Category_Name}</h5>
                  <small className="text-muted">{getCategoryCount(Category_Name)} products</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}












      {/* Featured Products */}
      <div className="container py-5" id="featured-products">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">Trending Now</h2>
            <p className="text-muted">Our most popular picks this season</p>
          </div>
          <div className="d-flex">
            <button className="btn btn-outline-secondary rounded-circle me-2" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="btn btn-outline-secondary rounded-circle" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-5"  >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        ) : (


          <div className="row g-4" ref={productSectionRef}>
            {products.map((product) => (
              <div key={product.Product_ID} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border-0 h-100 product-card shadow-sm rounded-4 overflow-hidden hover-lift">
                  {/* Product Image */}
                  <div className="position-relative overflow-hidden" style={{ height: "250px" }}>
                    <img
                      src={product.Img_URL || 'https://via.placeholder.com/500'}
                      className="card-img-top h-100 w-100 object-fit-cover"
                      alt={product.Product_Name}
                    />
                    {/* Product Badges */}
                    <div className="position-absolute top-0 start-0 p-2">
                      {product.IsNew && <span className="badge bg-success me-1">New</span>}
                      {product.Discount && <span className="badge bg-danger">-{product.Discount}%</span>}
                    </div>
                    {/* Quick Actions */}
                    <div className="position-absolute top-0 end-0 p-2 d-flex flex-column">
                      <button
                        className="btn btn-sm btn-dark mb-2 rounded-circle"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleAddToWishlist(product.Product_ID)}
                        title="Add to wishlist"
                      >
                        <i className="bi bi-heart"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-dark rounded-circle"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleAddProductCompare(product)}
                        title="Compare"
                      >
                        <i className="bi bi-arrow-left-right"></i>
                      </button>
                    </div>
                    {/* Quick View */}
                    <div className="position-absolute bottom-0 start-0 w-100 text-center p-2">
                      <button
                        className="btn btn-dark w-75 rounded-pill opacity-0 translate-y-100 transition-all"
                        onClick={() => navigate(`/product/${product.Product_ID}`)}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0 fw-semibold text-truncate">{product.Product_Name}</h5>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-star-fill text-warning small me-1"></i>
                        <span className="small">4.8</span>
                      </div>
                    </div>

                    <p className="text-muted small mb-2">{product.Category || 'Running Shoes'}</p>

                    {/* Available Sizes */}
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-1">
                        {product.sizes && product.sizes
                          .filter(s => s.stock > 0)
                          .slice(0, 4)
                          .map(s => (
                            <span key={s.size} className="badge bg-light text-dark border">{s.size}</span>
                          ))}
                        {product.sizes && product.sizes.filter(s => s.stock > 0).length > 4 && (
                          <span className="badge bg-light text-dark border">+{product.sizes.filter(s => s.stock > 0).length - 4}</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold fs-5 text-dark">Rs.{product.Price}</span>
                        {product.OriginalPrice && (
                          <span className="text-muted text-decoration-line-through ms-2 small">Rs.{product.OriginalPrice}</span>
                        )}
                      </div>
                      <button
                        className="btn btn-dark rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        onClick={() => addToCart(product)}
                        disabled={product.Stock_Quantity === null}
                        title="Add to cart"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-5">
          <button className="btn btn-outline-dark px-4 py-2 rounded-pill">
            View More Products <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5 my-5">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: 'bi bi-truck', title: 'Free Shipping', text: 'On orders over Rs.5000' },
              { icon: 'bi bi-arrow-repeat', title: 'Easy Returns', text: '30-day return policy' },
              { icon: 'bi bi-shield-check', title: 'Secure Payment', text: '100% secure checkout' },
              { icon: 'bi bi-headset', title: '24/7 Support', text: 'Dedicated support' }
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="d-flex">
                  <div className="flex-shrink-0 text-primary fs-3 me-3">
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed-bottom d-lg-none bg-white p-3 shadow-lg">
          <button
            className="btn btn-success w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center"
            onClick={() => navigate("/cart")}
          >
            <i className="bi bi-cart3 me-2"></i>
            Checkout ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </button>
        </div>
      )}
    </div>


  );
};

export default ProductPage;
