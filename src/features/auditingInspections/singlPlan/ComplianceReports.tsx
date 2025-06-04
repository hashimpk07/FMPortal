import React, { useState } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

import { Box, Button, Typography, Chip, Breadcrumbs, Card } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Grid from '@mui/material/Grid2';
import { Remove } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataGridToolTip from '../../../components/common/DataGridToolTip';

interface Breadcrumb {
    label: string;
    link: string;
}

interface TaskGranularBreadcrumbVariant {
    separator: string;
    breadcrumbs: Breadcrumb[];
}

const ComplianceReports: React.FC = () => {
    const { t } = useTranslation();
    const [selectedSatrtMonth, setSelectedselectedSatrtMonth] = useState<Date | null>(
        new Date(2024, 2, 25),
    );
    const [selectedEndMonth, setSelectedselectedEndMonth] = useState<Date | null>(
        new Date(2024, 11, 31),
    );
    const navigate = useNavigate();
    const columns = [
        {
            field: 'plan',
            headerName: 'Plan',
            renderHeader: () => <DataGridToolTip text={'Plan'} />,
            width: 180,
        },
        {
            field: 'mar',
            headerName: 'Mar',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Mar'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'apr',
            headerName: 'Apr',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Apr'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'may',
            headerName: 'May',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'May'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'jun',
            headerName: 'Jun',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Jun'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'jul',
            headerName: 'Jul',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Jul'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'aug',
            headerName: 'Aug',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Aug'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'sep',
            headerName: 'Sep',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Sep'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'oct',
            headerName: 'Oct',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Oct'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'nov',
            headerName: 'Nov',
            flex: 1,
            width: 100,
            renderHeader: () => <DataGridToolTip text={'Nov'} />,
            renderCell: (params: any) => {
                const score = params.value as string;
                return <RenderScoreCell score={score} />;
            },
        },
        {
            field: 'dec',
            headerName: 'Dec',
            flex: 1,
            minWidth: 100,
            renderHeader: () => <DataGridToolTip text={'Dec'} />,
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
            mar: '75%',
            apr: '80%',
            may: '62%',
            jun: '55%',
            jul: '65%',
            aug: '98%',
            sep: '77%',
            oct: '56%',
            nov: '85%',
            dec: '75%',
        },
        {
            id: 2,
            plan: 'Level 0',
            mar: '72%',
            apr: 'N/A',
            may: '62%',
            jun: '55%',
            jul: '65%',
            aug: '98%',
            sep: '77%',
            oct: '56%',
            nov: '85%',
            dec: '75%',
        },
        {
            id: 3,
            plan: 'Level 1',
            mar: '78%',
            apr: '80%',
            may: 'N/A',
            jun: '55%',
            jul: '65%',
            aug: '98%',
            sep: '77%',
            oct: '56%',
            nov: '85%',
            dec: '75%',
        },
    ];

    const taskGranularBreadcrumbVariants: TaskGranularBreadcrumbVariant[] = [
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
            ],
        },
    ];

    const RenderScoreCell = ({ score }: { score: string }) => {
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
                    padding: '1px 2px',
                    fontWeight: 'bold',
                    borderRadius: '7px',
                }}
            />
        );
    };

    const handleResetFilters = () => {
        setSelectedselectedSatrtMonth(null);
        setSelectedselectedEndMonth(null);
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

            <Grid container spacing={2} sx={{ marginTop: '3%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                            width: '95%',
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
            <Grid container spacing={2} sx={{ marginTop: '25px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '25px',
                    }}
                >
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('common.start-month')}
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
                                    label={t('common.end-month')}
                                    value={selectedEndMonth}
                                    onChange={(newValue) => setSelectedselectedEndMonth(newValue)}
                                    views={['year', 'month']}
                                />
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
                        </Button>{' '}
                    </Grid>
                </Box>
            </Grid>

            <Box sx={{ height: 400, width: '100%', marginTop: '3%' }}>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DataGridPro
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
        </Box>
    );
};

export default ComplianceReports;
