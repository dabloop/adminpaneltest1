import React from 'react';
import './Playerdata.css';

const Inventory = () => {
  // Create an array to represent the 35 inventory slots
  const slots = Array(35).fill(null);

  return (
    <div className="inventory-grid">
      {slots.map((item, index) => (
        <div key={index} className="inventory-slot">
          {/* You can add item rendering logic here */}
        </div>
      ))}
    </div>
  );
};

export default Inventory;
