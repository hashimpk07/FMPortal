import { useState } from 'react';
import { Typography, Box, Button, Breadcrumbs, Card, Chip, Drawer } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Link, useNavigate } from 'react-router-dom';
import { Close, Check, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AuditingReportTabs from './AuditingReportTabs';
import DataGridToolTip from '../../components/common/DataGridToolTip';

type Task = {
    id: number;
    task: string;
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

type TaskColumn =
    | 'wed12pm'
    | 'wed4pm'
    | 'wed8pm'
    | 'thu8am'
    | 'thu12pm'
    | 'fri8am'
    | 'fri8am1'
    | 'fri8am2'
    | 'fri8am3'
    | 'fri8am4'
    | 'fri8am5';

const columns = [
    {
        field: 'task',
        headerName: 'Tasks',
        renderHeader: () => <DataGridToolTip text={'Tasks'} />,
        width: 180,
    },
    {
        field: 'wed12pm',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Mar'} />,
        renderCell: renderChip,
    },
    {
        field: 'wed4pm',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Apr'} />,
        renderCell: renderChip,
    },
    {
        field: 'wed8pm',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'May'} />,
        renderCell: renderChip,
    },
    {
        field: 'thu8am',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Jun'} />,
        renderCell: renderChip,
    },
    {
        field: 'thu12pm',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'June'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'July'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am1',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Aug'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am2',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Sep'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am3',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Oct'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am4',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Nov'} />,
        renderCell: renderChip,
    },
    {
        field: 'fri8am5',
        width: 100,
        flex: 1,
        renderHeader: () => <DataGridToolTip text={'Dec'} />,
        renderCell: renderChip,
    },
];

