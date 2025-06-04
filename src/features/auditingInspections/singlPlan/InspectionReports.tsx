import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Chip, Breadcrumbs, Card } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Grid from '@mui/material/Grid2';

import { Link, useNavigate } from 'react-router-dom';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DataGridToolTip from '../../../components/common/DataGridToolTip';

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
    const navigate = useNavigate();

    const RenderScoreCell = ({ score }: { score: string }) => {
        if (!score) return <Chip label="N/A" color="default" />;

        const scoreValue = parseFloat(score.replace('%', '') || '0');
        let chipColor = '';

        if (scoreValue >= 90) chipColor = 'green';
        else if (scoreValue >= 70) chipColor = 'orange';
        else if (scoreValue >= 50) chipColor = 'purple';
        else chipColor = 'red';

        return (
            <Chip
                label={score}
                sx={{
                    backgroundColor:
                        chipColor === 'green'
                            ? 'rgba(144, 238, 144, 0.1)'
                            : chipColor === 'orange'
                              ? 'rgba(255, 165, 0, 0.1)'
                              : chipColor === 'purple'
                                ? 'rgba(128, 0, 128, 0.1)'
                                : 'rgba(255, 99, 71, 0.1)',
                    color: chipColor,
                    padding: '4px 8px',
                    fontWeight: 'bold',
                    borderRadius: '7px',
                }}
            />
        );
    };

    const columns = [
        {
            field: 'plan',
            headerName: 'Plan',
            renderHeader: () => <DataGridToolTip text={'Plan'} />,
            width: 180,
        },
        {
            field: '25/12/2024',
            headerName: '25/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'25/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '26/12/2024',
            headerName: '26/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'26/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '27/12/2024',
            headerName: '27/12/2024',
            renderHeader: () => <DataGridToolTip text={'27/12/2024'} />,
            width: 100,
            flex: 1,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '28/12/2024',
            headerName: '28/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'28/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '29/12/2024',
            headerName: '29/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'29/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '30/12/2024',
            headerName: '30/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'30/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: '31/12/2024',
            headerName: '31/12/2024',
            width: 100,
            flex: 1,
            renderHeader: () => <DataGridToolTip text={'31/12/2024'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
    ];

    const rows = [
        {
            id: 1,
            plan: 'Average score',
            '25/12/2024': '95%',
            '26/12/2024': '98%',
            '27/12/2024': '94%',
            '28/12/2024': '92%',
            '29/12/2024': '88%',
            '30/12/2024': '98%',
            '31/12/2024': '98%',
        },
        {
            id: 2,
            plan: 'Level 0 - East wing',
            '25/12/2024': '100%',
            '26/12/2024': '75%',
            '27/12/2024': '78%',
            '28/12/2024': '68%',
            '29/12/2024': '85%',
            '30/12/2024': '45%',
            '31/12/2024': '61%',
        },
        {
            id: 3,
            plan: 'Level 0 - West wing',
            '25/12/2024': '18%',
            '26/12/2024': '72%',
            '27/12/2024': '65%',
            '28/12/2024': '75%',
            '29/12/2024': '85%',
            '30/12/2024': '98%',
            '31/12/2024': '77%',
        },
        {
            id: 4,
            plan: 'Level 1 - East wing',
            '25/12/2024': '18%',
            '26/12/2024': '25%',
            '27/12/2024': '30%',
            '28/12/2024': '10%',
            '29/12/2024': '65%',
            '30/12/2024': '98%',
            '31/12/2024': '100%',
        },
        {
            id: 5,
            plan: 'Level 1 - West wing',
            '25/12/2024': '78%',
            '26/12/2024': '80%',
            '27/12/2024': '75%',
            '28/12/2024': '55%',
            '29/12/2024': '65%',
            '30/12/2024': '98%',
            '31/12/2024': '36%',
        },
    ];

    const taskBreadcrumbVariants: TaskGranularBreadcrumbVariant[] = [
        {
            separator: '›',
            breadcrumbs: [
                { label: 'Westwood Cross', link: '/' },
                {
                    label: 'Inspections',
                    link: '/auditing-property-inspections',
                },
                {
                    label: 'Bathrooms',
                    link: '/auditing-single-inspections',
                },
            ],
        },
    ];

    const handleDateRangeChange = (newValue: [Date | null, Date | null]) => {
        setDateRange(newValue);
    };

    const handleResetFilters = () => {
        setDateRange([null, null]);
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

            {taskBreadcrumbVariants.map((data, index) => (
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
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                    {' '}
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
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card
                        elevation={1}
                        sx={{
                            display: 'flex',
                            padding: 2,
                            borderRadius: 2,
                            border: '1px solid #E0E0E0',
                            width: '93%',
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
                                97%
                            </Typography>
                            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: 'bold' }}>
                                {t('inspections.avarage-score-of-tasks')}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Card
                        elevation={1}
                        sx={{
                            display: 'flex',
                            padding: 2,
                            borderRadius: 2,
                            border: '1px solid #E0E0E0',
                            width: '93%',
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
                                {t('inspections.overall-completion')}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Box
                sx={{
                    width: '100%',
                    marginTop: '25px',
                    backgroundColor: 'white',
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.row.plan === 'Average score' ? 'average-score-row' : ''
                    }
                    sx={{
                        '& .MuiDataGrid-row': {
                            backgroundColor: 'transparent',
                        },
                        '& .average-score-row': {
                            backgroundColor: '#f1f1f1',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default InspectionReports;
