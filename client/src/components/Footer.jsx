import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 ">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        
        {/* Left Side: Company Name */}
        <div className="mb-2 mb-md-0">
          <h5 className="m-0">Rave Collection</h5>
        </div>

        {/* Center: Quick Links */}
        <div className="mb-2 mb-md-0">
        
        </div>

        {/* Right Side: Copyright */}
        <div>
          <small>© {new Date().getFullYear()} Rave Collection. All rights reserved.</small>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
