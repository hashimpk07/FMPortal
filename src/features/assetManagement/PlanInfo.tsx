import { Close, List } from '@mui/icons-material';
import {
    Box,
    Typography,
    Button,
    Divider,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Modal,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';

const PlanInfo = ({ onClose }: any) => {
    const [isLoading, setLoading] = useState(false);
    const [viewWorkOrder, setViewWorkOrder] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const planDetails = {
        workOrderNo: 'CA-1001',
        dueDate: '15 July 2024 - 14:00',
        status: 'Completed',
        started: '15 July 2024 - 09:00',
        completed: '15 July 2024 - 12:00',
        description:
            'The Annual Performance Inspection is a thorough evaluation of the rooftop solar panel system to ensure optimal operation and efficiency. The inspection involves examining the physical condition of each panel, checking for cracks, discoloration, or debris that might impact performance. The electrical system is tested to verify continuity and resistance, with voltage and current outputs measured and compared to expected benchmarks.',
    };

    const ConfirmModal = () => {
        return (
            <Dialog open={viewWorkOrder} onClose={() => setViewWorkOrder(false)}>
                <DialogTitle>{t('asset.view-work-order-details')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('asset.view-work-order-contnet')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: 'black' }} onClick={() => setViewWorkOrder(false)}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant="contained" onClick={() => setLoading(true)}>
                        {t('buttons.create')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const LoadingModal = () => {
        useEffect(() => {
            setTimeout(() => navigate('/cases-and-work-orders'), 3000);
        }, []);

        return (
            <Modal open={isLoading} onClose={() => setLoading(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <IconButton
                        onClick={() => setLoading(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>

                    <CircularProgress size={40} sx={{ mb: 3 }} />

                    <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
                        {t('asset.applying-changes')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t('asset.applying-changes-content')}
                    </Typography>
                </Box>
            </Modal>
        );
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Annual Performance Inspection - WO-1001-01
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Box
                sx={{
                    p: 3,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    height: '100%',
                }}
            >
                {/* Header Section */}
                <Box display="flex" alignItems="center" mb={3}>
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<List />}
                            onClick={() => setViewWorkOrder(true)}
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'grey.100',
                                fontWeight: 'bold',
                                mt: 1,
                            }}
                        >
                            {t('asset.view-full-details')}
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid size={{ md: 6, xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.work-order-number')}
                        </Typography>
                        <Typography variant="body2">{planDetails.workOrderNo}</Typography>
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.dueDate')}
                        </Typography>
                        <Typography variant="body2">{planDetails.dueDate}</Typography>
                    </Grid>

                    <Grid size={{ md: 4, xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.status')}
                        </Typography>
                        <Typography variant="body2">{planDetails.completed}</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.started')}
                        </Typography>
                        <Typography variant="body2">{planDetails.started}</Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.completed')}
                        </Typography>
                        <Typography variant="body2">{planDetails.completed}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.description')}
                        </Typography>
                        <Typography variant="body2">{planDetails.description}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <ConfirmModal />
            {isLoading && <LoadingModal />}
        </>
    );
};

export default PlanInfo;
