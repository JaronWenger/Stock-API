import React from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div
      className="App"
      style={{
        display: 'flex', // Enables Flexbox
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full height of the viewport
        margin: 0, // Reset default margin
        padding: 0, // Reset default padding
         // Optional background color for contrast
      }}
    >
      <Button variant="contained">
      Hello, World!        
      </Button>
    </div>
    
    </ThemeProvider>
  );
}

export default App;
