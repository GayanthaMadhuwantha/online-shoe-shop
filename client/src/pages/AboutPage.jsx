import React from 'react';

const AboutPage = () => {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-4">Our Story</h1>
          <p className="lead text-muted">
            Founded in 2010, Rave Collection has been delivering premium footwear with passion and style.
          </p>
        </div>
        <div className="col-lg-6">
          <img 
            src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28" 
            alt="Our store" 
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-primary text-white">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="text-center">
              <i className="bi bi-stars fs-1 mb-3"></i>
              <h3>Our Vision</h3>
              <p>To inspire confidence through exceptional footwear that combines style and comfort.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="text-center">
              <i className="bi bi-bullseye fs-1 mb-3"></i>
              <h3>Our Mission</h3>
              <p>To craft quality shoes using sustainable materials while delivering outstanding customer service.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <i className="bi bi-heart-fill fs-1 mb-3"></i>
              <h3>Our Values</h3>
              <p>Quality, sustainability, innovation, and customer satisfaction at our core.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
 

      {/* Map Section */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4">Visit Our Store</h2>
        <p className="text-center text-muted mb-4">
          123 Shoe Street, Footwear District<br />
          New York, NY 10001
        </p>
        <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Kamburupitiya&maptype=roadmap" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location on Google Maps"
          ></iframe>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="card border-0 shadow-sm rounded-4 p-5 bg-light text-center">
        <h2 className="fw-bold mb-3">Have Questions?</h2>
        <p className="text-muted mb-4">We'd love to hear from you!</p>
        <a href="/contact" className="btn btn-dark rounded-pill px-4 py-2">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default AboutPage;