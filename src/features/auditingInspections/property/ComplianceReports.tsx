import { useState, useEffect } from 'react';
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
import Grid from '@mui/material/Grid2';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Close, Check, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DataGridToolTip from '../../../components/common/DataGridToolTip';

type Task = {
    id: number;
    plans: string;
    wed12pm: string;
    wed4pm: string;
    wed8pm: string;
    thu8am: string;
    thu12pm: string;
    fri8am: string;
    fri8am1: string;
    fri8am2: string;
    fri8am3: string;
    fri8am4: string;
    fri8am5: string;
};

interface ProperyListProps {
    id: number;
    name: string;
}

type TaskColumn =
    | 'wed12pm'
    | 'wed4pm'
    | 'wed8pm'
    | 'thu8am'
    | 'fri8am'
    | 'fri8am1'
    | 'fri8am2'
    | 'fri8am3'
    | 'fri8am4'
    | 'fri8am5';

const columns = [
    {
        field: 'plans',
        headerName: 'Plans',
        width: 200,
    },
    {
        field: 'wed12pm',
        renderHeader: () => <DataGridToolTip text={'Mar'} />,
        renderCell: renderChip,
    },
    {
        field: 'wed4pm',
        renderHeader: () => <DataGridToolTip text={'Apr'} />,
        renderCell: renderChip,
    },
    {
        field: 'wed8pm',
        renderHeader: () => <DataGridToolTip text={'May'} />,
        renderCell: renderChip,
    },
    {
        field: 'thu8am',
        renderHeader: () => <DataGridToolTip text={'Jun'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am',
        renderHeader: () => <DataGridToolTip text={'July'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am1',
        renderHeader: () => <DataGridToolTip text={'Aug'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am2',
        renderHeader: () => <DataGridToolTip text={'Sep'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am3',
        renderHeader: () => <DataGridToolTip text={'Oct'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am4',
        renderHeader: () => <DataGridToolTip text={'Nov'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am5',
        renderHeader: () => <DataGridToolTip text={'Dec'} />,
        renderCell: renderChip,
    },
];
const planCompletionRows = [
    { id: 1, planCompletion: '' },
    { id: 2, planCompletion: '100%' },
    { id: 3, planCompletion: '100%' },
    { id: 4, planCompletion: '100%' },
];
const tasks: Task[] = [
    {
        id: 1,
        plans: 'PAT Testing',
        wed12pm: '100%',
        wed4pm: 'N/A',
        wed8pm: '80%',
        thu8am: '72%',
        thu12pm: 'N/A',
        fri8am: '85%',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: '90%',
        fri8am5: '30%',
    },
    {
        id: 2,
        plans: 'Fire Extinguishers',
        wed12pm: '100%',
        wed4pm: 'N/A',
        wed8pm: '87%',
        thu8am: '77%',
        thu12pm: 'N/A',
        fri8am: '100%',
        fri8am1: '80%',
        fri8am2: '100%',
        fri8am3: 'N/A',
        fri8am4: '70%',
        fri8am5: '40%',
    },
    {
        id: 3,
        plans: 'Fire doors',
        wed12pm: '100%',
        wed4pm: 'N/A',
        wed8pm: '83%',
        thu8am: '78%',
        thu12pm: 'N/A',
        fri8am: 'N/A',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
];

function calculateAverageScore() {
    const columnsToCalculate: TaskColumn[] = [
        'wed12pm',
        'wed4pm',
        'wed8pm',
        'thu8am',
        'fri8am',
        'fri8am1',
        'fri8am2',
        'fri8am3',
        'fri8am4',
        'fri8am5',
    ];

    const averages = columnsToCalculate.map((col) => {
        const validValues: number[] = tasks
            .map((task) => {
                const value = task[col];
                // Convert percentage string to number (e.g., "80%" -> 80)
                if (value && value !== 'N/A') {
                    const percentage = parseInt(value.replace('%', ''), 10);
                    return !isNaN(percentage) ? percentage : null;
                }
                return null;
            })
            .filter((value) => value !== null);

        const validCount = validValues.length;

        if (validCount === 0) {
            return ' - '; // No valid values for this column, return ' - '
        }

        const totalPercentage = validValues.reduce((sum, value) => sum + value, 0);
        const averagePercentage = Math.round(totalPercentage / validCount);

        return `${averagePercentage}%`;
    });

    return {
        id: 'average',
        plans: 'Average Score',
        wed12pm: averages[0] === ' - ' ? ' N/A ' : averages[0],
        wed4pm: averages[1] === ' - ' ? ' N/A ' : averages[1],
        wed8pm: averages[2] === ' - ' ? ' N/A ' : averages[2],
        thu8am: averages[3] === ' - ' ? ' N/A ' : averages[3],
        thu12pm: averages[4] === ' - ' ? ' N/A ' : averages[4],
        fri8am: averages[5] === ' - ' ? ' N/A ' : averages[5],
        fri8am1: averages[6] === ' - ' ? ' N/A ' : averages[6],
        fri8am2: averages[7] === ' - ' ? ' N/A ' : averages[7],
        fri8am3: averages[8] === ' - ' ? ' N/A ' : averages[8],
        fri8am4: averages[9] === ' - ' ? ' N/A' : averages[9],
        fri8am5: averages[10] === ' - ' ? 'N/A ' : averages[10],
    };
}
const planCompletionColums = [
    {
        field: 'planCompletion',
        headerName: 'Plan Completion',
        flex: 1,
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

function renderChip(params: any) {
    const value = params.value;

    let chipColor: 'success' | 'error' | 'primary' | 'default' = 'default';
    let backgroundColor: string = 'rgba(0, 123, 255, 0.2)';
    let fontColor: string = 'blue';

    if (value === 'none' || value === 'pass' || value === 'fail' || value === 'N/A') {
        switch (value) {
            case 'pass':
                chipColor = 'success';
                backgroundColor = 'rgba(181, 237, 237, 0.2)';
                fontColor = '#027A48';
                break;
            case 'fail':
                chipColor = 'error';
                backgroundColor = 'rgba(242, 191, 196, 0.3)';
                fontColor = '#C01048';
                break;
            case 'N/A':
                chipColor = 'default';
                backgroundColor = 'rgba(169, 169, 169, 0.2)';
                fontColor = '#98A2B3';
                break;
            default:
                chipColor = 'default';
                backgroundColor = 'rgba(0, 123, 255, 0.2)';
                fontColor = 'blue';
                break;
        }
    } else if (typeof value === 'string' && value.includes('%')) {
        const numericValue = parseInt(value.replace('%', ''), 10);
        if (numericValue >= 60) {
            chipColor = 'success';
            backgroundColor = 'rgba(144, 238, 144, 0.2)';
            fontColor = 'green';
        } else {
            chipColor = 'error';
            backgroundColor = 'rgba(242, 191, 196, 0.3)';
            fontColor = 'red';
        }
    } else {
        chipColor = 'default';
        backgroundColor = 'rgba(169, 169, 169, 0.2)';
        fontColor = '#98A2B3';
    }

    return (
        <Chip
            label={
                value === 'pass' ? (
                    <Check sx={{ marginTop: '15px' }} />
                ) : value === 'fail' ? (
                    <Close sx={{ marginTop: '17px' }} />
                ) : (
                    value
                )
            }
            color={chipColor}
            sx={{
                backgroundColor: backgroundColor,
                color: fontColor,
                padding: '4px 8px',
                fontWeight: 'bold',
                borderRadius: '7px',
                borderBottom: '0px !important',
                textDecoration: 'none',
                width: '100%',
            }}
        />
    );
}

const taskGranularBreadcrumbVariants = [
    {
        separator: '›',
        breadcrumbs: [
            { label: 'Westwood Cross', link: '/' },
            {
                label: 'Compliance',
                link: '/auditing-property-compliance',
            },
        ],
    },
];

export default function AuditingComplianceTask() {
    const { t } = useTranslation();
    const averageScoreRow = calculateAverageScore();
    const rows = [averageScoreRow, ...tasks];
    const [selectedSatrtMonth, setSelectedselectedSatrtMonth] = useState<Date | null>(
        new Date(2024, 2, 1),
    );
    const [selectedEndMonth, setSelectedselectedEndMonth] = useState<Date | null>(
        new Date(2024, 11, 1),
    );

    const [selectedPropery, setSelectedPropery] = useState<ProperyListProps | null>(null);
    const [properyList, setProperyList] = useState<ProperyListProps[]>([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const propertyId = queryParams.get('propertyId');
    const navigate = useNavigate();

    const handleResetFilters = () => {
        setSelectedselectedSatrtMonth(null);
        setSelectedselectedEndMonth(null);
        setSelectedPropery(null);
    };

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
                                {t('common.inspectionScore')}
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
                                {t('common.complianceScore')}
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

            <Grid container spacing={2} sx={{ marginTop: '25px' }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t('inspections.start-date')}
                                value={selectedSatrtMonth}
                                onChange={(newValue) => setSelectedselectedSatrtMonth(newValue)}
                                views={['year', 'month']}
                            />
                        </LocalizationProvider>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                marginX: 1,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Remove sx={{ fontSize: 12 }} />
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t('inspections.end-date')}
                                value={selectedEndMonth}
                                onChange={(newValue) => setSelectedselectedEndMonth(newValue)}
                                views={['year', 'month']}
                            />
                        </LocalizationProvider>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
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

            <Box sx={{ display: 'flex', gap: 2, width: '100%', marginTop: '3%' }}>
                <Box sx={{ flex: 3, overflowY: 'auto', width: '800px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowClassName={(params) =>
                            params.row.plans === 'Average Score' ? 'average-score-row' : ''
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
}
