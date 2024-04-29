// components/StockCard.js
import React from 'react';

// Create a StockCard component that accepts symbol, name, and price as props
const StockCard = ({ symbol, name, price, onCardClick }) => {
  return (
    
    <div style={cardStyle} onClick={onCardClick} > {/* Apply card styling */}
      <p>{name}</p> {/* Company name */}
      <h3>{symbol}</h3> {/* Stock symbol */}
      <p>Price: ${price}</p> {/* Stock price */}
    </div>
    
  );
};

// Define simple styling for the card
const cardStyle = {
    border: '5px solid darkslategray', // Light border
    padding: '15px', // Inner padding
    borderRadius: '15px', // Rounded corners
    backgroundColor: 'black', // Light background color (fixed incorrect hex)

    maxWidth: '400px', // Increased width to accommodate horizontal layout
    minHeight: '50px', // Minimum height for consistent appearance
    display: 'flex', // Flexbox layout to align items horizontally
    alignItems: 'center', // Vertical alignment for child elements
    justifyContent: 'space-between', // Space between elements
    textAlign: 'center', // Text alignment
    gap: '30px',
  };
  

export default StockCard; // Export the StockCard component
