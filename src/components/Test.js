import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [teslaPrice, setTeslaPrice] = useState(null);
  const [applePrice, setApplePrice] = useState(null);
  const [chipotlePrice, setChipotlePrice] = useState(null);

  

  useEffect(() => {

    // Function to fetch Tesla's ask price
    const fetchStockPrice = async (symbol, asset, setPrice) => {
      try {
        const response = await axios.get(
          `https://data.alpaca.markets/v2/${asset}/${symbol}/quotes/latest`,
          {
            headers: {
              'APCA-API-KEY-ID': process.env.REACT_APP_ALPACA_KEY_ID, // Environment variable for API Key ID
              'APCA-API-SECRET-KEY': process.env.REACT_APP_ALPACA_SECRET_KEY, // Environment variable for Secret Key
            },
          }
        );
        console.log(response)
        const askPrice = response.data.quote.ap; // Get the ask price from the quote
        setPrice(askPrice ? askPrice.toFixed(2) : 'Not available');
      } catch (error) {
        console.error(`Error fetching ${symbol} ask price:`, error);
      }
    };

    fetchStockPrice('TSLA', "stocks", setTeslaPrice);
    fetchStockPrice('AAPL', "stocks", setApplePrice);
    fetchStockPrice('CMG', "stocks", setChipotlePrice);
  }, []); // Runs only once when component is mounted

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div
        className="App"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Button variant="contained">Hello, World!</Button>

        {/* Display Tesla's ask price */}
        {teslaPrice ? (
        <p>Current ask price of Tesla: ${teslaPrice}</p> // Display ask price
      ) : (
        <p>Loading Tesla's ask price...</p>
      )}
      {applePrice ? (
        <p>Current ask price of Apple: ${applePrice}</p> // Display ask price
      ) : (
        <p>Loading Apple's ask price...</p>
      )}
      {chipotlePrice ? (
        <p>Current ask price of Chipotle: ${chipotlePrice}</p> // Display ask price
      ) : (
        <p>Loading Chipotle's ask price...</p>
      )}



      </div>
    </ThemeProvider>
  );
}

export default App;
