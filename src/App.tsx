import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@emotion/react';
import { theme } from './constants/appTheme';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {/* <AuthProvider> */}
            <AppRouter />
          {/* </AuthProvider> */}
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );

}

export default App
