import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    Switch,
    FormControlLabel,
    Drawer,
    Typography,
} from '@mui/material';
import { Search, Login, Logout, Download } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Grid } from '@mui/system';
import snackbar from '../../utils/ts/helper/snackbar';
import type {
    PaymentInvoiceData,
    ContractorData,
    StatusData,
    InvoicesData as InvoiceDataType,
} from '../../types/pageTypes';
import CreateInvoice from './CreateInvoice';

interface ControlsProps {
    search: string;
    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
    selectedContractor: string;
    setSelectedContractor: React.Dispatch<React.SetStateAction<string>>;
    selectedPaymentStatus: string;
    setSelectedPaymentStatus: React.Dispatch<React.SetStateAction<string>>;
    setSearch: (value: string) => void;
    setRows: React.Dispatch<React.SetStateAction<InvoiceDataType[]>>;
    isReceivedChecked: boolean;
    setIsReceivedChecked: React.Dispatch<React.SetStateAction<boolean>>;
    isIssuedChecked: boolean;
    setIsIssuedChecked: React.Dispatch<React.SetStateAction<boolean>>;
    paymentDate: Date | null;
    setPaymentDate: React.Dispatch<React.SetStateAction<Date | null>>;
    dueDateStart: Date | null;
    setDueDateStart: React.Dispatch<React.SetStateAction<Date | null>>;
    dueDateEnd: Date | null;
    setDueDateEnd: React.Dispatch<React.SetStateAction<Date | null>>;
    setUpdateCount: React.Dispatch<React.SetStateAction<number>>;
}

const Controls = ({
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedContractor,
    setSelectedContractor,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    isReceivedChecked,
    setIsReceivedChecked,
    isIssuedChecked,
    setIsIssuedChecked,
    paymentDate,
    setPaymentDate,
    dueDateStart,
    setDueDateStart,
    dueDateEnd,
    setDueDateEnd,
    setUpdateCount,
}: ControlsProps) => {
    const { t } = useTranslation();

    const [contract, setContractor] = useState<ContractorData[]>([]);
    const [stat, setStat] = useState<StatusData[]>([]);
    const [paymentStatus, setPaymentStatus] = useState<PaymentInvoiceData[]>([]);
    const [openInvoiceIssueModal, setInvoiceIssueModal] = useState(false);
    const [openInvoiceReceiveModal, setInvoiceReceiveModal] = useState(false);

    const contractors = [
        {
            id: 1,
            name: 'John Doe',
        },
        {
            id: 2,
            name: 'Jane Smith',
        },
        {
            id: 3,
            name: 'Steve Smith',
        },
        {
            id: 4,
            name: 'John D Wills',
        },
    ];
    const statuses = [
        {
            id: 'pending',
            name: 'Pending',
        },
        {
            id: 'approved',
            name: 'Approved',
        },
        {
            id: 'reject',
            name: 'Reject',
        },
        {
            id: 'in progress',
            name: 'In Progress',
        },
        {
            id: 'completed',
            name: 'Completed',
        },
    ];
    const paymnets = [
        {
            id: 'paid',
            name: 'Paid',
        },
        {
            id: 'unpaid',
            name: 'Unpaid',
        },
        {
            id: 'outstanding',
            name: 'Outstanding',
        },
        {
            id: 'overdue',
            name: 'Overdue',
        },
    ];

    const handleChangeReceived = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsReceivedChecked(event.target.checked);
    };

    const handleChangeIssued = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsIssuedChecked(event.target.checked);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                setContractor(contractors);
                setStat(statuses);
                setPaymentStatus(paymnets);
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResetFilters = () => {
        setSelectedPaymentStatus('');
        setSelectedContractor('');
        setSelectedStatus('');
        setPaymentDate(null);
        setDueDateStart(null);
        setDueDateEnd(null);
        setSelectedPaymentStatus('');
    };

    const exportInvoiceList = () => {
        const a = document.createElement('a');
        a.href = 'sample_invoice_list.csv'; // temp
        a.download = `sample_invoice_list_${Date.now()}.csv`;
        a.click();
        snackbar(
            t('snackbar.export-completed-successfully'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            null,
        );
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1em',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        id="input-with-icon-textfield"
                        label={t('common.search')}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: '30%' }}
                        variant="outlined"
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1em',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Logout />}
                            onClick={() => setInvoiceReceiveModal(true)}
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.receive-invoice')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Login />}
                            onClick={() => setInvoiceIssueModal(true)}
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.issue-invoice')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Download />}
                            onClick={() => exportInvoiceList()}
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('invoice.export-as-CSV')}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '2em', marginTop: '50px' }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 3, sm: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Payment date"
                                    format="dd/MM/yyyy"
                                    value={paymentDate}
                                    onChange={(newValue) => setPaymentDate(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Due date start"
                                    format="dd/MM/yyyy"
                                    value={dueDateStart}
                                    onChange={(newValue) => setDueDateStart(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Due date end"
                                    format="dd/MM/yyyy"
                                    value={dueDateEnd}
                                    onChange={(newValue) => setDueDateEnd(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 3 }}>
                            <TextField
                                select
                                label={t('select.paymentStatus')}
                                value={selectedPaymentStatus}
                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {paymentStatus.map((paymentStatu) => (
                                    <MenuItem key={paymentStatu.id} value={paymentStatu.id}>
                                        {paymentStatu.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 3, sm: 3 }}>
                            <TextField
                                select
                                label={t('select.contractor')}
                                value={selectedContractor}
                                onChange={(e) => setSelectedContractor(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {contract.map((contract) => (
                                    <MenuItem key={contract.id} value={contract.id}>
                                        {contract.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 3 }}>
                            <TextField
                                select
                                label={t('select.status')}
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                variant="outlined"
                                fullWidth
                            >
                                {stat.map((stat) => (
                                    <MenuItem key={stat.id} value={stat.id}>
                                        {stat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 3, sm: 3 }}></Grid>
                        <Grid size={{ xs: 3, sm: 3 }}></Grid>
                    </Grid>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '15px',
                    }}
                >
                    <Typography variant="subtitle1">{t('buttons.invoiceReceived')}</Typography>
                    <FormControlLabel
                        sx={{ mr: 4 }}
                        control={
                            <Switch
                                checked={isReceivedChecked}
                                onChange={handleChangeReceived}
                                name="isReceived"
                                color="primary"
                            />
                        }
                        label=""
                        labelPlacement="start"
                    />
                    <Typography variant="subtitle1">{t('buttons.invoiceIssued')}</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isIssuedChecked}
                                onChange={handleChangeIssued}
                                name="isIssued"
                                color="primary"
                            />
                        }
                        label=""
                        labelPlacement="start"
                    />

                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginLeft: 'auto',
                            display: 'block',
                        }}
                    >
                        {t('buttons.clear-filter')}
                    </Button>
                </Box>
            </Box>
            <Drawer
                anchor="right"
                open={openInvoiceIssueModal}
                onClose={() => setInvoiceIssueModal(false)}
            >
                <CreateInvoice
                    type={'issued'}
                    closeForm={setInvoiceIssueModal}
                    onCancel={() => setInvoiceIssueModal(false)}
                    setUpdateCount={setUpdateCount}
                />
            </Drawer>
            <Drawer
                anchor="right"
                open={openInvoiceReceiveModal}
                onClose={() => setInvoiceReceiveModal(false)}
            >
                <CreateInvoice
                    type={'received'}
                    closeForm={setInvoiceReceiveModal}
                    onCancel={() => setInvoiceReceiveModal(false)}
                    setUpdateCount={setUpdateCount}
                />
            </Drawer>
        </>
    );
};

export default Controls;
