import { Box, Container, Divider, Tab, Tabs, Typography, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import AuditingDetails from './AuditingDetails';
import AuditingViewPDF from './AuditingViewPDF';
import AuditingWorkOrderList from './AuditingWorkOrderList';

const AuditingReportTabs = ({ handleClose }: { handleClose: () => void }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const { t } = useTranslation();

    return (
        <Container maxWidth="sm">
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ marginBottom: '0px' }}>
                        {t('common.report')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />

                <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)}>
                    <Tab sx={{ textTransform: 'none' }} label="Details" />
                    <Tab sx={{ textTransform: 'none' }} label="View PDF" />
                    <Tab sx={{ textTransform: 'none' }} label="Work Orders Assigned" />
                </Tabs>
                {tabIndex === 0 && <AuditingDetails />}
                {tabIndex === 1 && <AuditingViewPDF />}
                {tabIndex === 2 && <AuditingWorkOrderList />}
            </Box>
        </Container>
    );
};

export default AuditingReportTabs;
