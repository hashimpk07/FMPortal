import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Button,
    Typography,
    Card,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import styled from '@emotion/styled';
import type { InvoicesData as InvoiceDataType } from '../../../types/pageTypes';
import columns from '../../../columnDefinitions/auditingInspectionCompliance';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

interface ProperyListProps {
    id: number;
    name: string;
}

const invoices: InvoiceDataType[] = [
    {
        id: 1,
        logo: 'westwood.png',
        propertyName: 'Westwood Cross',
        propertyId: 1,
        inspectionScore: '96%',
        complianceScore: '95%',
        completionRate: '100%',
        totalChecks: '100',
    },
    {
        id: 2,
        logo: 'eastwood.png',
        propertyName: 'Eastwood Star & Cresent',
        propertyId: 2,
        inspectionScore: '100%',
        complianceScore: '100%',
        completionRate: '100%',
        totalChecks: '100',
    },
    {
        id: 3,
        logo: 'hundred.png',
        propertyName: 'Hundred Acre Wood',
        propertyId: 3,
        inspectionScore: '100%',
        complianceScore: '100%',
        completionRate: '100%',
        totalChecks: '100',
    },
    {
        id: 4,
        logo: 'northwood.png',
        propertyName: 'Northwood Ankh',
        propertyId: 4,
        inspectionScore: '100%',
        complianceScore: '100%',
        completionRate: '100%',
        totalChecks: '100',
    },
];

const AuditingInspectionCompliance: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedPropery, setSelectedPropery] = useState<ProperyListProps | null>(null);
    const [properyList, setProperyList] = useState<ProperyListProps[]>([]);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date('2024-12-25'),
        new Date('2024-12-31'),
    ]);

    const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
        setDateRange(newValue);
    };

    const [rows, setRows] = useState<InvoiceDataType[]>([]);

    useEffect(() => {
        getProperty();
        getData();
    }, []);
    const getData = async () => {
        setRows(invoices);
    };

    const getProperty = () => {
        const fetchedProperties: ProperyListProps[] = [
            { id: 1, name: 'Westwood Cross' },
            { id: 2, name: 'Eastwood Star & Cresent' },
            { id: 3, name: 'Hundred Acre Wood' },
            { id: 4, name: 'Northwood Ankh' },
        ];
        setProperyList(fetchedProperties);
        setSelectedPropery(fetchedProperties.find((property) => property.id === 1) || null);
    };

    const handleResetFilters = () => {
        setDateRange([null, null]);
        setSelectedPropery(null);
    };

    return (
        <StyledPage>
            <Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 7 }}>
                        <Typography variant="h1">
                            {t('inspections.inspections-compliance')}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'grey',
                                float: 'right',
                            }}
                        >
                            <InfoOutlinedIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1" sx={{ display: 'inline' }}>
                                {t('inspections.not-live-data')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={4} marginTop={4}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel id="select.case-work-category'">
                                {t('common.property')}
                            </InputLabel>
                            <Select
                                labelId="category-name-select"
                                value={selectedPropery?.id || ''}
                                label={t('common.property')}
                                onChange={(e) => {
                                    setSelectedPropery(
                                        properyList.find(
                                            (property) => property.id === e.target.value,
                                        ) || null,
                                    );
                                }}
                            >
                                {properyList.map((property) => (
                                    <MenuItem key={property.id} value={property.id}>
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Box sx={{ display: 'flex', gap: 2, marginTop: '-7px' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DemoContainer components={['DateRangePicker']}>
                                    <DateRangePicker
                                        value={dateRange}
                                        onChange={handleDateRangeChange}
                                        localeText={{
                                            start: t('inspections.start-date'),
                                            end: t('inspections.end-date'),
                                        }}
                                        format="dd/MM/yyyy"
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            onClick={handleResetFilters}
                            sx={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                float: 'right',
                            }}
                        >
                            {t('buttons.clear-filter')}
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: '25px' }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card
                            elevation={1}
                            sx={{
                                display: 'flex',
                                padding: 2,
                                borderRadius: 2,
                                border: '1px solid #E0E0E0',
                                width: '88%',
                                height: '30px',
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >
                                    96%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ marginLeft: 2, fontWeight: 'bold' }}
                                >
                                    {t('inspections.average-inspection-score')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card
                            elevation={1}
                            sx={{
                                display: 'flex',
                                padding: 2,
                                borderRadius: 2,
                                border: '1px solid #E0E0E0',
                                width: '88%',
                                height: '30px',
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >
                                    95%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ marginLeft: 2, fontWeight: 'bold' }}
                                >
                                    {t('inspections.average-compliance-score')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid
                        size={{ xs: 12, sm: 4 }}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Card
                            elevation={1}
                            sx={{
                                display: 'flex',
                                padding: 2,
                                borderRadius: 2,
                                border: '1px solid #E0E0E0',
                                width: '88%',
                                height: '30px',
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >
                                    95%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ marginLeft: 2, fontWeight: 'bold' }}
                                >
                                    {t('inspections.avarage-completion-percentage')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ width: '100%' }} marginTop={4}>
                    <DataGrid
                        rows={rows}
                        columns={columns({ t })}
                        onCellClick={(params) => {
                            if (params.field === 'inspectionScore') {
                                navigate(
                                    `/auditing-property-inspections?propertyId=${params.row.propertyId}`,
                                );
                            }

                            if (params.field === 'complianceScore') {
                                navigate(
                                    `/auditing-property-compliance?propertyId=${params.row.propertyId}`,
                                );
                            }
                        }}
                    />
                </Box>
            </Box>
        </StyledPage>
    );
};

export default AuditingInspectionCompliance;