const tasks: Task[] = [
    {
        id: 1,
        task: 'Fire Extinguisher A01',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'pass',
        thu8am: 'fail',
        thu12pm: 'fail',
        fri8am: 'fail',
        fri8am1: 'fail',
        fri8am2: 'fail',
        fri8am3: 'fail',
        fri8am4: 'fail',
        fri8am5: 'fail',
    },
    {
        id: 2,
        task: 'Fire Extinguisher A02',
        wed12pm: 'N/A',
        wed4pm: 'N/A',
        wed8pm: 'N/A',
        thu8am: 'N/A',
        thu12pm: 'pass',
        fri8am: 'N/A',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
    {
        id: 3,
        task: 'Fire Extinguisher A03',
        wed12pm: 'N/A',
        wed4pm: 'N/A',
        wed8pm: 'N/A',
        thu8am: 'N/A',
        thu12pm: 'N/A',
        fri8am: 'N/A',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
    {
        id: 4,
        task: 'Fire Extinguisher B01',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'fail',
        thu8am: 'pass',
        thu12pm: 'fail',
        fri8am: 'pass',
        fri8am1: 'fail',
        fri8am2: 'fail',
        fri8am3: 'fail',
        fri8am4: 'fail',
        fri8am5: 'fail',
    },
    {
        id: 5,
        task: 'Fire Extinguisher B02',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'fail',
        fri8am: 'pass',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
    {
        id: 6,
        task: 'Fire Extinguisher B03',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'pass',
        fri8am: 'pass',
        fri8am1: 'N/A',
        fri8am2: 'N/A',
        fri8am3: 'N/A',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
    {
        id: 7,
        task: 'Fire Extinguisher C01',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'pass',
        fri8am: 'pass',
        fri8am1: 'N/A',
        fri8am2: 'pass',
        fri8am3: 'pass',
        fri8am4: 'N/A',
        fri8am5: 'N/A',
    },
    {
        id: 8,
        task: 'Fire Extinguisher C02',
        wed12pm: 'pass',
        wed4pm: 'N/A',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'pass',
        fri8am: 'pass',
        fri8am1: 'fail',
        fri8am2: 'pass',
        fri8am3: 'fail',
        fri8am4: 'fail',
        fri8am5: 'pass',
    },
];

function calculateAverageScore() {
    const columnsToCalculate: TaskColumn[] = [
        'wed12pm',
        'wed4pm',
        'wed8pm',
        'thu8am',
        'thu12pm',
        'fri8am',
        'fri8am1',
        'fri8am2',
        'fri8am3',
        'fri8am4',
        'fri8am5',
    ];

    const averages = columnsToCalculate.map((col) => {
        type ColumnKey =
            | 'wed12pm'
            | 'wed4pm'
            | 'wed8pm'
            | 'thu8am'
            | 'thu12pm'
            | 'fri8am'
            | 'fri8am1'
            | 'fri8am2'
            | 'fri8am3'
            | 'fri8am4'
            | 'fri8am5';
        const totalTasks = tasks.length;
        const passCount = tasks.filter((task) => task[col as ColumnKey] === 'pass').length;
        if (passCount === 0) {
            return ' - ';
        }
        return Math.round((passCount / totalTasks) * 100);
    });

    return {
        id: 'average',
        task: 'Average Score',
        wed12pm: averages[0] === ' - ' ? ' N/A ' : `${averages[0]}%`,
        wed4pm: averages[1] === ' - ' ? ' N/A ' : `${averages[1]}%`,
        wed8pm: averages[2] === ' - ' ? ' N/A ' : `${averages[2]}%`,
        thu8am: averages[3] === ' - ' ? ' N/A ' : `${averages[3]}%`,
        thu12pm: averages[4] === ' - ' ? ' N/A ' : `${averages[4]}%`,
        fri8am: averages[5] === ' - ' ? ' N/A ' : `${averages[5]}%`,
        fri8am1: averages[6] === ' - ' ? ' N/A ' : `${averages[6]}%`,
        fri8am2: averages[7] === ' - ' ? ' N/A ' : `${averages[7]}%`,
        fri8am3: averages[8] === ' - ' ? ' N/A ' : `${averages[8]}%`,
        fri8am4: averages[9] === ' - ' ? ' N/A' : `${averages[9]}%`,
        fri8am5: averages[10] === ' - ' ? 'N/A ' : `${averages[10]}%`,
    };
}

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
                fontWeight: 'bold',
                borderRadius: '5px',
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
            {
                label: 'Fire Extinguishers',
                link: '/auditing-single-compliance',
            },
            {
                label: 'Level 0 - East wing',
                link: '/auditing-task-compliance',
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
    const [open, setOpen] = useState(false);
    const handleResetFilters = () => {
        setSelectedselectedSatrtMonth(null);
        setSelectedselectedEndMonth(null);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        setOpen(false);
    };
    const handleRowClick = (params: any) => {
        if (params.id === 'average') {
            setOpen(true);
        }
    };

    return (
        <>
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
                                        color: 'black',
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
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
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

                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginLeft: 'auto',
                        }}
                    >
                        {t('buttons.clear-filter')}
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{ marginTop: '25px' }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                                        marginRight: 1,
                                    }}
                                >
                                    480
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign="left"
                                    sx={{ marginLeft: 1, fontWeight: 'bold' }}
                                >
                                    {t('inspections.all-tasks-completed')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                                        marginRight: 1,
                                    }}
                                >
                                    80%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign="left"
                                    sx={{ marginLeft: 1, fontWeight: 'bold' }}
                                >
                                    {t('inspections.tasks-completed-on-time')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                                        marginRight: 1,
                                    }}
                                >
                                    15%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign="left"
                                    sx={{ marginLeft: 1, fontWeight: 'bold' }}
                                >
                                    {t('inspections.tasks-not-completed')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
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
                                        marginRight: 1,
                                    }}
                                >
                                    480
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign="left"
                                    sx={{ marginLeft: 1, fontWeight: 'bold' }}
                                >
                                    {t('inspections.tasks-not-completed')}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                <Drawer
                    anchor="right"
                    open={open}
                    onClose={() => handleClose}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 575,
                            maxWidth: '100%',
                        },
                    }}
                >
                    <AuditingReportTabs handleClose={handleClose} />
                </Drawer>
            </Box>

            <Box sx={{ height: 400, width: '100%', marginTop: '3%' }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DataGridPro
                        autoHeight
                        rows={rows}
                        columns={columns}
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                marginTop: '5px',
                                marginBottom: '5px',
                            },
                            '& .MuiDataGrid-cell': {
                                marginTop: '5px',
                                marginBottom: '5px',
                            },
                            '& .MuiDataGrid-root': {
                                width: '100%',
                            },
                        }}
                        getRowClassName={(params) =>
                            params.id === 'average' ? 'average-row clickable' : 'non-clickable'
                        }
                        onRowClick={handleRowClick}
                    />
                    <style>
                        {`
      .average-row {
          background-color: #DDDDDD;
          cursor: pointer;
      }
      .non-clickable {
          pointer-events: none;
      }
      .clickable {
          pointer-events: auto;
      }
      `}
                    </style>
                </Box>
            </Box>
        </>
    );
}
