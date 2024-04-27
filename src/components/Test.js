import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';

import StockCard from './components/StockCard'; 
import { getStockName } from './components/lookupFunction'; 

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [stockTickers, setStockTickers] = useState(['MSFT', 'AAPL', 'NVDA', 'AMZN', 'META']); // Dynamic list
  const [stockData, setStockData] = useState({});
  const [inputValue, setInputValue] = useState(''); // Manage text field value
  const [isLoading, setIsLoading] = useState(true);



  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`,
        {
          headers: {
            'APCA-API-KEY-ID': process.env.REACT_APP_ALPACA_KEY_ID,
            'APCA-API-SECRET-KEY': process.env.REACT_APP_ALPACA_SECRET_KEY,
          },
        }
      );
      return response.data.quote.ap; // Ask price
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      return 'Error'; // Error handling
    }
  };



  useEffect(() => {
    const fetchAllStockPrices = async () => {
      const stockDataPromises = stockTickers.map(async (ticker) => {
        const companyName = getStockName(ticker);
        const stockPrice = await fetchStockPrice(ticker);
        return { ticker, name: companyName, price: stockPrice };
      });

      const fetchedStockData = await Promise.all(stockDataPromises);

      const newStockData = fetchedStockData.reduce((acc, data) => {
        acc[data.ticker] = data;
        return acc;
      }, {});

      setStockData(newStockData);
      setIsLoading(false);
    };

    fetchAllStockPrices();
  }, [stockTickers]); // Updated when stockTickers changes


  



  const handleAddStock = () => {
    if (inputValue && !stockTickers.includes(inputValue.toUpperCase())) { // Ensure it's not a duplicate
      setStockTickers((prev) => [...prev, inputValue.toUpperCase()]); // Add the new symbol
      setInputValue(''); // Reset input
    }
  };


  

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div
        className="App"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <TextField
          id="stock-symbol-input"
          label="Enter Stock Symbol or Name"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value
        />
        <Button variant="contained" onClick={handleAddStock}>Add Stock</Button>

        {isLoading ? (
  <CircularProgress />
) : (
  stockTickers
    .slice() // Create a shallow copy to avoid mutating the original array
    .reverse() // Reverse the array order
    .map((ticker) => (
      <StockCard
        key={ticker}
        symbol={ticker}
        name={stockData[ticker]?.name || 'Not available'}
        price={stockData[ticker]?.price || 'Not available'}
      />
    ))
)}
      </div>
    </ThemeProvider>
  );
}

export default App;
