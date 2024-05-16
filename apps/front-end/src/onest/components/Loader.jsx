import React from 'react';
import './SpinnerLoader.css'; // Import the CSS for styling

const Loader = () => {
  return (
    <div className="spinner-overlay">
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  </div>
  );
};

export default Loader;