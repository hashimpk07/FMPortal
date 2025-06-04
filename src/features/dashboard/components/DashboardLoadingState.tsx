import { Box, CircularProgress, Typography, SxProps, Theme } from '@mui/material';

interface DashboardLoadingStateProps {
    message?: string;
    height?: string | number;
    width?: string | number;
    sx?: SxProps<Theme>;
}

/**
 * Loading state component for dashboard widgets
 */
function DashboardLoadingState({
    height = '300px',
    width = '100%',
    message,
    sx = {},
}: DashboardLoadingStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height,
                width,
                padding: 2,
                ...sx,
            }}
        >
            <CircularProgress size={40} />
            {message && (
                <Typography variant="body1" sx={{ mt: 2 }} align="center">
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export default DashboardLoadingState;
