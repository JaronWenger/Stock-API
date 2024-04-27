import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import './index.css';


import StockCard from './components/StockCard'; 
import { getStockName, getStockSymbol } from './components/lookupFunction'; 
import { styled } from '@mui/material/styles';

const neutralTheme = createTheme({
  palette: {
    mode: 'dark', // Start with a dark theme base
    background: {
      default: 'darkslategray', // Custom "neutral" background color
      paper: '#3b3b3b', // Slightly lighter for Paper-based components
    },
    text: {
      primary: '#ffffff', // Maintain light text for contrast
    },
  },
});

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '4px', // Make the border thicker
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
    if (inputValue) {
      const stockSymbol = getStockSymbol(inputValue);
  
      if (stockSymbol !== 'Unknown Symbol' && !stockTickers.includes(stockSymbol)) {
        setStockTickers((prev) => [...prev, stockSymbol]); // Add the valid symbol
        setInputValue(''); // Reset input
      } else {
        console.warn("Invalid stock symbol or it's already in the list.");
      }
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Check if the key pressed is 'Enter'
      handleAddStock(); // Call the function to add the stock
    }
  };


  const handleRemoveTicker = (ticker) => {
    setStockTickers((prevTickers) => prevTickers.filter((t) => t !== ticker)); // Filter out the removed ticker
  };
  

  return (
    <ThemeProvider theme={neutralTheme}>
      <CssBaseline />
      <div
        className="App"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <h1 className="app-title" style={{ fontFamily: 'Josefin Sans', marginBottom: '0' }}>
            STOCK LOOKUP
          </h1>
        </div>

        <div
        className="App"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}>
        <CustomTextField
          id="stock-symbol-input"
          label="Enter Stock Symbol or Name"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={handleAddStock} style={{ height: '57px', padding: '10px 20px', backgroundColor: 'lightGrey'}}>Add Stock</Button>
        </div>


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
        onCardClick={() => handleRemoveTicker(ticker)}
      />
    ))
)}
      </div>
    </ThemeProvider>
  );
}

export default App;
