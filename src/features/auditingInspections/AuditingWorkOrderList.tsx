import { Box, Typography, Chip } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useTranslation } from 'react-i18next';

const AuditingWorkOrderList = () => {
    const { t } = useTranslation();
    return (
        <Box sx={{ marginTop: '20px', marginLeft: '5%' }}>
            <Typography variant="h6" component="div" sx={{ marginBottom: '10px' }}>
                {t('common.assignedWorkOrders')}
            </Typography>
            <Box sx={{ marginBottom: '10px' }}>
                <Chip
                    icon={<OpenInNewOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        width: '50%',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        '& .MuiChip-icon': {
                            color: 'white',
                            order: 1,
                        },
                    }}
                    label="ACS-2345 / 1"
                />
            </Box>

            <Box sx={{ marginBottom: '10px' }}>
                <Chip
                    icon={<OpenInNewOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        width: '50%',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        '& .MuiChip-icon': {
                            color: 'white',
                            order: 1,
                        },
                    }}
                    label="ACS-2345 / 2"
                />
            </Box>

            <Box sx={{ marginBottom: '10px' }}>
                <Chip
                    icon={<OpenInNewOutlinedIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                        width: '50%',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        '& .MuiChip-icon': {
                            color: 'white',
                            order: 1,
                        },
                    }}
                    label="ACS-2345 / 3"
                />
            </Box>
        </Box>
    );
};

export default AuditingWorkOrderList;
