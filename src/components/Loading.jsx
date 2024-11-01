import React from 'react';
import logo from '../logo.png';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={logo} alt="Loading Logo" className="loading-logo" />
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
