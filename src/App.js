import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import './index.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/material/styles';
import StockCard from './components/StockCard'; 
import { getStockName, getStockSymbol } from './components/lookupFunction'; 

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
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white', // Change hover border color
  },
  '& .MuiOutlinedInput-input': {
    color: 'white', // Optional: change text color
  },
  '& .MuiInputLabel-root': {
    color: 'lighGray', // Optional: change label color
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white', // Change border color to white when focused
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white', // Label color when focused
  },
});

function App() {
  const [stockTickers, setStockTickers] = useState(['MSFT', 'AAPL', 'NVDA', 'AMZN', 'META']); // Dynamic list
  const [stockData, setStockData] = useState({});
  const [inputValue, setInputValue] = useState(''); // Manage text field value
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `https://data.alpaca.markets/v2/stocks/${symbol}/snapshot`,
        {
          headers: {
            'APCA-API-KEY-ID': process.env.REACT_APP_ALPACA_KEY_ID,
            'APCA-API-SECRET-KEY': process.env.REACT_APP_ALPACA_SECRET_KEY,
          },
        }
      );

      const snapshot = response.data;
      const currentPrice = snapshot.latestTrade.p;
      const dailyBar = snapshot.dailyBar;
      const prevClose = dailyBar.o;
      const percentChange = ((currentPrice - prevClose) / prevClose) * 100;

      // Generate chart data based on daily bar data
      const chartData = Array(20).fill().map((_, i) => {
        const progress = i / 19; // 0 to 1
        const price = prevClose + (currentPrice - prevClose) * progress;
        // Add some randomness to make it look more natural
        const variance = (currentPrice - prevClose) * 0.1; // 10% of total price change
        return {
          value: price + (Math.random() - 0.5) * variance
        };
      });

      return {
        price: currentPrice,
        percentChange: percentChange,
        chartData: chartData
      };
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      return { 
        price: 'Error', 
        percentChange: 0,
        chartData: []
      };
    }
  };

  useEffect(() => {
    const fetchAllStockPrices = async () => {
      const stockDataPromises = stockTickers.map(async (ticker) => {
        const companyName = getStockName(ticker);
        const { price, percentChange } = await fetchStockPrice(ticker);
        return { ticker, name: companyName, price, percentChange };
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

  const onDragEnd = (result) => {
    setIsDragging(false);
    
    if (!result.destination || result.destination.droppableId === 'trash') {
      setItemToRemove(result.draggableId);
      return;
    }

    // Handle reordering if not dropped on trash
    const items = Array.from(stockTickers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setStockTickers(items);
  };

  // Use an effect to handle the removal after the drag is complete
  useEffect(() => {
    if (itemToRemove) {
      setStockTickers(prevTickers => 
        prevTickers.filter(ticker => ticker !== itemToRemove)
      );
      setItemToRemove(null);
    }
  }, [itemToRemove]);

  const onDragStart = () => {
    setIsDragging(true);
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
        <div style={{ position: 'relative' }}>
          <CustomTextField
            id="stock-symbol-input"
            label="Enter Stock Symbol or Name"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button variant="contained" onClick={handleAddStock} style={{ height: '57px', padding: '10px 20px', backgroundColor: 'lightGrey'}}>Add Stock</Button>
        </div>

      <div className="App" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable droppableId="stocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    width: '100%',
                    maxWidth: '400px'
                  }}
                >
                  {stockTickers.map((ticker, index) => (
                    <Draggable 
                      key={ticker} 
                      draggableId={ticker} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1
                          }}
                        >
                          <StockCard
                            symbol={ticker}
                            name={stockData[ticker]?.name || 'Not available'}
                            price={stockData[ticker]?.price || 'Not available'}
                            percentChange={stockData[ticker]?.percentChange || 0}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    position: 'fixed',
                    bottom: 20,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: snapshot.isDraggingOver ? 'rgba(255, 0, 0, 0.2)' : 
                      'rgba(0, 0, 0, 0.3)',
                    display: isDragging ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    opacity: snapshot.isDraggingOver ? 1 : 0.7,
                    transform: `scale(${snapshot.isDraggingOver ? 1.2 : 1})`,
                    cursor: 'pointer',
                    zIndex: 1000,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.3)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = snapshot.isDraggingOver ? 
                      'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={snapshot.isDraggingOver ? '#ff0000' : '#ffffff'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ 
                      width: 30,
                      height: 30
                    }}
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
