import { Box, Typography, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AssetOperationalStatsProps {
    operationalDays?: number | null;
    nonOperationalDays?: number | null;
}

function AssetOperationalStats({
    operationalDays = 0,
    nonOperationalDays = 0,
}: AssetOperationalStatsProps) {
    const { t } = useTranslation();

    // Ensure we have valid numbers
    const safeOperationalDays = typeof operationalDays === 'number' ? operationalDays : 0;
    const safeNonOperationalDays = typeof nonOperationalDays === 'number' ? nonOperationalDays : 0;

    const totalDays = safeOperationalDays + safeNonOperationalDays;

    // Prevent division by zero which causes NaN
    let operationalPercentage = 0;
    let outOfServicePercentage = 0;

    if (totalDays > 0) {
        operationalPercentage = (safeOperationalDays / totalDays) * 100;
        outOfServicePercentage = (safeNonOperationalDays / totalDays) * 100;
    }

    return (
        <Box>
            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                {t('asset.aset-activity-since-creation')}
            </Typography>
            <Box sx={{ p: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        mb: 1,
                    }}
                >
                    <Box>
                        <Typography variant="body2">{t('asset.operational')}</Typography>
                        <Typography variant="caption">
                            {safeOperationalDays} days ({Math.round(operationalPercentage)}%)
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2">{t('asset.out-of-service')}</Typography>
                        <Typography variant="caption">
                            {safeNonOperationalDays} days ({Math.round(outOfServicePercentage)}%)
                        </Typography>
                    </Box>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={operationalPercentage}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1976d2',
                        },
                        backgroundColor: '#e0e0e0',
                    }}
                />
            </Box>
        </Box>
    );
}

export default AssetOperationalStats;
