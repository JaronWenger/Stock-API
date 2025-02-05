// components/StockCard.js
import React, { useState } from 'react';

// Create a StockCard component that accepts symbol, name, price, and percentChange as props
const StockCard = ({ symbol, name, price, percentChange = 0, onCardClick, onDelete }) => {
  const isPositive = percentChange >= 0;
  const isMobile = window.innerWidth < 768;
  const [showDelete, setShowDelete] = useState(false);

  const handleTap = (e) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setShowDelete(!showDelete);
    } else {
      onCardClick && onCardClick(e);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(symbol);
  };
  
  return (
    <div 
      className={`stock-card ${showDelete ? 'show-delete' : ''}`}
      style={{ position: 'relative' }}
      onClick={handleTap}
    >
      <div 
        className="delete-button"
        onClick={handleDelete}
      >
        ×
      </div>
      <div style={cardStyle}>
        <div style={leftContentStyle}>
          <h3 style={symbolStyle}>{symbol}</h3>
          <p style={nameStyle}>{name}</p>
        </div>
        <div style={rightContentStyle}>
          <div style={priceStyle}>
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </div>
          <div style={{
            ...percentChangeStyle,
            color: isPositive ? '#00C805' : '#FF5000'
          }}>
            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Define simple styling for the card
const cardStyle = {
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(10px)',
  maxWidth: '400px',
  width: '100%',
  minHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: 0,
  cursor: 'grab',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    cursor: 'grabbing',
  }
};

const leftContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const rightContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2px',
};

const symbolStyle = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: '600',
  color: 'white',
};

const nameStyle = {
  margin: 0,
  fontSize: '0.85rem',
  color: 'rgba(255, 255, 255, 0.6)',
};

const priceStyle = {
  fontSize: '1.1rem',
  fontWeight: '500',
  color: 'white',
};

const percentChangeStyle = {
  fontSize: '0.85rem',
  fontWeight: '500',
};

export default StockCard; // Export the StockCard component
