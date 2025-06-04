import { Typography, Box } from '@mui/material';

interface AssetDetailFieldProps {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean; // Keep for backward compatibility
}

function AssetDetailField({ label, value }: AssetDetailFieldProps) {
    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }} component="div">
                {label}
            </Typography>
            {typeof value === 'string' ? (
                <Typography variant="body2" component="div">
                    {value}
                </Typography>
            ) : (
                value
            )}
        </Box>
    );
}

export default AssetDetailField;
