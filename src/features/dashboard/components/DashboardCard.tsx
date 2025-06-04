import { ReactNode } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface DashboardCardProps {
    title: string;
    children: ReactNode;
    isLoading?: boolean;
    loadingComponent?: ReactNode;
    headerAction?: ReactNode;
    sx?: SxProps<Theme>;
}

/**
 * A reusable card component for dashboard widgets with consistent styling
 */
function DashboardCard({
    title,
    children,
    isLoading = false,
    loadingComponent,
    headerAction,
    sx = {},
}: DashboardCardProps) {
    return (
        <Box
            sx={{
                border: '1px solid #E0E0E0',
                padding: 0,
                height: '100%',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 0 0 1px rgba(0, 0, 0, 0.05)',
                ...sx,
            }}
        >
            <Box
                sx={{
                    borderBottom: '1px solid #E0E0E0',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#333',
                    }}
                >
                    {title}
                </Typography>
                {headerAction && headerAction}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {isLoading && loadingComponent ? loadingComponent : children}
            </Box>
        </Box>
    );
}

export default DashboardCard;
