import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Button,
    Typography,
    Chip,
    Breadcrumbs,
    Card,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Grid from '@mui/material/Grid2';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useTranslation } from 'react-i18next';
import DataGridToolTip from '../../../components/common/DataGridToolTip';

interface ProperyListProps {
    id: number;
    name: string;
}

const mainRows = [
    {
        id: 1,
        plans: 'Average score',
        '25/12/24': '93%',
        '26/12/24': 'N/A',
        '27/12/24': '95%',
        '28/12/24': '40%',
        '29/12/24': 'N/A',
        '30/12/24': '62%',
        '31/12/24': '78%',
    },
    {
        id: 2,
        plans: 'Car Park',
        '25/12/24': '100%',
        '26/12/24': 'N/A',
        '27/12/24': '100%',
        '28/12/24': 'N/A',
        '29/12/24': 'N/A',
        '30/12/24': '100%',
        '31/12/24': '100%',
    },
    {
        id: 3,
        plans: 'Bathrooms',
        '25/12/24': '79%',
        '26/12/24': 'N/A',
        '27/12/24': '95%',
        '28/12/24': 'N/A',
        '29/12/24': '62%',
        '30/12/24': '100%',
        '31/12/24': 'N/A',
    },
    {
        id: 4,
        plans: 'Perimeter checks',
        '25/12/24': '100%',
        '26/12/24': 'N/A',
        '27/12/24': '100%',
        '28/12/24': '100%',
        '29/12/24': 'N/A',
        '30/12/24': 'N/A',
        '31/12/24': '100%',
    },
];

const planCompletionRows = [
    { id: 1, planCompletion: '' },
    { id: 2, planCompletion: '100%' },
    { id: 3, planCompletion: '100%' },
    { id: 4, planCompletion: '100%' },
];

interface Breadcrumb {
    label: string;
    link: string;
}

interface TaskGranularBreadcrumbVariant {
    separator: string;
    breadcrumbs: Breadcrumb[];
}

