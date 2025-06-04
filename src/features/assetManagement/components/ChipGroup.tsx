import { Box, Typography, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface ChipGroupProps {
    label: string;
    items: string[];
}

function ChipGroup({ label, items }: ChipGroupProps) {
    return (
        <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {items.map((item, index) => (
                    <Chip
                        key={index}
                        label={item}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            '& .MuiChip-label': {
                                fontSize: '0.875rem', // body2 size
                                fontWeight: 400,
                                lineHeight: 1.43,
                                letterSpacing: '0.01071em',
                            },
                        }}
                    />
                ))}
            </Box>
        </Grid>
    );
}

export default ChipGroup;
