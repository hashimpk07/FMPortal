import { useState } from 'react';
import { Typography, Box, Button, Breadcrumbs, Card, Chip, Drawer, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DataGrid } from '@mui/x-data-grid';
import { Close, Check, Remove } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
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
};

type TaskColumn = 'wed12pm' | 'wed4pm' | 'wed8pm' | 'thu8am' | 'thu12pm' | 'fri8am';

const columns = [
    {
        field: 'task',
        headerName: 'Tasks',
        renderHeader: () => <DataGridToolTip text={'Tasks'} />,
        width: 150,
    },
    {
        field: 'wed12pm',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Wed
                        <br />
                        <strong>25/12/2024</strong>
                        <br />
                        <span>12:00 PM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Wed
                    <br />
                    <strong>25/12/2024</strong>
                    <br />
                    <span>12:00 PM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
    {
        field: 'wed4pm',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Wed
                        <br />
                        <strong>25/12/2024</strong>
                        <br />
                        <span>04:00 PM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Wed
                    <br />
                    <strong>25/12/2024</strong>
                    <br />
                    <span>04:00 PM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
    {
        field: 'wed8pm',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Wed
                        <br />
                        <strong>25/12/2024</strong>
                        <br />
                        <span>08:00 PM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Wed
                    <br />
                    <strong>25/12/2024</strong>
                    <br />
                    <span>08:00 PM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
    {
        field: 'thu8am',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Thu
                        <br />
                        <strong>26/12/2024</strong>
                        <br />
                        <span>08:00 AM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Thu
                    <br />
                    <strong>26/12/2024</strong>
                    <br />
                    <span>08:00 AM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
    {
        field: 'thu12pm',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Thu
                        <br />
                        <strong>26/12/2024</strong>
                        <br />
                        <span>12:00 PM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Wed
                    <br />
                    <strong>26/12/2024</strong>
                    <br />
                    <span>12:00 PM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
    {
        field: 'fri8am',
        renderHeader: () => (
            <Tooltip
                title={
                    <div>
                        Fri
                        <br />
                        <strong>27/12/2024</strong>
                        <br />
                        <span>08:00 AM</span>
                    </div>
                }
                arrow
                enterTouchDelay={0}
                disableInteractive
            >
                <div>
                    Fri
                    <br />
                    <strong>27/12/2024</strong>
                    <br />
                    <span>08:00 AM</span>
                </div>
            </Tooltip>
        ),
        width: 100,
        flex: 1,
        renderCell: renderChip,
    },
];

const tasks: Task[] = [
    {
        id: 1,
        task: 'Soap dispensers',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'pass',
        thu8am: 'fail',
        thu12pm: 'fail',
        fri8am: 'fail',
    },
    {
        id: 2,
        task: 'Paper towels',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'pass',
        thu8am: 'fail',
        thu12pm: 'pass',
        fri8am: 'none',
    },
    {
        id: 3,
        task: 'Stalls cleanliness',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'fail',
        thu8am: 'pass',
        thu12pm: 'pass',
        fri8am: 'fail',
    },
    {
        id: 4,
        task: 'Sinks cleanliness',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'fail',
        thu8am: 'pass',
        thu12pm: 'fail',
        fri8am: 'pass',
    },
    {
        id: 5,
        task: 'Floor cleanliness',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'fail',
        fri8am: 'pass',
    },
    {
        id: 6,
        task: 'Mirrors cleanliness',
        wed12pm: 'pass',
        wed4pm: 'none',
        wed8pm: 'pass',
        thu8am: 'pass',
        thu12pm: 'pass',
        fri8am: 'pass',
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
    ];

    const averages = columnsToCalculate.map((col) => {
        type ColumnKey = 'wed12pm' | 'wed4pm' | 'wed8pm' | 'thu8am' | 'thu12pm' | 'fri8am';
        const totalTasks = tasks.length;
        const passCount = tasks.filter((task) => task[col as ColumnKey] === 'pass').length;
        if (passCount === 0) {
            return 'none';
        }
        return Math.round((passCount / totalTasks) * 100);
    });

    return {
        id: 'average',
        task: 'Average Score',
        wed12pm: averages[0] === 'none' ? 'none' : `${averages[0]}%`,
        wed4pm: averages[1] === 'none' ? 'none' : `${averages[1]}%`,
        wed8pm: averages[2] === 'none' ? 'none' : `${averages[2]}%`,
        thu8am: averages[3] === 'none' ? 'none' : `${averages[3]}%`,
        thu12pm: averages[4] === 'none' ? 'none' : `${averages[4]}%`,
        fri8am: averages[5] === 'none' ? 'none' : `${averages[5]}%`,
    };
}

function renderChip(params: any) {
    const value = params.value;
    let chipColor: 'success' | 'error' | 'primary' | 'default' = 'default';
    let backgroundColor: string = '';
    let fontColor: string = '';

    if (value === 'none' || value === 'pass' || value === 'fail') {
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
            case 'none':
                chipColor = 'default';
                backgroundColor = 'rgba(169, 169, 169, 0.2)';
                fontColor = '#98A2B3';
                break;
            default:
                chipColor = value.endsWith('%') ? 'primary' : 'default';
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
                ) : value === 'none' ? (
                    <Remove sx={{ fontSize: 20, color: 'blue', marginTop: '20px' }} />
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
                width: '80%',
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
                label: 'Inspections',
                link: '/uditing-property-inspections',
            },
            {
                label: 'Bathrooms',
                link: '/auditing-single-inspections',
            },
            {
                label: 'Level 0 - East wing',
                link: '/auditing-task-inspections',
            },
        ],
    },
];

export default function AuditingInspectionTask() {
    const { t } = useTranslation();
    const averageScoreRow = calculateAverageScore();
    const rows = [averageScoreRow, ...tasks];
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date('2024-12-25'),
        new Date('2024-12-31'),
    ]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
        setDateRange(newValue);
    };
    const handleResetFilters = () => {
        setDateRange([null, null]);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleRowClick = (params: any) => {
        if (params.id === 'average') {
            setOpen(true);
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
            <Grid container spacing={2}>
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
                <Grid size={{ xs: 12, sm: 7 }}>
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
                                }}
                            >
                                15%
                            </Typography>
                            <Typography
                                variant="body2"
                                textAlign="left"
                                sx={{ marginLeft: 1, fontWeight: 'bold' }}
                            >
                                {t('inspections.tasks-completed-late')}
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
            </Grid>

            <Box sx={{ height: 400, width: '100%', marginTop: '3%' }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DataGrid
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
                        }}
                        getRowClassName={(params: any) =>
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
    );
}
