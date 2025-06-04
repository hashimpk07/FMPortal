import { Box, Typography, SxProps, Theme } from '@mui/material';
import { ListAlt } from '@mui/icons-material';
import DashboardCard from './DashboardCard';

interface WorkOrdersListProps {
    title: string;
    message: string;
    sx?: SxProps<Theme>;
}

/**
 * Component to display work order lists with empty state
 */
function EmptyWorkOrdersList({ title, message, sx = {} }: WorkOrdersListProps) {
    return (
        <DashboardCard title={title} sx={{ height: '100%', ...sx }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,
                    minHeight: '200px',
                }}
            >
                <ListAlt sx={{ fontSize: 50, color: '#ccc', mb: 2 }} />
                <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 500, color: '#666' }}
                >
                    {message}
                </Typography>
            </Box>
        </DashboardCard>
    );
}

export default EmptyWorkOrdersList;
