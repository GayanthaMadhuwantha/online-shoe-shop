import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({cartCount, wishlistItemcount, compareProductsCount, user, handleLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 px-lg-5 py-2">
  <div className="container-fluid">
    {/* Brand Logo with Optional Icon */}
    <Link className="navbar-brand d-flex align-items-center" to="/">
      <i className="bi bi-stars me-2" style={{fontSize: "1.5rem"}}></i>
      <span className="fw-bold fs-4">Rave Collection</span>
    </Link>

    {/* Mobile Toggle Button */}
    <button 
      className="navbar-toggler border-0" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Navigation Links */}
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item mx-1">
          <Link className="nav-link px-3 py-2 rounded" to="/about">
            <i className="bi bi-info-circle me-1"></i> About
          </Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link px-3 py-2 rounded" to="/contact">
            <i className="bi bi-headset me-1"></i> Contact
          </Link>
        </li>
      </ul>

      {/* Right-aligned Icons */}
      <ul className="navbar-nav ms-auto align-items-lg-center">
        {/* Cart with Badge */}
        <li className="nav-item mx-1 position-relative">
          <Link className="nav-link px-3 py-2 rounded" to="/cart">
            <i className="bi bi-bag fs-5"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-danger">
                {cartCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </Link>
        </li>

        {/* Wishlist with Badge */}
        <li className="nav-item mx-1 position-relative d-none d-lg-block">
          <Link className="nav-link px-3 py-1 rounded" to="/wishlist">
            <i className="bi bi-heart fs-5"></i>
            {wishlistItemcount > 0 && (
              <span className="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-danger">
                {wishlistItemcount}
                <span className="visually-hidden">items in wishlist</span>
              </span>
            )}
          </Link>
        </li>

        {/* Compare */}
        <li className="nav-item mx-1 d-none d-lg-block">
          <Link className="nav-link px-3 py-2 rounded" to="/compare" title="Compare">
          <i className="bi bi-arrow-left-right fs-5"></i>
            {compareProductsCount > 0 && (
              <span className="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-danger">
                {compareProductsCount}
                <span className="visually-hidden">items in compare</span>
              </span>
            )}
            
          </Link>
        </li>

        {/* User Dropdown */}
        {user ? (
          <li className="nav-item dropdown ms-lg-2">
            <a 
              className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 rounded" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div 
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{width: "32px", height: "32px"}}
              >
                <span className="text-white fw-bold">{user.FName?.charAt(0) || 'U'}</span>
              </div>
              <span className="d-none d-lg-inline">{user.FName || 'User'}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end mt-2 border-0 shadow">
              <li>
                <Link className="dropdown-item py-2" to="/profile">
                  <i className="bi bi-person me-2"></i> Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="/orders">
                  <i className="bi bi-receipt me-2"></i> Orders
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="/wishlist">
                  <i className="bi bi-heart me-2"></i> Wishlist
                  {wishlistItemcount > 0 && (
                    <span className="badge bg-danger ms-2">{wishlistItemcount}</span>
                  )}
                </Link>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </li>
        ) : (
          <>
            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 rounded" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="btn btn-outline-light rounded-pill px-3" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  </div>
</nav>
    );
};

export default Navbar;
