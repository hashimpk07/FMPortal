import React from 'react';
import { closeSnackbar, SnackbarKey, SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { Divider, IconButton } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from '../theme/theme';
import App from './App';

const snackbarClose = (snackbarId: SnackbarKey) => (
    <>
        <Divider
            sx={{
                backgroundColor: 'white',
                opacity: 0.6,
                my: 0.5,
            }}
            orientation="vertical"
            flexItem
        />
        <IconButton color="inherit" onClick={() => closeSnackbar(snackbarId)} sx={{ mr: 0 }}>
            <Close />
        </IconButton>
    </>
);

const AppProvider = () => {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={3000}
                    action={snackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    classes={{
                        containerAnchorOriginTopCenter: 'notistack-top-center',
                        containerAnchorOriginTopLeft: 'notistack-top-left',
                        containerAnchorOriginTopRight: 'notistack-top-right',
                    }}
                    style={{
                        // Debug styles to make position issues more visible
                        transform: 'none !important',
                    }}
                    dense
                >
                    <BrowserRouter
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <App />
                    </BrowserRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
};

export default AppProvider;
