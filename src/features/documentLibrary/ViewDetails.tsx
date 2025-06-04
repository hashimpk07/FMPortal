import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Button,
    Typography,
    //   Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    CircularProgress,
    Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { t } from 'i18next';
import Grid from '@mui/material/Grid2';
import { Delete, Edit, Close } from '@mui/icons-material';
import snackbar from '../../utils/ts/helper/snackbar';
import HTTP from '../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../constants';

const ViewDetails = ({ data, setEdit, setDocumentDetailModal, setDeleteCount }: any) => {
    const [showDeleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [isLoading, setLoading] = useState(false);

    if (data.expiryTime) {
        //const utcDate = parseISO(data.expiryTime, 'HH:mm', new Date());
        //const zonedDate = utcToZonedTime(utcDate, timeZone);
    }
    const deleteDocumentRecord = async () => {
        try {
            const response = await HTTP.delete(
                `${API_BASE_URL}/${API_VERSION}/documents/${data.id}`,
            );

            if (response.status === 204) {
                setDeleteCount((prev: number) => prev + 1);
                setDeleteConfirmModal(false);
                setDocumentDetailModal(false);
                snackbar(
                    t('snackbar.docuemnt-deleted-error-meessage'),
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
            }
        } catch (error) {
            console.log(error);
            setDeleteConfirmModal(false);
            snackbar(
                t('snackbar.common.something-went-wrong'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
        }
    };

    const DeleteConfirmModal = () => {
        return (
            <Dialog open={showDeleteConfirmModal} onClose={() => setDeleteConfirmModal(false)}>
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {t('common.delete-document')}
                    <IconButton aria-label="close" onClick={() => setDeleteConfirmModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>{t('documentLibrary.delete-message')}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ marginBottom: '15px' }}>
                    <Button onClick={() => setDeleteConfirmModal(false)} variant="outlined">
                        {t('buttons.cancel')}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={async () => {
                            setLoading(true);
                            await deleteDocumentRecord();
                        }}
                        sx={{ backgroundColor: 'blue', color: 'white' }}
                    >
                        {t('buttons.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const LoadingModal = React.forwardRef(() => {
        useEffect(() => {
            setTimeout(() => {
                setLoading(false);
                setDocumentDetailModal(false);
            }, 3000);
            setDeleteConfirmModal(false);
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
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ padding: 3 }}>
                <Box sx={{ pb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEdit(true)}
                        sx={{ mr: 2 }}
                    >
                        {t('buttons.edit')}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        //  onClick={() => deleteDocumentRecord()}
                        onClick={() => {
                            setDeleteConfirmModal(true);
                        }}
                    >
                        {t('buttons.delete')}
                    </Button>
                </Box>
                <form>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.name')}
                            </Typography>
                            <Typography variant="body1">{data.name}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}></Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.description')}
                            </Typography>
                            <Typography variant="body1">{data.description}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.property')}
                            </Typography>
                            <Typography variant="body1">{data.property}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.document-type')}
                            </Typography>
                            <Typography variant="body1">{data.type}</Typography>
                        </Grid>
                        {/* <Grid size={{ xs: 12, lg: 12 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.assets')}
                            </Typography>
                            {data?.selectedAssets?.map((asset: any, index: number) => (
                                <Chip
                                    sx={{ mr: 1, mt: 1 }}
                                    key={index}
                                    label={asset.name}
                                />
                            ))}
                            <Typography variant="body1">{data.asset}</Typography>
                        </Grid> */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.expire-date')}
                            </Typography>
                            <Typography variant="body1">{data.expiryDate}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.expire-time')}
                            </Typography>
                            <Typography variant="body1">{data.expiryTime}</Typography>
                        </Grid>
                        {/* <Grid size={{ xs: 12, lg: 12 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.tags')}
                            </Typography>
                            {data?.tags?.map((tag: string, index: number) => (
                                <Chip
                                    sx={{ mr: 1, mt: 1 }}
                                    key={index}
                                    label={tag || 'Building Invoice.pdf'}
                                />
                            ))}
                        </Grid> */}
                    </Grid>
                </form>
            </Box>

            <DeleteConfirmModal />
            {isLoading && (
                <Modal open={isLoading} onClose={() => setLoading(false)}>
                    <LoadingModal />
                </Modal>
            )}
        </Container>
    );
};

export default ViewDetails;
