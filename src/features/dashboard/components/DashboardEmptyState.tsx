import { Box, Typography, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { ListAlt, InsertChartOutlined, BarChart } from '@mui/icons-material';

export type EmptyStateIcon = 'list' | 'chart' | 'bar';

interface DashboardEmptyStateProps {
    title?: string;
    message: string;
    icon?: EmptyStateIcon;
    customIcon?: ReactNode;
    sx?: SxProps<Theme>;
}

/**
 * Reusable empty state component for dashboard widgets
 */
export function DashboardEmptyState({
    title,
    message,
    icon = 'chart',
    customIcon,
    sx = {},
}: DashboardEmptyStateProps) {
    function getIcon() {
        if (customIcon) return customIcon;

        switch (icon) {
            case 'list':
                return <ListAlt sx={{ fontSize: 50, color: '#ccc' }} />;
            case 'bar':
                return <BarChart sx={{ fontSize: 50, color: '#ccc' }} />;
            case 'chart':
            default:
                return <InsertChartOutlined sx={{ fontSize: 50, color: '#ccc' }} />;
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                // minHeight: '200px',
                ...sx,
            }}
        >
            {getIcon()}
            {title && (
                <Typography variant="h6" align="center" sx={{ mt: 2, mb: 1, color: '#666' }}>
                    {title}
                </Typography>
            )}
            <Typography
                variant="body1"
                align="center"
                gutterBottom
                sx={{ fontWeight: 500, color: '#666' }}
            >
                {message}
            </Typography>
        </Box>
    );
}
