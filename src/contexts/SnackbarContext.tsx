import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SnackbarContextType = {
    showSnackbar: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<{ message: string; severity: 'error' | 'warning' | 'info' | 'success' } | null>(null);

    const showSnackbar = (message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'error') => {
        setSnackbar({ message, severity });
    };

    const handleClose = () => {
        setSnackbar(null);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!snackbar}
                autoHideDuration={6000}
                onClose={handleClose}>
                {snackbar
                    ? <Alert onClose={handleClose} severity={snackbar.severity}>{snackbar.message}</Alert>
                    : undefined}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
