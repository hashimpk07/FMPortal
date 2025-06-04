import {
    Container,
    TextField,
    Button,
    Divider,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    InputAdornment,
    Backdrop,
    CircularProgress,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, FormEvent, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Close } from '@mui/icons-material';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import snackbar from '../../utils/ts/helper/snackbar';

interface CreateInvoiceProps {
    closeForm: React.Dispatch<React.SetStateAction<boolean>>;
    type: string;
    onCancel: () => void;
    setUpdateCount: React.Dispatch<React.SetStateAction<number>>;
}

const CreateInvoice = ({ closeForm, type, onCancel, setUpdateCount }: CreateInvoiceProps) => {
    const { t } = useTranslation();
    const [invoiceTypes] = useState([
        { id: 'issued', name: 'Issued' },
        { id: 'received', name: 'Received' },
    ]);
    const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>(type);
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [description, setDescription] = useState('');
    const [contractorTenants] = useState([
        { id: '1', name: 'Mary Jackson' },
        { id: '2', name: 'Peter Parker' },
    ]);
    const [selectedContractorTenant, setSelectedContractorTenant] = useState<number | string>('');
    const [amount, setAmount] = useState<string>('');
    const [dateIssued, setDateIssued] = useState<Date | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [paymentOptions] = useState([
        { id: 'outstanding', name: 'Outstanding' },
        { id: 'overdue', name: 'Overdue' },
        { id: 'paid', name: 'Paid' },
    ]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>();
    const [taxRates] = useState([
        { id: '0', name: 'Basic rate (0%)' },
        { id: '5', name: 'Basic rate (5%)' },
        { id: '20', name: 'Basic rate (20%)' },
    ]);
    const [selectedTaxRate, setSelectedTaxRate] = useState('');
    const [isLoading, setLoading] = useState(false);

    const InvoiceErrMsg = ({ msgObj }: { msgObj: any }) => {
        return (
            <ul>
                {msgObj.map((msg: any) => (
                    <li>{msg.detail}</li>
                ))}
            </ul>
        );
    };

    const saveInvoice = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault(); // To prevent page reload on form submit event
            setLoading(true);
            const data = {
                invoiceType: selectedInvoiceType,
                invoiceNumber: invoiceNumber,
                // avatar: 'https://i.pravatar.cc/300',
                contractorId: selectedContractorTenant,
                amount: amount,
                issueDate: dateIssued ? format(dateIssued, 'yyyy-MM-dd') : '',
                dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
                paymentStatus: selectedPaymentOption,
                description: description,
                document: uploadedFile?.name || '',
                taxRate: selectedTaxRate, // TEMPORARY FIX: need to correct once API backend is corrected
            };

            await HTTP.post(`${API_BASE_URL}/${API_VERSION}/invoicing/invoices`, data);
            setLoading(false);
            setUpdateCount((prev) => prev + 1);
            snackbar(
                t('snackbar.invoice-created-successfully'),
                'default',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
            closeForm(false);
        } catch (err: any) {
            const msgObj = err.response.data.errors;
            if (err.response.data?.errors?.length) {
                snackbar(
                    <InvoiceErrMsg msgObj={msgObj} />,
                    'warning',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
            } else {
                snackbar(
                    t('snackbar.common.something-went-wrong'),
                    'warning',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
            }
            setLoading(false);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setUploadedFile(selectedFile);
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
                    <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                        {t('modal-titles.invoice-details')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onCancel}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <form onSubmit={saveInvoice}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Typography variant="h6" gutterBottom>
                                {t('common.general')}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="invoice-type-select">
                                    {t('common.invoiceType')}
                                </InputLabel>
                                <Select
                                    labelId="invoice-type-select"
                                    value={selectedInvoiceType}
                                    label={t('common.invoiceType')}
                                    onChange={(e) => setSelectedInvoiceType(e.target.value)}
                                >
                                    {invoiceTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('common.invoiceNumber')}
                                variant="outlined"
                                fullWidth
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('common.description')}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="contractor-select">
                                    {t('common.ContractorTenantName')}
                                </InputLabel>
                                <Select
                                    labelId="contractor-select"
                                    value={selectedContractorTenant}
                                    label={t('common.ContractorTenantName')}
                                    onChange={(e) => setSelectedContractorTenant(e.target.value)}
                                >
                                    {contractorTenants.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="amount">{t('common.amount')} *</InputLabel>
                                <OutlinedInput
                                    id="amount"
                                    type="number"
                                    startAdornment={
                                        <InputAdornment position="start">&pound;</InputAdornment>
                                    }
                                    label={t('common.amount') + '*'}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('common.dateIssued')}
                                    format="dd/MM/yyyy"
                                    value={dateIssued}
                                    onChange={(newValue) => setDateIssued(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('common.dueDate')}
                                    format="dd/MM/yyyy"
                                    value={dueDate}
                                    onChange={(newValue) => setDueDate(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                            <TextField
                                label={t('common.assigned-invoice')}
                                variant="outlined"
                                type="file"
                                fullWidth
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="taxRate-select">{t('common.taxRate')}</InputLabel>
                                <Select
                                    labelId="taxRate-select"
                                    value={selectedTaxRate}
                                    label={t('common.taxRate')}
                                    onChange={(e) => setSelectedTaxRate(e.target.value)}
                                >
                                    {taxRates.map((rate) => (
                                        <MenuItem key={rate.id} value={rate.id}>
                                            {rate.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Divider before Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2, mx: -4 }} />
                        </Grid>

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }} sx={{ mb: 2 }} textAlign="right">
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={() => closeForm(false)}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button variant="contained" type="submit">
                                {t('buttons.create')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default CreateInvoice;
