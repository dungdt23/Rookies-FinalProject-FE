import { ThemeProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FC } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './constants/appTheme';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import AppRouter from './routes/AppRouter';
import AxiosInterceptors from './AxiosInterceptors';
// Initialize dayjs to handle dates in local timezone without timezone adjustments
dayjs.locale('en'); // Set the locale as needed
const App: FC = () => {
  return (
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <BrowserRouter>
              <AuthProvider>
                <AxiosInterceptors>
                  <AppRouter />
                </AxiosInterceptors>
              </AuthProvider>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </HelmetProvider>
  );

}

export default App