const InspectionReports: React.FC = () => {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date('2024-12-25'),
        new Date('2024-12-31'),
    ]);
    const [selectedPropery, setSelectedPropery] = useState<ProperyListProps | null>(null);
    const [properyList, setProperyList] = useState<ProperyListProps[]>([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const propertyId = queryParams.get('propertyId');
    const navigate = useNavigate();
    const mainColumns = [
        {
            field: 'plans',
            headerName: 'Plans',
            width: 150,
            renderHeader: () => <DataGridToolTip text={'Plans'} />,
        },
        ...['25/12/24', '26/12/24', '27/12/24', '28/12/24', '29/12/24', '30/12/24', '31/12/24'].map(
            (date) => ({
                field: date,
                headerName: date,
                width: 97,
                renderHeader: () => <DataGridToolTip text={date} />,
                renderCell: (params: any) => renderChip(params.value),
            }),
        ),
    ];

    useEffect(() => {
        getProperty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Disable the warning for this line
    const getProperty = () => {
        const fetchedProperties: ProperyListProps[] = [
            { id: 1, name: 'Westwood Cross' },
            { id: 2, name: 'Eastwood Star & Cresent' },
            { id: 3, name: 'Hundred Acre Wood' },
            { id: 4, name: 'Northwood Ankh' },
        ];
        setProperyList(fetchedProperties);
        if (propertyId) {
            const foundProperty = fetchedProperties.find(
                (property) => property.id === Number(propertyId),
            );
            setSelectedPropery(foundProperty || null);
        } else {
            setSelectedPropery(fetchedProperties.find((property) => property.id === 1) || null);
        }
    };

    const planCompletionColums = [
        {
            field: 'planCompletion',
            headerName: 'Plan Completion',
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'Plan Completion'} />,
            renderCell: (params: any) => {
                if (params.value === '') {
                    return null;
                }

                return (
                    <Chip
                        label={params.value}
                        sx={{
                            backgroundColor: 'rgba(144, 238, 144, 0.1)',
                            color: 'green',
                            fontWeight: 'bold',
                        }}
                    />
                );
            },
        },
    ];
    const renderChip = (value: string) => {
        let color = 'green';
        if (value === 'N/A') color = 'Blue';
        else if (parseInt(value, 10) < 100) color = 'Green';
        else if (parseInt(value, 10) < 70) color = 'Orange';
        else if (parseInt(value, 10) < 50) color = 'Purple';

        if (value === 'N/A') {
            color = 'blue'; // Blue for N/A
        }

        const percentage = parseFloat(value.replace('%', ''));

        if (percentage >= 90) {
            color = 'green';
        } else if (percentage >= 70) {
            color = 'orange';
        } else if (percentage >= 50) {
            color = 'purple';
        } else if (percentage >= 1) {
            color = 'red';
        } else {
            color = 'blue';
        }

        return (
            <Chip
                label={value}
                sx={{
                    backgroundColor:
                        color === 'green' ? 'rgba(144, 238, 144, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                    color,
                    fontWeight: 'bold',
                }}
            />
        );
    };
    const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
        setDateRange(newValue);
    };

    const handleResetFilters = () => {
        setDateRange([null, null]);
        setSelectedPropery(null);
    };

    const taskGranularBreadcrumbVariants: TaskGranularBreadcrumbVariant[] = [
        {
            separator: '›',
            breadcrumbs: [
                { label: 'Westwood Cross', link: '/' },
                {
                    label: 'Inspections',
                    link: '/auditing-property-inspections',
                },
            ],
        },
    ];

    return (
        <Box sx={{ marginTop: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px',
                    }}
                >
                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        startIcon={<ArrowBackIosNewOutlinedIcon sx={{ fontSize: '1px' }} />}
                        sx={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => navigate('/auditing-protfolio')}
                    >
                        {t('buttons.back')}
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'grey',
                    }}
                >
                    <InfoOutlinedIcon sx={{ marginRight: 1 }} />
                    <Typography variant="body1" sx={{ display: 'inline' }}>
                        {t('inspections.not-live-data')}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h1">{t('inspections.inspections-compliance')}</Typography>

            {taskGranularBreadcrumbVariants.map((data, index) => (
                <Box key={index} sx={{ marginBottom: 4 }}>
                    <Breadcrumbs separator={data.separator} aria-label="breadcrumb">
                        {data.breadcrumbs.map((item, idx) => (
                            <Typography
                                key={idx}
                                color={item.link ? 'primary' : 'textSecondary'}
                                component={item.link ? 'a' : 'span'}
                                sx={{
                                    color: '#222',
                                    textDecoration: item.link ? 'none' : 'inherit',
                                }}
                            >
                                {item.link ? (
                                    <Link
                                        to={item.link}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    item.label
                                )}
                            </Typography>
                        ))}
                    </Breadcrumbs>
                </Box>
            ))}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '25px',
                }}
            ></Box>
            <Grid container spacing={2}>
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
                    <Box sx={{ display: 'flex', gap: 3, marginTop: '-7px' }}>
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
                            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: 'bold' }}>
                                {t('inspections.inspection-score')}
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
                            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: 'bold' }}>
                                {t('inspections.compliance-score')}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                                100%
                            </Typography>
                            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: 'bold' }}>
                                {t('inspections.completion-percentage')}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, width: '100%', marginTop: '3%' }}>
                <Box sx={{ flex: 3, overflowY: 'auto', width: '800px' }}>
                    <DataGrid
                        rows={mainRows}
                        columns={mainColumns}
                        getRowClassName={(params) =>
                            params.row.plans === 'Average score' ? 'average-score-row' : ''
                        }
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '14px',
                                padding: '8px',
                            },
                            '& .MuiDataGrid-row': {
                                backgroundColor: 'transparent',
                            },
                            '& .average-score-row': {
                                backgroundColor: '#f1f1f1',
                            },
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, overflowY: 'hidden', width: '50px' }}>
                    <DataGrid
                        rows={planCompletionRows}
                        columns={planCompletionColums}
                        autoPageSize
                        getRowClassName={(params) =>
                            params.row.planCompletion === '' ? 'average-score-row' : ''
                        }
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '14px',
                                padding: '8px',
                            },
                            '& .MuiDataGrid-row': {
                                backgroundColor: 'transparent',
                            },
                            '& .average-score-row': {
                                backgroundColor: '#f1f1f1',
                            },
                            overflow: 'hidden',
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default InspectionReports;
