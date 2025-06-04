import { enqueueSnackbar, SnackbarKey } from 'notistack';
import { Alert } from '@mui/material';
import { ReactNode } from 'react';

type SnackbarVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

type SnackbarPosition = {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'bottom';
};

const snackbar = (
    message: string | ReactNode,
    variant: SnackbarVariant = 'default',
    position: SnackbarPosition = { horizontal: 'center', vertical: 'bottom' },
    duration: number | null = 3000,
) => {
    enqueueSnackbar(message, {
        variant,
        anchorOrigin: position,
        autoHideDuration: duration || 3000,
        content: (_: SnackbarKey) => (
            <Alert
                elevation={6}
                variant="standard"
                severity={variant === 'default' ? 'info' : variant}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        ),
    });
};

export default snackbar;
