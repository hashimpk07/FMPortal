import { Close } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControlLabel,
    IconButton,
    Switch,
    TextField,
    Typography,
    Divider,
    Container,
    Modal,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Stack } from '@mui/system';
import snackbar from '../../utils/ts/helper/snackbar';

const CreateBroadcast = ({ onClose }: any) => {
    const [title, setTitle] = useState('Rooftop Solor Panels');
    const [subtitle, setSubtitle] = useState('Further repairs required for our solor panels');
    const [isLoading, setLoading] = useState(false);
    const [isConfirmationOpen, setConfirmationOpen] = useState(false); // For confirmation modal

    const [message, setMessage] = useState(
        `Dear Tenants and Staff, We want to inform you that the rooftop solar panel system has experienced an unexpected fault that requires immediate maintenance. Our maintenance team, in collaboration with GreenEnergy Solutions, will be conducting essential repair and inspection work to restore full functionality.`,
    );
    const [publishDate, setPublishDate] = useState<Date | null>(new Date(2024, 9, 1, 0, 1, 0));
    const [removeDate, setRemoveDate] = useState<Date | null>(new Date(2024, 9, 1, 0, 1, 0));
    const [sendNotification, setSendNotification] = useState(true);

    const LoadingModal = () => {
        useEffect(() => {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }, []);

        return (
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
        );
    };

    const handleCreateClick = () => {
        // Open confirmation modal
        setConfirmationOpen(true);
    };

    const handleConfirmCreate = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setConfirmationOpen(false);
            onClose();
            snackbar(
                t('snackbar.broadcast-created-successfully'),
                'default',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
        }, 2000);
    };

    const handleCancelCreate = () => {
        setConfirmationOpen(false); // Close the confirmation modal
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                // height: '100vh',
                width: '100vw',
                maxWidth: '100%',
                justifyContent: 'center',
                mt: 2,
                mb: 100,
            }}
        >
            <Box sx={{ mt: -3 }}>
                <Stack
                    direction="row"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            fontWeight: '400',
                            fontSize: '22px',
                        }}
                    >
                        {t('asset.create-new-broadcast')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <Close />
                    </IconButton>
                </Stack>
            </Box>
            <Divider sx={{ mb: 2, mx: -3 }} />
            <Box sx={{ display: 'flex' }}>
                <Grid container spacing={4} sx={{ mb: -3 }}>
                    <Grid size={{ sm: 12, md: 12 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                fontWeight: '500',
                                fontSize: '20px',
                                textAlign: 'left',
                            }}
                        >
                            {t('asset.broadcast-details')}
                        </Typography>
                    </Grid>

                    <Grid size={{ sm: 12, md: 12 }}>
                        <TextField
                            label={t('common.title')}
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ sm: 12, md: 12 }}>
                        <TextField
                            label={t('asset.subtitle')}
                            variant="outlined"
                            fullWidth
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ sm: 12, md: 12 }}>
                        <TextField
                            label={t('asset.message')}
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={t('asset.publish-date')}
                                format="dd/MM/yyyy HH:mm a"
                                value={publishDate}
                                onChange={(newValue) => newValue && setPublishDate(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={t('asset.remove-from-app-date')}
                                format="dd/MM/yyyy HH:mm a"
                                value={removeDate}
                                onChange={(newValue) => newValue && setRemoveDate(newValue)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ sm: 12, md: 12 }} sx={{ textAlign: 'left' }}>
                        <FormControlLabel
                            value="bottom"
                            control={
                                <Switch
                                    checked={sendNotification}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSendNotification(event.target.checked);
                                    }}
                                />
                            }
                            label={t('asset.send-a-push-notification')}
                            labelPlacement="start"
                        />
                    </Grid>

                    <Grid sx={{ mb: 1 }} size={{ xs: 12 }} textAlign="right">
                        <Button variant="outlined" sx={{ marginRight: 2 }} onClick={onClose}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateClick} // Open confirmation dialog
                        >
                            {t('buttons.create')}
                        </Button>
                    </Grid>
                </Grid>

                {isLoading && (
                    <Modal open={isLoading} onClose={() => setLoading(false)}>
                        <LoadingModal />
                    </Modal>
                )}

                {/* Confirmation Modal */}
                <Dialog open={isConfirmationOpen} onClose={handleCancelCreate}>
                    <DialogTitle>{t('asset.confirm-create-broadcast')}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">{t('asset.send-broadcast-message')}</Typography>
                    </DialogContent>
                    <DialogActions sx={{ marginBottom: '10px' }}>
                        <Button onClick={handleCancelCreate} variant="outlined">
                            {t('buttons.cancel')}
                        </Button>
                        <Button onClick={handleConfirmCreate} variant="contained">
                            {t('buttons.confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default CreateBroadcast;
