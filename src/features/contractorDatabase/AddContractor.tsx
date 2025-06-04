import {
    Avatar,
    Typography,
    Box,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import CustomFileUpload from '../../components/common/CustomFileUpload';
import snackbar from '../../utils/ts/helper/snackbar';
import { RANDOM_AVATAR } from '../../constants';

interface ContractorInfoprops {
    id?: number | null;
    imageUrl?: string;
    companyName: string;
    selectedCompanyId?: number;
    description: string;
    email: string;
    phoneNumber: string;
    rate: string;
    taxId: string;
    onlineStatus?: boolean;
    profileImage?: string;
    firstName: string;
    lastName: string;
    selectedRateUnit?: string;
    selectedRateUnitId?: number;
    addressline1: string;
    addressline2: string;
    country: string;
    city: string;
    street: string;
    postcode: string;
    selectedWorkOrder?: string;
    selectedWorkOrderId?: number;
    invoiceFiles?: File[];
    documentFiles?: File[];
    isEdit?: boolean;
}

interface AddContractorProps {
    data?: ContractorInfoprops;
    onSubmit: (contractorData: ContractorInfoprops) => void;
    onCancel: () => void;
    isEdit: boolean;
}

interface CompanyListProps {
    id: number;
    name: string;
}

interface RateUnitListProps {
    id: number;
    name: string;
}
interface WorkOrdersListProps {
    id: number;
    name: string;
    url: string;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AddContractor = ({ data, onCancel, onSubmit, isEdit = false }: AddContractorProps) => {
    const { t } = useTranslation();
    const [profileImage, setProfileImage] = useState<string>('');
    const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<CompanyListProps | null>(null);
    const [companyList, setCompanyList] = useState<CompanyListProps[]>([]);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [rate, setRate] = useState<string>('');
    const [selectedRateUnit, setSelectedRateUnit] = useState<RateUnitListProps | null>(null);
    const [rateUnitList, setRateUnitList] = useState<RateUnitListProps[]>([]);
    const [taxId, setTaxId] = useState<string>('');
    const [addressline1, setAddressLine1] = useState<string>('');
    const [addressline2, setAddressLine2] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrdersListProps | null>(null);
    const [workOrdersList, setWorkOrdersList] = useState<WorkOrdersListProps[]>([]);
    const [invoiceFiles, setInvoiceFiles] = useState<any[]>([]);
    const [documentFiles, setDocumentFiles] = useState<any[]>([]);

    useEffect(() => {
        //load initial data
        getCompanies();
        getRateUnits();
        getWorkOrders();
    }, []);

    useEffect(() => {
        if (isEdit) {
            if (data?.id) getContractorInfo(data?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);

    const getCompanies = () => {
        // api here to fetch all companies
        setCompanyList([
            { id: 1, name: 'Company1' },
            { id: 2, name: 'Company2' },
            { id: 3, name: 'Company3' },
        ]);
    };

    const getRateUnits = () => {
        // api here to fetch all rate-unit
        setRateUnitList([
            { id: 1, name: 'Hourly' },
            { id: 2, name: 'Daily' },
            { id: 3, name: 'Weekly' },
        ]);
    };

    const getWorkOrders = () => {
        // api here to fetch all assigned work orders
        setWorkOrdersList([
            { id: 1, name: 'ACS-2345/2', url: '' },
            { id: 2, name: 'ACS-2345/3', url: '' },
            { id: 3, name: 'ACS-2345/4', url: '' },
        ]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
            const imageUrl = URL.createObjectURL(file); //replace later
            setProfileImage(imageUrl);
            // setProfileImage('https://i.pravatar.cc/300');
        }
    };

    const getContractorInfo = (id: number) => {
        // api here... to fetch the contractor details for edit
        console.log('contractor-id : ', id);
        setProfileImage(RANDOM_AVATAR);
        setSelectedCompany({ id: 2, name: 'Company2' });
        setDescription('Site manager - Oakwood Conveyancing');
        setFirstName('Alex');
        setLastName('Trapper');
        setEmail('alex@test.com');
        setPhoneNumber('+22 12345678');
        setRate('65');
        setSelectedRateUnit({ id: 2, name: 'Daily' });
        setTaxId('Tax12');
        setAddressLine1('Oakwood Conveyancing Ltd Suite 5B');
        setAddressLine2('Ashton Building');
        setCountry('United Kingdom');
        setCity('Birmingham');
        setStreet('12 Victoria Street');
        setPostcode('B1 1AA');
        setSelectedWorkOrder({ id: 2, name: 'ACS-2345/3', url: '' });
        setInvoiceFiles([
            { id: 1, file: { name: 'INV-043.png' }, preview: '' },
            { id: 2, file: { name: 'INV-048.png' }, preview: '' },
        ]);
        setDocumentFiles([
            { id: 1, file: { name: 'floor_plan.pdf' }, preview: '' },
            { id: 2, file: { name: 'site_plan.pdf' }, preview: '' },
            { id: 2, file: { name: 'certificate.pdf' }, preview: '' },
        ]);
    };

    const submitForm = () => {
        if (!selectedCompany) {
            snackbar(
                t('snackbar.please-select-a-company'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                1000,
            );
        } else {
            const contractorData: ContractorInfoprops = {
                profileImage: profileImage,
                companyName: selectedCompany.name,
                selectedCompanyId: selectedCompany.id,
                description,
                firstName,
                lastName,
                email,
                phoneNumber,
                rate,
                selectedRateUnit: selectedRateUnit?.name,
                selectedRateUnitId: selectedRateUnit?.id,
                taxId,
                addressline1,
                addressline2,
                country,
                city,
                street,
                postcode,
                selectedWorkOrder: selectedWorkOrder?.name,
                selectedWorkOrderId: selectedWorkOrder?.id,
                invoiceFiles,
                documentFiles,
                isEdit: isEdit,
            };
            if (isEdit) contractorData.id = data?.id;
            onSubmit(contractorData);
        }
    };

    return (
        <Container maxWidth="sm">
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
                        {isEdit
                            ? t('contractor.contractor-details')
                            : t('contractor.new-contractor')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onCancel}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <form>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Typography variant="h3" gutterBottom>
                                {t('contractor.general')}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <FormControl fullWidth>
                                <Typography variant="subtitle1" gutterBottom>
                                    {t('contractor.avatar')}
                                </Typography>
                                {/* <Avatar
                                    alt="Choose image"
                                    src={profileImage}
                                    sx={{ width: 80, height: 80 }}
                                    variant="square"
                                /> */}
                                <Avatar
                                    alt={t('contractor.choose-image')}
                                    src={profileImage || ''}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#f0f0f0',
                                        color: '#757575',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 15,
                                        fontWeight: 500,
                                        border: '1px solid #ccc',
                                        textAlign: 'center',
                                    }}
                                    variant="square"
                                >
                                    {!profileImage && t('contractor.choose-image')}
                                </Avatar>

                                <Box display="flex" alignItems="center">
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="outlined"
                                        tabIndex={-1}
                                        sx={{
                                            marginTop: 2,
                                            textTransform: 'none',
                                            width: '20%',
                                            marginRight: 2,
                                            borderColor: '#bdbdbd',
                                            color: 'black',
                                            fontSize: 12,
                                        }}
                                    >
                                        {t('common.choose-file')}
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleFileChange}
                                            // multiple
                                        />
                                    </Button>
                                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                                        {selectedFile
                                            ? selectedFile
                                            : t('contractor.no-file-chosen')}
                                    </Typography>
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="company-name-label">
                                    {t('contractor.company-name')}
                                </InputLabel>
                                <Select
                                    labelId="company-name-select"
                                    value={selectedCompany?.id || ''}
                                    label={t('contractor.company-name')}
                                    onChange={(e) => {
                                        setSelectedCompany(
                                            companyList.find(
                                                (company) => company.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {companyList.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('contractor.description')}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-first-name"
                                label={t('contractor.first-name')}
                                fullWidth
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-last-name"
                                label={t('contractor.last-name')}
                                fullWidth
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-email"
                                label={t('contractor.email')}
                                fullWidth
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                id="contractor-phone-number"
                                label={t('contractor.phone-number')}
                                fullWidth
                                // type="number"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="rate">{t('contractor.rate')}</InputLabel>
                                <OutlinedInput
                                    id="rate"
                                    startAdornment={
                                        <InputAdornment position="start">&pound;</InputAdornment>
                                    }
                                    label={t('contractor.rate')}
                                    value={rate}
                                    onChange={(e) => {
                                        setRate(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="rate-unit-label">
                                    {t('contractor.rate-unit')}
                                </InputLabel>
                                <Select
                                    labelId="rate-unit-select"
                                    value={selectedRateUnit?.id || ''}
                                    label={t('contractor.rate-unit')}
                                    onChange={(e) => {
                                        setSelectedRateUnit(
                                            rateUnitList.find(
                                                (unit) => unit.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {rateUnitList.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                id="contractor-tax-id"
                                label={t('contractor.tax-id')}
                                fullWidth
                                value={taxId}
                                onChange={(e) => {
                                    setTaxId(e.target.value);
                                }}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Typography variant="h5" gutterBottom>
                                {t('contractor.address')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('contractor.address-line-1')}
                                variant="outlined"
                                rows={4}
                                fullWidth
                                value={addressline1}
                                onChange={(e) => {
                                    setAddressLine1(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('contractor.address-line-2')}
                                variant="outlined"
                                rows={4}
                                fullWidth
                                value={addressline2}
                                onChange={(e) => {
                                    setAddressLine2(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-country"
                                label={t('contractor.country')}
                                fullWidth
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-city"
                                label={t('contractor.city')}
                                fullWidth
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-street"
                                label={t('contractor.street')}
                                fullWidth
                                value={street}
                                onChange={(e) => {
                                    setStreet(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                id="contractor-postcode"
                                label={t('contractor.postcode')}
                                fullWidth
                                value={postcode}
                                onChange={(e) => {
                                    setPostcode(e.target.value);
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Typography variant="h5" gutterBottom>
                                {t('contractor.documentation')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="assigned-work-orders-label">
                                    {t('contractor.assigned-work-orders')}
                                </InputLabel>
                                <Select
                                    sx={{ width: '50%' }}
                                    labelId="assigned-work-order-select"
                                    value={selectedWorkOrder?.id || ''}
                                    label={t('contractor.assigned-work-orders')}
                                    onChange={(e) => {
                                        setSelectedWorkOrder(
                                            workOrdersList.find(
                                                (order) => order.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {workOrdersList.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CustomFileUpload
                                files={invoiceFiles}
                                setFiles={setInvoiceFiles}
                                label="Linked Invoices"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CustomFileUpload
                                files={documentFiles}
                                setFiles={setDocumentFiles}
                                label="Linked Documents"
                            />
                        </Grid>

                        {/* Divider before Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ marginY: 2 }} />
                        </Grid>

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }} sx={{ marginBottom: '25px' }} textAlign="right">
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2, textTransform: 'none' }}
                                onClick={onCancel}
                            >
                                {t('contractor.cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ marginRight: 2, textTransform: 'none' }}
                                onClick={submitForm}
                            >
                                {isEdit ? t('contractor.update') : t('contractor.create')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default AddContractor;
