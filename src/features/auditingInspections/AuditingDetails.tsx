import { Box, Typography, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

const AuditingDetails = () => {
    const { t } = useTranslation();
    const data = {
        score: '50%',
        completionStatus: 'On time',
        planName: 'Bathroom',
        itemLocation: 'Level 0 - East wing',
        inspectionDate: '26/12/24',
        inspectionTime: '08:00 PM',
        note: '  One of the soap dispensers is missing. We are out of paper towels in this size. One stall put out of order as it needs general cleaning. Work orders has been assigned to handle these issues.  ',
        inspectedBy: 'John Smith',
    };
    const scoreValue = parseFloat(data.score);
    const chipColor = scoreValue > 75 ? '#171A1C' : '#C01048';
    const borderColor = scoreValue > 75 ? '#388E3C' : '#FEB273';

    return (
        <Grid container spacing={3} marginTop={2} sx={{ marginLeft: '4%' }}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('common.score')}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginLeft: '-8px',
                    }}
                >
                    <Chip
                        label={data.score}
                        sx={{
                            borderRadius: '16px',
                            width: '35%',
                            display: 'flex',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: chipColor,
                            border: `2px solid ${borderColor}`,
                            backgroundColor: scoreValue > 75 ? '#A5D6A7' : '#FFEAD5',
                        }}
                    />
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.completion-status')}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                    {data.completionStatus}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.plan-name')}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                    {data.planName}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.item-location')}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                    {data.itemLocation}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.inspection-date')}{' '}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                    {data.inspectionDate}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.inspection-time')}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                    {' '}
                    {data.inspectionTime}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.inspected-by')}:
                </Typography>
                <Box display="flex" alignItems="center">
                    <img
                        src="https://i.pravatar.cc/300?img=6"
                        alt="Inspector"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginRight: '10px',
                        }} // Adjust image size and spacing
                    />
                    <Typography variant="h6" sx={{ fontSize: '15px' }}>
                        {data.inspectedBy}
                    </Typography>
                </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {t('inspections.notes')}:
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        textAlign: 'justify', // Align text with justified spacing
                    }}
                >
                    {data.note}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default AuditingDetails;
