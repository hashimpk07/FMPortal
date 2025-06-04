import { Close, List } from '@mui/icons-material';
import {
    Box,
    Typography,
    Avatar,
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
    Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { RANDOM_AVATAR } from '../../constants';

const ContractorInfo = ({ onClose }: any) => {
    const [viewContractor, setViewContractor] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const contractorData = {
        name: 'Alex Trapper',
        avatarUrl: RANDOM_AVATAR,
        role: 'Site Manager',
        company: 'Oakwood Conveyancing',
        description: 'Site manager - Oakwood Conveyancing',
        email: 'alex.trapper@gmail.com',
        phoneNo: '+22 7136 827319',
        address1: 'Oakwood Conveyancing Ltd Suite 5B, Ashton Building',
        address2: '12 Victoria Street',
        address3: 'Birmingham B1 1AA',
        address4: 'United Kingdom',
    };

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            marginRight: '10px',
        },
    }));

    const ConfirmModal = () => {
        return (
            <Dialog open={viewContractor} onClose={() => setViewContractor(false)}>
                <DialogTitle>{t('asset.view-contractor-details')}</DialogTitle>
                <IconButton
                    onClick={() => setViewContractor(false)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    <DialogContentText>{t('asset.view-contractor-content')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: 'black' }} onClick={() => setViewContractor(false)}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant="contained" onClick={() => setLoading(true)}>
                        {t('buttons.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const LoadingModal = () => {
        useEffect(() => {
            setTimeout(() => navigate('/contractor-database'), 3000);
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
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
            }}
        >
            <Box
                sx={{
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Contractor Details
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: 1,
                    }}
                >
                    <Close />
                </IconButton>
            </Box>
            <Box
                sx={{
                    p: 3,
                }}
            >
                {/* Header Section */}
                <Box display="flex" alignItems="center" mb={3}>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar
                            src={contractorData.avatarUrl}
                            alt={contractorData.name}
                            sx={{ width: 80, height: 80, mr: 2 }}
                        />
                    </StyledBadge>

                    <Box sx={{ marginLeft: '20px' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {contractorData.name}
                        </Typography>
                        <Typography variant="body2">{contractorData.role}</Typography>
                        <Button
                            variant="contained"
                            startIcon={<List />}
                            onClick={() => setViewContractor(true)}
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'grey.100',
                                fontWeight: 'bold',
                                marginTop: '10px',
                            }}
                        >
                            {t('asset.view-full-details')}
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.companyName')}
                        </Typography>
                        <Typography variant="body2">{contractorData.company}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ marginTop: '10px' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.description')}
                        </Typography>
                        <Typography variant="body2">{contractorData.description}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ marginTop: '10px' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.email')}
                        </Typography>
                        <Typography variant="body2">{contractorData.email}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ marginTop: '10px' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.phoneNumber')}
                        </Typography>
                        <Typography variant="body2">{contractorData.phoneNo}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} sx={{ marginTop: '10px', marginBottom: '25px' }}>
                        <Typography variant="body1" fontWeight="bold">
                            {t('asset.address')}
                        </Typography>
                        <Typography variant="body2">
                            {contractorData.address1}
                            <br />
                            {contractorData.address2}
                            <br />
                            {contractorData.address3}
                            <br />
                            {contractorData.address4}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <ConfirmModal />
            {isLoading && <LoadingModal />}
        </Box>
    );
};

export default ContractorInfo;
