import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import InvoiceForm from './components/InvoiceForm'; // Import the InvoiceForm component (if you created it)
import InvoiceList from './components/InvoiceList'; // Import the InvoiceList component
import EditInvoice from './components/EditInvoice'; // Import the EditInvoice component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import CashOnDelivery from './pages/CashOnDelivery';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './components/ProductDetails';
import ProductComparisonPage from './pages/ProductComparisonPage';
import { AuthContext } from "./components/AuthContext";
import ShoeShopDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import POSSystem from './pages/POSSystem';
import WishlistPage from './pages/WishlistPage';
import './App.css'; // Import your CSS file
import axios from "axios";
const App = () => {
  const [cart, setCart] = useState([]);
  // adjust path if needed

  const { user, setUser } = useContext(AuthContext);
  const [compareProducts, setCompareProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3000/api/wishlist/${user.User_ID}`)
        .then((res) => {
          setWishlistItems(res.data);
        })
        .catch((err) => console.error("Failed to fetch wishlist:", err));
    }
  }, []);


  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    //console.log("Raw cart from localStorage:", savedCart); // Add this line
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
       // console.log("Parsed cart:", parsedCart); // Add this line
        setCart(parsedCart);
      } catch (e) {
        //console.error("Failed to parse cart from localStorage:", e);
        setCart([]);
      }
    }
  }, []);


  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);



  useEffect(() => {
    const savedCompareProducts = localStorage.getItem("compareProducts");
    if (savedCompareProducts) {
      try {
        const parsedCompareProducts = JSON.parse(savedCompareProducts);
        setCompareProducts(parsedCompareProducts);
      } catch (e) {
        console.error("Failed to parse compare products from localStorage:", e);
        setCompareProducts([]);
      }
    }
  }, []);

  //update wishlist item count after delete

 

  // Update localStorage whenever compareProducts changes
  useEffect(() => {
    if (compareProducts.length > 0) {
      localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
    } else {
      localStorage.removeItem("compareProducts");
    }
  }, [compareProducts]);

  const handleAddProductCompare = (product) => {
    if (compareProducts.length < 3) {
      const existingProduct = compareProducts.find((item) => item.Product_ID === product.Product_ID);
      if (!existingProduct) {
        setCompareProducts((prev) => [...prev, product]);
      }
    } else {
      alert("You can only compare up to 3 products.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };//

  // add prodct to compare
  const handleAddToCart = (product) => {
    const existingItemIndex = cart.findIndex(
      item => item.Product_ID === product.Product_ID && item.SelectedSize === product.SelectedSize
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].Quantity += product.Quantity || 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, Quantity: product.Quantity || 1 }]);
    }
  };

  const handleAddToWishlist = async (productId) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert("Please login first");
        return;
      }
      
      // Check local state first for better UX
      if (wishlistItems.some(item => item.Product_ID === productId)) {
        alert("Product already in wishlist");
        return;
      }
  
      try {
        await axios.post('http://localhost:3000/api/wishlist', {
          userId: user.UserID,
          productId
        });
        
        // Refresh wishlist items after successful addition
        const response = await axios.get(`http://localhost:3000/api/wishlist/${user.UserID}`);
        setWishlistItems(response.data);
        
        alert("Added to wishlist!");
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert("Product is already in your wishlist");
          // Sync with server data if there's a conflict
          const response = await axios.get(`http://localhost:3000/api/wishlist/${user.UserID}`);
          setWishlistItems(response.data);
        } else {
          alert("Failed to add to wishlist. Please try again.");
          console.error("Wishlist error:", err);
        }
      }
  };
  

  return (
    <Router>
      <Navbar cartCount={cart.length} wishlistItemcount={wishlistItems.length} compareProductsCount={compareProducts.length} user={user} handleLogout={handleLogout} />
      <div className="App">
        <div className="overlay">
          <Routes>
            <Route path="/" element={<ProductPage cart={cart} setCart={setCart} handleAddProductCompare={handleAddProductCompare} handleAddToWishlist={handleAddToWishlist} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
            <Route path="/cash-on-delivery" element={<CashOnDelivery />} />
            <Route path="/create-invoice" element={<InvoiceForm />} />
            <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/edit-invoice/:id" element={<EditInvoice />} />
            <Route path="/login" element={<Login user={user} setUser={setUser} />} />
            <Route path="/register" element={<Register user={user} setUser={setUser} />} />
            <Route path="/product/:productId" element={<ProductDetails addToCart={handleAddToCart} handleAddToWishlist={handleAddToWishlist} />} />
            <Route path="/compare" element={<ProductComparisonPage compareProducts={compareProducts} setCompareProducts={setCompareProducts} addToCart={handleAddToCart} />} />
            <Route path="/abouts" element={<div>About Us <br></br><iframe width="50%" height="350px" frameborder="0" style={{ border: 1, }} src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Kamburupitiya&maptype=roadmap" allowfullscreen></iframe></div>} />
            <Route path="/contact" element={<div>Contact Us</div>} />
            <Route path="/profile" element={<div>User Profile</div>} />
            <Route path="/orders" element={<div>User Orders</div>} />
            <Route path="/wishlist" element={<WishlistPage addToCart={handleAddToCart} />} />
            <Route path="/admin" element={<ShoeShopDashboard handleLogout={handleLogout} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pos" element={<POSSystem/>}/>
            <Route path='*' element={<div className="text-center" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>404 Not Found</div>} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>

  );


};


export default App;