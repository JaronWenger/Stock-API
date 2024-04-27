import stockData from './stockData';

// Function to get the stock name from a symbol
export const getStockName = (symbol) => {
  const normalizedSymbol = symbol.toUpperCase();
  return stockData[normalizedSymbol] || 'Unknown Stock';
};

// Function to get the stock symbol from a name or symbol
export const getStockSymbol = (input) => {
  const normalizedInput = input.toUpperCase(); // Normalize input to uppercase
  
  // If the input is a known stock symbol, return it
  if (stockData[normalizedInput]) {
    return normalizedInput;
  }

  // Check if the input matches a company name
  for (const [symbol, stockName] of Object.entries(stockData)) {
    if (stockName.toUpperCase().includes(normalizedInput)) { // Using 'includes' for partial match
      return symbol; // Return the matching symbol
    }
  }

  return 'Unknown Symbol'; // Return if no match
};
