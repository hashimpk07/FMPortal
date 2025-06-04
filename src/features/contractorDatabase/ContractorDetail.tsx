import { Avatar, Typography, Chip, Box, Container, Modal, Badge, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LaunchIcon from '@mui/icons-material/Launch';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { Close } from '@mui/icons-material';
import DocumentList from './DocumentList';

interface ContractorInfoprops {
    id?: number | null;
    firstName: string;
    lastName: string;
    designation?: string;
    imageUrl?: string;
    companyName: string;
    description: string;
    email: string;
    phoneNumber: string;
    rate: string;
    taxId: string;
    addressline1: string;
    addressline2: string;
    country: string;
    city: string;
    street: string;
    postcode: string;
    linkedInvoices?: InvoiceProps[];
    documents?: DocumentProps[];
    assignedWorkOrder?: WorkOrderProps[];
    onlineStatus?: boolean;
    selectedRateUnit?: string;
}

interface InvoiceProps {
    id: number;
    name: string;
    url: string;
}

interface DocumentProps {
    id: number;
    name: string;
    url: string;
    size?: string;
    lastUpdatedAt?: string;
    type?: string;
}

interface WorkOrderProps {
    id: number;
    name: string;
    url: string;
}

interface ContractorDetailProps {
    data?: ContractorInfoprops;
    onEdit?: () => void;
    onClose: () => void;
}

const ContractorDetail = ({ data, onEdit, onClose }: ContractorDetailProps) => {
    const { t } = useTranslation();
    const [openDocumentPreviewModal, setDocumentPreviewModal] = useState(false);
    const [documentList, setDocumentList] = useState<DocumentProps[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<DocumentProps>();

    const showDocumentPreviewModal = (list: DocumentProps[], selectedItem: DocumentProps) => {
        setDocumentPreviewModal(true);
        setDocumentList(list);
        setSelectedDocument(selectedItem);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ paddingTop: '2px' }}>
                <Stack
                    direction="row"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                        {t('contractor.contractor-details')}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Stack>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <Grid container spacing={3} sx={{ my: 4 }}>
                    <Grid
                        size={{ xs: 12, sm: 4, md: 4, lg: 2 }}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        {/* Avatar with online/offline indicator */}
                        <Box sx={{ ml: 4 }}>
                            <Badge
                                variant="dot"
                                sx={{
                                    '& .MuiBadge-dot': {
                                        backgroundColor: '#68CD66',
                                        height: '12px',
                                        width: '12px',
                                        borderRadius: '50%',
                                        transform: 'translate(100%, 100%)',
                                    },
                                }}
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            >
                                <Avatar
                                    alt=""
                                    src={data?.imageUrl}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Badge>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 8, md: 9, lg: 10 }}>
                        <Box sx={{ ml: 5 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}
                                gutterBottom
                            >
                                {data?.firstName} {data?.lastName}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                {data?.designation}
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<SendIcon />}
                                sx={{
                                    backgroundColor: '#F1F1F1',
                                    color: 'black',
                                    textTransform: 'none',
                                    margin: '0 10px 0 0',
                                }}
                            >
                                <a
                                    href={`mailto:${data?.email}`}
                                    target="_blank"
                                    style={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t('contractor.send-email')}
                                </a>
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<ModeEditIcon />}
                                sx={{
                                    backgroundColor: '#F1F1F1',
                                    color: 'black',
                                    textTransform: 'none',
                                    margin: '0 10px 0 0',
                                }}
                                onClick={onEdit}
                            >
                                {t('contractor.edit-contractor')}
                            </Button>

                            <IconButton aria-label="more">
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                {/* company section */}
                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.company-name')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.companyName}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.description')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.description}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.email')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.email}
                        </Typography>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.phone-number')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.phoneNumber}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.rate')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.rate}/{data?.selectedRateUnit}
                        </Typography>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.tax-id')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.taxId}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.address')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.addressline1}
                            {data?.addressline2 ? ', ' + data?.addressline2 : ''}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.street}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.city} {data?.postcode}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data?.country}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {t('contractor.linked-invoices')}
                        </Typography>
                        {data?.linkedInvoices?.length && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                }}
                            >
                                {data?.linkedInvoices.map((invoice, index) => (
                                    <Chip
                                        key={invoice.id || index}
                                        label={
                                            <Box
                                                component="span"
                                                sx={{
                                                    fontWeight: 500,
                                                    lineHeight: '150%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {invoice.name}
                                                <LaunchIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        marginLeft: 0.5,
                                                    }}
                                                />
                                            </Box>
                                        }
                                        onClick={() => {}}
                                        variant="outlined"
                                        sx={{
                                            margin: 1,
                                            padding: '0px 0px',
                                            borderRadius: '9px',
                                            cursor: 'pointer',
                                            backgroundColor: '#F9E9EF',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {' '}
                            {t('contractor.documents')}
                        </Typography>
                        {data?.documents?.length && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                }}
                            >
                                {data.documents.map((document, index) => (
                                    <Chip
                                        key={document.id || index}
                                        label={
                                            <Box
                                                component="span"
                                                sx={{
                                                    fontWeight: 500,
                                                    lineHeight: '150%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {document.name}
                                                <LaunchIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        marginLeft: 0.5,
                                                    }}
                                                />
                                            </Box>
                                        }
                                        onClick={() =>
                                            showDocumentPreviewModal(
                                                data?.documents || [],
                                                document,
                                            )
                                        }
                                        variant="outlined"
                                        sx={{
                                            margin: 1,
                                            padding: '0px 0px',
                                            borderRadius: '9px',
                                            cursor: 'pointer',
                                            backgroundColor: '#f5f5f5',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Grid container sx={{ marginBottom: '40px' }}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {' '}
                            {t('contractor.assigned-work-orders')}
                        </Typography>
                        {data?.assignedWorkOrder?.length && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                }}
                            >
                                {data.assignedWorkOrder.map((assignedWorkOrder, index) => (
                                    <Chip
                                        key={assignedWorkOrder.id || index}
                                        label={
                                            <Box
                                                component="span"
                                                sx={{
                                                    fontWeight: 500,
                                                    lineHeight: '150%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {assignedWorkOrder.name}
                                                <LaunchIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        marginLeft: 0.5,
                                                    }}
                                                />
                                            </Box>
                                        }
                                        onClick={() =>
                                            showDocumentPreviewModal(
                                                data?.assignedWorkOrder || [],
                                                assignedWorkOrder,
                                            )
                                        }
                                        variant="outlined"
                                        sx={{
                                            margin: 1,
                                            padding: '0px 0px',
                                            borderRadius: '9px',
                                            cursor: 'pointer',
                                            backgroundColor: '#f5f5f5',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
            <Modal open={openDocumentPreviewModal} onClose={() => setDocumentPreviewModal(false)}>
                <DocumentList
                    setDocumentListModal={setDocumentPreviewModal}
                    documentList={documentList}
                    selectedDocumentItem={selectedDocument}
                />
            </Modal>
        </Container>
    );
};

export default ContractorDetail;
