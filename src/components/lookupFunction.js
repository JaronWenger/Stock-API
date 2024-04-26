// components/lookupFunctions.js
import stockData from './stockData'; // Import the stock data

// Function to get the stock name from a symbol
export const getStockName = (symbol) => {
  return stockData[symbol] || 'Unknown Stock'; // Return stock name or default
};

// Function to get the stock symbol from a name
export const getStockSymbol = (name) => {
  for (const [symbol, stockName] of Object.entries(stockData)) {
    if (stockName === name) {
      return symbol; // Return the matching symbol
    }
  }
  return 'Unknown Symbol'; // Default if not found
};