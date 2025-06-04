import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Chip,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Modal,
    IconButton,
    CircularProgress,
    Container,
    Drawer,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ListHistoryReport from './ListHistoryReport';
import EmailReport from '../report/EmailReport';
import snackbar from '../../utils/ts/helper/snackbar';

// JSON data
const reportData = {
    status: 'Active',
    nextSendDate: 'Wednesday 12 May 2024, 09:00, Pacific Time (US and Canada)',
    from: 'Mallcomm',
    emailTo: [
        { avatar: 'A', email: 'alex.dixon@gmail.com' },
        { avatar: 'A', email: 'a-smith@hotmail.co.uk' },
    ],
    emailCC: [{ avatar: 'B', email: 'b.m@gmail.com' }],
    emailBCC: [{ avatar: 'J', email: 'jonathan.smith@google.mail.com' }],
    subject: 'My Productivity Report',
    message: 'This is a report about productivity of centres',
    frequency: 'Weekly',
    emailSchedule: [
        'Monday,9:00,Pacific Time (US and Canada)',
        'Tuesday,10:00,Pacific Time (US and Canada)',
        'Wednesday,10:00,Pacific Time (US and Canada)',
        'Friday,02:00,Pacific Time (US and Canada)',
        'Friday,11:00,Pacific Time (US and Canada)',
    ],
};

interface ViewEmailReportProps {
    closeDrawer: () => void;
}

const modalBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ViewEmailReport: React.FC<ViewEmailReportProps> = ({ closeDrawer }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showCancelModal, setCancelModal] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [showEmailReportModal, setEmailReportModal] = useState(false);

    const sendMail = () => {
        // setEmailReportModal(false);
        setEditModal(true);
        return snackbar(
            t('snackbar.email-report-updated'),
            'success',
            { horizontal: 'center', vertical: 'bottom' },
            2000,
        );
    };

    const openHistoryModal = () => {
        setOpenModal(true);
    };

    const closeHistoryModal = () => {
        setOpenModal(false);
    };

    const oncancelConfirm = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        closeDrawer();
    };

    const onDeleteConfirm = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        closeDrawer();
    };

    const onEditConfirm = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setEmailReportModal(false);
        closeDrawer();
        return snackbar(
            t('snackbar.columns-updated'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            null,
        );
    };

    const CancelScheduleModal = () => {
        return (
            <Modal
                open={showCancelModal}
                onClose={() => setCancelModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <IconButton
                        onClick={() => setCancelModal(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>

                    <Typography id="modal-title" variant="h6" component="h2">
                        {t('reporting.cancel-schedule')}
                    </Typography>

                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {t('reporting.confirm-cancel')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                        }}
                    >
                        <Button
                            onClick={() => setCancelModal(false)}
                            sx={{ mr: 2, textTransform: 'none' }}
                        >
                            {t('cases.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={oncancelConfirm}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('reporting.confirm')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        );
    };

    const DeleteScheduleModal = () => {
        return (
            <Modal
                open={showDeleteModal}
                onClose={() => setDeleteModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <IconButton
                        onClick={() => setDeleteModal(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>

                    <Typography id="modal-title" variant="h6" component="h2">
                        {t('reporting.delete-schedule')}
                    </Typography>

                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {t('reporting.confirm-delete')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                        }}
                    >
                        <Button
                            onClick={() => setDeleteModal(false)}
                            sx={{ mr: 2, textTransform: 'none' }}
                        >
                            {t('cases.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onDeleteConfirm}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('reporting.confirm')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        );
    };

    const EditScheduleModal = () => {
        return (
            <Modal
                open={showEditModal}
                onClose={() => setEditModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <IconButton
                        onClick={() => setEditModal(false)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>

                    <Typography id="modal-title" variant="h6" component="h2">
                        {t('reporting.update-schedule')}
                    </Typography>

                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {t('reporting.confirm-edit')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                        }}
                    >
                        <Button
                            onClick={() => setEditModal(false)}
                            sx={{ mr: 2, textTransform: 'none' }}
                        >
                            {t('cases.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onEditConfirm}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('reporting.confirm')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        );
    };

    const LoadingModal = () => {
        useEffect(() => {
            setCancelModal(false);
            setDeleteModal(false);
            setEditModal(false);
            setTimeout(() => setLoading(false), 3000);
        }, []);

        return (
            <Modal
                open={isLoading}
                onClose={() => setLoading(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                        {t('reporting.applying-changes')}
                    </Typography>

                    <Typography id="modal-description" variant="body2" color="text.secondary">
                        {t('reporting.do-not-refresh-page')}
                    </Typography>
                </Box>
            </Modal>
        );
    };

    return (
        <Container maxWidth="sm">
            <Box>
                {/* Action Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                        {t('report.my-productivity')}
                    </Typography>
                    <IconButton onClick={closeDrawer} edge="end">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginY: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'grey.100',
                                textTransform: 'none',
                                width: '30%',
                            }}
                            onClick={() => setCancelModal(true)}
                        >
                            {t('cases.cancel')}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'grey.100',
                                textTransform: 'none',
                                width: '27%',
                            }}
                            onClick={() => {
                                setEmailReportModal(true);
                            }}
                        >
                            {t('buttons.edit')}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            sx={{
                                color: 'black',
                                borderColor: 'white',
                                backgroundColor: 'grey.100',
                                textTransform: 'none',
                                width: '30%',
                            }}
                            onClick={() => setDeleteModal(true)}
                        >
                            {t('buttons.delete')}
                        </Button>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={openHistoryModal}
                        sx={{
                            color: 'black',
                            borderColor: 'white',
                            backgroundColor: 'grey.100',
                            textTransform: 'none',
                        }}
                    >
                        {t('reporting.reporting-history')}
                    </Button>
                </Box>

                {/* Report Details */}
                <Box sx={{ marginY: 2, marginBottom: '25px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('cases.status')}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.status}
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.next-snd-date')}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.nextSendDate}
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.from')}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.from}
                    </Typography>

                    {/* Email To */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.email-to')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                        {reportData.emailTo.map((recipient, index) => (
                            <Chip
                                key={index}
                                avatar={<Avatar>{recipient.avatar}</Avatar>}
                                label={recipient.email}
                            />
                        ))}
                    </Stack>

                    {/* Email CC */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.email-cc')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                        {reportData.emailCC.map((cc, index) => (
                            <Chip
                                key={index}
                                avatar={<Avatar>{cc.avatar}</Avatar>}
                                label={cc.email}
                            />
                        ))}
                    </Stack>

                    {/* Email BCC */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.email-bcc')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                        {reportData.emailBCC.map((bcc, index) => (
                            <Chip
                                key={index}
                                avatar={<Avatar>{bcc.avatar}</Avatar>}
                                label={bcc.email}
                            />
                        ))}
                    </Stack>

                    {/* Subject */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.subject')}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.subject}
                    </Typography>

                    {/* Message */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.message')}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.message}
                    </Typography>

                    {/* Frequency */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.frequency')}
                    </Typography>

                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        {reportData.frequency}
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {t('reporting.email-schedule')}
                    </Typography>
                    {reportData.emailSchedule.map((schedule, index) => (
                        <Typography key={index} variant="body1">
                            {schedule}
                        </Typography>
                    ))}
                </Box>

                {/* Dialog/Modal to show the ListHistoryReport */}
                <Dialog open={openModal} onClose={closeHistoryModal} fullWidth maxWidth="lg">
                    {' '}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={closeHistoryModal}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            marginRight: '10px',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <ListHistoryReport />
                    </DialogContent>
                    <DialogActions></DialogActions>
                </Dialog>
                <Drawer
                    anchor="right"
                    open={showEmailReportModal}
                    onClose={() => setEmailReportModal(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '50%',
                            height: '100%',
                        },
                    }}
                >
                    {showEmailReportModal && (
                        <EmailReport
                            onSubmit={sendMail}
                            onCancel={() => setEmailReportModal(false)}
                            isEdit={true}
                        />
                    )}
                </Drawer>
                <CancelScheduleModal />
                <DeleteScheduleModal />
                <EditScheduleModal />
                {isLoading && <LoadingModal />}
            </Box>
        </Container>
    );
};

export default ViewEmailReport;
