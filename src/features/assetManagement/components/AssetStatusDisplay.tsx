import { Box, Typography } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import STATUS_MAP from '../statusMap';

export type AssetStatus = 'operational' | 'pending_repair' | 'missing' | 'out_of_service';

interface StatusInfo {
    label: string;
    color: string;
}

export const statusMap: Record<AssetStatus, StatusInfo> = {
    operational: { label: 'Operational', color: '#4caf50' },
    pending_repair: { label: 'Pending Repair', color: '#ff9800' },
    missing: { label: 'Missing', color: '#f44336' },
    out_of_service: { label: 'Out of Service', color: '#9e9e9e' },
};

// Create a proper React component to use the useTranslation hook
function AssetStatusDisplay({ status }: { status: AssetStatus }) {
    const statusInfo = statusMap[status] || {
        label: 'Unknown',
        color: '#9e9e9e',
    };
    // Use shared map for label
    const label = STATUS_MAP[status] || statusInfo.label;
    return (
        <Box
            sx={{
                display: 'inline-block',
                bgcolor: statusInfo.color,
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {label}
            </Typography>
        </Box>
    );
}

// Helper function to maintain backward compatibility
export function renderAssetStatus(status: AssetStatus) {
    return <AssetStatusDisplay status={status} />;
}

export default AssetStatusDisplay;
