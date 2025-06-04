import {
    Container,
    Button,
    Divider,
    Box,
    Typography,
    Chip,
    Modal,
    CircularProgress,
    Backdrop,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
    Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { Close, Launch } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { format, parse, parseISO } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Stack } from '@mui/system';
import type { InvoicesData as InvoiceDataType } from '../../types/pageTypes';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import InvoiceDocument from './InvoiceDocument';
import snackbar from '../../utils/ts/helper/snackbar';

interface ViewInvoiceProps {
    closeForm: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdateCount: React.Dispatch<React.SetStateAction<number>>;
    id: number;
}

const ViewInvoice = ({ closeForm, setUpdateCount, id }: ViewInvoiceProps) => {
    const { t } = useTranslation();
    const [openDocumentPreviewModal, setDocumentPreviewModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState<InvoiceDataType>({});
    const [isLoading, setLoading] = useState(true);
    const [paymentOptions] = useState([
        { id: 'outstanding', name: 'Outstanding' },
        { id: 'overdue', name: 'Overdue' },
        { id: 'paid', name: 'Paid' },
    ]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('');
    const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());

    const avatarStyle = {
        width: 34,
        height: 34,
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    useEffect(() => {
        try {
            const getInvoiceDetail = async () => {
                setLoading(true);
                const {
                    data: {
                        data: { attributes },
                    },
                } = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/invoicing/invoices/${id}`);
                attributes.issueDate = format(parseISO(attributes.issueDate), 'dd/MM/yyyy');
                attributes.dueDate = attributes.dueDate
                    ? format(parseISO(attributes.dueDate), 'dd/MM/yyyy')
                    : '';
                attributes.paymentDate = attributes.paymentDate
                    ? parse(attributes.paymentDate, 'yyyy-MM-dd', new Date())
                    : '';
                setPaymentDate(attributes.paymentDate);
                setInvoiceData(attributes);
                setSelectedPaymentOption(attributes.paymentStatus);
                setLoading(false);
            };
            getInvoiceDetail();
        } catch (err) {
            setLoading(false);
            console.log('Error in invoice detail api', err);
        }
    }, [id]);

    const updatePayment = async () => {
        try {
            setLoading(true);
            if (!paymentDate) {
                return snackbar(
                    t('snackbar.select-a-payment-date'),
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
            }
            const date = format(paymentDate, 'yyyy-MM-dd');
            // prettier-ignore
            const { status } = await HTTP.patch(
                API_BASE_URL+'/'+API_VERSION+'/invoicing/invoices/'+id+
                '/payment-status?paymentStatus='+selectedPaymentOption+
                '&paymentDate='+date
            );
            if (status === 201) {
                setUpdateCount((prev) => prev + 1);
                snackbar(
                    t('snackbar.payment-status-updated-successfully'),
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
                closeForm(false);
            }
            setLoading(false);
        } catch (err) {
            console.log('Error in update payment status API', err);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                    onClick={() => setLoading(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
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
                        {t('modal-titles.invoice-details')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={() => closeForm(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <form>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.invoiceType')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {invoiceData.invoiceType}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.invoiceNumber')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {invoiceData.invoiceNumber}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.ContractorTenantName')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                <Stack direction="row" spacing={1}>
                                    <Avatar title={'Unavailable'} sx={avatarStyle}>
                                        UN
                                    </Avatar>
                                    <span>{invoiceData.contractor || '-'}</span>
                                </Stack>
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.amount')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                &pound; {invoiceData.amount}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.dateIssued')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {invoiceData.issueDate}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.dueDate')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {invoiceData.dueDate}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ pt: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="payment-status-select">
                                    {t('common.paymentStatus')}
                                </InputLabel>
                                <Select
                                    labelId="payment-status-select"
                                    value={selectedPaymentOption}
                                    label={t('common.paymentStatus')}
                                    onChange={(e) => setSelectedPaymentOption(e.target.value)}
                                >
                                    {paymentOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.documents')}
                            </Typography>
                            <Chip
                                label={invoiceData.fileName || 'Building Invoice.pdf'}
                                icon={<Launch />}
                                onClick={() => setDocumentPreviewModal(true)}
                            />
                        </Grid>

                        {selectedPaymentOption === 'paid' && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label={t('common.paymentDate')}
                                            format="dd/MM/yyyy"
                                            value={paymentDate}
                                            onChange={(newValue) => setPaymentDate(newValue)}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}></Grid>
                            </>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {t('common.taxRate')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {t('common.basicRate')} (
                                {invoiceData.taxRate && Math.round(invoiceData.taxRate as number)}
                                %)
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}></Grid>

                        {/* Divider before Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ mt: 2, mx: -6 }} />
                        </Grid>

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }} textAlign="right" sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={() => closeForm(false)}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button variant="contained" onClick={() => updatePayment()}>
                                {t('buttons.edit')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Modal open={openDocumentPreviewModal} onClose={() => setDocumentPreviewModal(false)}>
                <InvoiceDocument setDocumentPreviewModal={setDocumentPreviewModal} />
            </Modal>
        </Container>
    );
};

export default ViewInvoice;
