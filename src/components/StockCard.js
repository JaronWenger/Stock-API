// components/StockCard.js
import React from 'react';

// Create a StockCard component that accepts symbol, name, and price as props
const StockCard = ({ symbol, name, price }) => {
  return (
    <div style={cardStyle}>
      <p>{name}</p> {/* Display the stock name */}
        <h3>{symbol}</h3> {/* Display the stock symbol */}
      <p>Price: ${price}</p> {/* Display the stock price */}
    </div>
  );
};

// Define simple styling for the card
const cardStyle = {
    border: '1px solid #ccc', // Light border
    padding: '10px', // Inner padding
    borderRadius: '5px', // Rounded corners
    backgroundColor: 'black', // Light background color (fixed incorrect hex)
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Light shadow
    maxWidth: '400px', // Increased width to accommodate horizontal layout
    minHeight: '50px', // Minimum height for consistent appearance
    display: 'flex', // Flexbox layout to align items horizontally
    alignItems: 'center', // Vertical alignment for child elements
    justifyContent: 'space-between', // Space between elements
    textAlign: 'center', // Text alignment
  };
  

export default StockCard; // Export the StockCard component