import React from "react";
import "./thankyoupage.css";

const ThankYouPage = () => (
  <div className="thank-bg">
    <div className="thank-glass-card thank-glass-card-large">
      <div className="thank-glass-icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" stroke="#1976d2" strokeWidth="4" fill="#f5f3fc" />
          <path
            d="M20 32L28 40L44 24"
            stroke="#1976d2"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="thank-glass-content">
        <h1 className="thank-glass-title">
          Quiz Submitted!
        </h1>
        <p className="thank-glass-desc">
          Well done, your answers have been received.<br />
          <span className="thank-glass-highlight">Thank you for participating!</span>
        </p>
        <button className="thank-glass-btn">
          <span className="thank-btn-icon">&#8962;</span> Go to Dashboard
        </button>
      </div>
    </div>
  </div>
);

export default ThankYouPage;