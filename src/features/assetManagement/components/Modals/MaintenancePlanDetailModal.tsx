import {
    Button,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    IconButton,
    Stack,
    Chip,
    Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Delete } from '@mui/icons-material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import AssetDetailField from '../AssetDetailField';

interface MaintenancePlanDetailModalProps {
    id: string;
    open: boolean;
    onClose: () => void;
}

function MaintenancePlanDetailModal({ id, open, onClose }: MaintenancePlanDetailModalProps) {
    const [showDeleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { t } = useTranslation();

    const data = {
        id: id,
        scheduledMaintenance: 'Comprehensive System Inspection',
        nextScheduledDate: '2025-05-01T12:04:12.840Z',
        duration: '4 hours',
        assignedContractor: 'Mary Jackson',
        description:
            'The Annual Performance Inspection is a thorough evaluation of the rooftop solar panel system to ensure optimal operation and efficiency. The inspection involves examining the physical condition of each panel, checking for cracks, discoloration, or debris that might impact performance.',
        contactEmail: 'mjackson@hotmail.co.uk',
        contactPhoneNumber: '+22 2836 382323',
        status: 'Completed',
        location:
            'PowerPro Engineering Ltd, Unit 8, Quantum Building, 42 Magnet Road, Fusion Industrial Estate, Bristol, BS4 7GH, United Kingdom',
        linkedInvoices: ['INV-736', 'INV-145', 'INV-INV-925'],
    };

    const DeleteConfirmModal = () => {
        return (
            <Dialog open={showDeleteConfirmModal} onClose={() => setDeleteConfirmModal(false)}>
                <DialogTitle>{t('asset.delete-maintenance-plan')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('asset.delete-maintenance-content')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setDeleteConfirmModal(false)}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setLoading(true);
                            setDeleteConfirmModal(false);
                        }}
                    >
                        {t('buttons.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const LoadingModal = () => {
        useEffect(() => {
            const timer = setTimeout(() => {
                setLoading(false);
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }, []);

        return (
            <Dialog
                open={isLoading}
                onClose={() => {
                    setLoading(false);
                }}
                maxWidth="sm"
                fullWidth
            >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <IconButton
                        onClick={() => {
                            setLoading(false);
                            onClose();
                        }}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <CircularProgress size={40} sx={{ mb: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t('asset.applying-changes')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {t('asset.applying-changes-content')}
                    </Typography>
                </Box>
            </Dialog>
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '80vh',
                        maxHeight: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 1,
                    },
                }}
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            {t('asset.comprehensive-system-inspection')}
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                    <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<EditOutlinedIcon />}
                                size="small"
                            >
                                {t('buttons.edit')}
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => setDeleteConfirmModal(true)}
                                size="small"
                            >
                                {t('buttons.delete')}
                            </Button>
                        </Stack>
                    </Paper>

                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        {t('asset.general-details')}
                    </Typography>

                    <Grid container spacing={3}>
                        <AssetDetailField
                            label={t('asset.scheduled-maintenance')}
                            value={data.scheduledMaintenance}
                        />

                        <AssetDetailField
                            label={t('asset.next-scheduled-date')}
                            value={data.nextScheduledDate}
                        />

                        <AssetDetailField label={t('asset.duration')} value={data.duration} />

                        <AssetDetailField
                            label={t('asset.assigned-contractor')}
                            value={data.assignedContractor}
                        />

                        <AssetDetailField
                            label={t('asset.description')}
                            value={data.description}
                            fullWidth
                        />

                        <AssetDetailField label={t('asset.status')} value={data.status} />

                        <AssetDetailField
                            label={t('asset.contact-email')}
                            value={data.contactEmail}
                        />

                        <AssetDetailField
                            label={t('asset.contact-phone-number')}
                            value={data.contactPhoneNumber}
                        />

                        <AssetDetailField
                            label={t('asset.location')}
                            value={data.location}
                            fullWidth
                        />

                        <AssetDetailField
                            label={t('asset.linked-invoices')}
                            value={
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {data.linkedInvoices && data.linkedInvoices.length > 0 ? (
                                        data.linkedInvoices.map((invoice, index) => (
                                            <Chip
                                                key={index}
                                                label={invoice}
                                                onClick={() => {}}
                                                onDelete={() => {}}
                                                deleteIcon={
                                                    <OpenInNewOutlinedIcon
                                                        sx={{
                                                            color: 'black',
                                                        }}
                                                    />
                                                }
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2">
                                            {t('asset.no-invoices-linked')}
                                        </Typography>
                                    )}
                                </Box>
                            }
                            fullWidth
                        />
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        {t('asset.close')}
                    </Button>
                </DialogActions>
            </Dialog>

            {showDeleteConfirmModal && <DeleteConfirmModal />}
            {isLoading && <LoadingModal />}
        </>
    );
}

export default MaintenancePlanDetailModal;
