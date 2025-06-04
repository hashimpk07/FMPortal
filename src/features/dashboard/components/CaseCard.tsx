import Grid from '@mui/material/Grid2';
import styled from '@emotion/styled';
import React from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardEmptyState } from './DashboardEmptyState';
import CustomLineChart from './CustomLineChart';
// import CaseCard from './CaseCard'
import { DataPoint } from '../types/dashboardTypes';
import DetailedChartModal from './DetailedChartModal';

// Define metric types for better type safety
export type MetricType =
    | 'casesCreated'
    | 'casesClosed'
    | 'workOrdersCreated'
    | 'workOrdersClosed'
    | 'averageCaseCompletionTime'
    | 'averageWorkOrderCompletionTime'
    | 'other';

// Types
interface CaseCardProps {
    title?: string;
    caseNumber?: number | null;
    caseValue?: string;
    progress?: string;
    chartData: number[] | DataPoint[];
    xLabels?: string[];
    boxStyle?: React.CSSProperties;
    strokeColor?: 'green' | 'red' | 'blue';
    isLoading?: boolean;
    hideViewMore?: boolean;
    currentValue?: number;
    previousValue?: number;
    metricType?: MetricType; // New prop to identify the metric type directly
}

// Constants
const COLORS = {
    green: {
        backgroundColor: '#EDFBF3',
        color: '#4FBE86',
        chartColor: '#4FBE86',
    },
    red: {
        backgroundColor: '#FDEEEF',
        color: '#E8575F',
        chartColor: '#E8575F',
    },
} as const;

// Time-based metric types for direct checking
const TIME_BASED_METRICS: MetricType[] = [
    'averageCaseCompletionTime',
    'averageWorkOrderCompletionTime',
];

const CardContainer = styled(Grid)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    padding: 48,
    boxShadow: 'inset 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    boxSizing: 'border-box',
});

const Title = styled(Typography)({
    fontSize: 16,
    fontWeight: 500,
    color: '#333',
    marginBottom: 8,
});

const CaseNumber = styled(Typography)({
    fontSize: 28,
    fontWeight: 600,
    color: '#333',
});

const CaseValue = styled('span')({
    fontWeight: 'normal',
    fontSize: 16,
    marginLeft: 3,
    color: '#666',
});

const ProgressBtn = styled(Button)<{ bgcolor: string; btncolor: string }>(
    ({ bgcolor, btncolor }) => ({
        height: 28,
        borderRadius: 100,
        border: 'none',
        boxShadow: 'none',
        fontSize: 13,
        fontWeight: 500,
        padding: '4px 8px',
        textTransform: 'none',
        background: bgcolor,
        color: btncolor,
        '&:hover': {
            background: bgcolor,
            boxShadow: 'none',
        },
    }),
);

const ViewMoreBtn = styled(Button)({
    height: 28,
    padding: '4px 12px',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 100,
    textTransform: 'none',
    color: '#2E7DF7',
    background: '#ECF4FC',
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
        background: '#ECF4FC',
        boxShadow: 'none',
    },
});

// Components
function ProgressButton({
    progress,
    isPositive,
    colors,
}: {
    progress: string;
    isPositive: boolean;
    colors: (typeof COLORS)[keyof typeof COLORS];
}) {
    return (
        <ProgressBtn
            bgcolor={colors.backgroundColor}
            btncolor={colors.color}
            variant="contained"
            size="small"
            startIcon={
                isPositive ? (
                    <ArrowUpwardIcon fontSize="small" />
                ) : (
                    <ArrowDownwardIcon fontSize="small" />
                )
            }
        >
            {progress}
        </ProgressBtn>
    );
}

function CaseCard({
    title,
    caseNumber,
    caseValue,
    progress,
    chartData,
    xLabels,
    boxStyle,
    isLoading = false,
    hideViewMore = false,
    currentValue,
    previousValue,
    metricType = 'other',
}: CaseCardProps) {
    // Calculate progress if it's null but we have current and previous values
    let progressValue = progress ? parseInt(progress, 10) : 0;
    let progressText = progress;

    if (
        progress === null &&
        currentValue !== undefined &&
        previousValue !== undefined &&
        previousValue !== 0
    ) {
        const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        progressValue = change;
        progressText = `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
    } else if (progress === null && currentValue !== undefined && previousValue !== undefined) {
        // Handle division by zero case
        if (previousValue === 0 && currentValue > 0) {
            progressValue = 100;
            progressText = '+100%';
        } else if (previousValue === 0 && currentValue < 0) {
            progressValue = -100;
            progressText = '-100%';
        } else if (previousValue === 0 && currentValue === 0) {
            progressValue = 0;
            progressText = '0%';
        }
    }

    const isPositive = progressValue >= 0;
    const colors = COLORS[isPositive ? 'green' : 'red'];
    const navigate = useNavigate();
    const { t } = useTranslation();
    const hasData =
        Array.isArray(chartData) &&
        chartData.length > 0 &&
        (Array.isArray(chartData) && typeof chartData[0] === 'number'
            ? (chartData as number[]).some((value) => value !== 0 && value != null)
            : (chartData as DataPoint[]).some((point) => point.value !== 0 && point.value != null));
    const hasEnoughDataPointsForChart = Array.isArray(chartData) && chartData.length >= 3;
    const handleRedirect = () => navigate('/cases-and-work-orders');
    const [modalOpen, setModalOpen] = React.useState(false);

    // Check if data represents time values directly from the metric type
    const isTimeData = TIME_BASED_METRICS.includes(metricType);

    // Determine appropriate label
    const valueLabel = isTimeData ? 'Time' : 'Cases';

    if (isLoading)
        return (
            <CardContainer style={boxStyle}>
                <Title variant="h6">{title || t('cases.case-created')}</Title>
                <CircularProgress size={40} />
            </CardContainer>
        );

    if (!hasData)
        return (
            <CardContainer style={boxStyle}>
                <Title variant="h6">{title || t('cases.case-created', 'Case created')}</Title>
                <Grid
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <DashboardEmptyState
                        title={t('dashboard.no-data', 'No Data')}
                        message=""
                        icon="chart"
                    />
                </Grid>
            </CardContainer>
        );

    return (
        <CardContainer style={boxStyle}>
            <Title variant="h6">{title || t('cases.case-created')}</Title>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                bgcolor="transparent"
            >
                <Grid>
                    <CaseNumber variant="h4">
                        {caseNumber !== undefined && caseNumber !== null ? caseNumber : '-'}
                        {caseValue && <CaseValue>{caseValue}</CaseValue>}
                    </CaseNumber>
                </Grid>
                {progressText && (
                    <Grid>
                        <ProgressButton
                            progress={progressText}
                            isPositive={isPositive}
                            colors={colors}
                        />
                    </Grid>
                )}
            </Grid>
            <Grid sx={{ flex: 1, width: '100%', minHeight: 50, alignContent: 'center' }}>
                {hasEnoughDataPointsForChart ? (
                    <button
                        style={{
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            display: 'block',
                        }}
                        onClick={() => setModalOpen(true)}
                        aria-label={`Open detailed chart for ${title || 'data'}`}
                    >
                        <CustomLineChart
                            data={chartData}
                            labels={xLabels}
                            strokeColor={colors.chartColor}
                            markColor={colors.chartColor}
                            curve="monotoneX"
                            onClick={() => setModalOpen(true)}
                            title={title}
                        />
                    </button>
                ) : (
                    <Grid
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            {t('dashboard.not-enough-chart-data', 'Not enough chart data')}
                        </Typography>
                    </Grid>
                )}
            </Grid>
            {!hideViewMore && (
                <Grid
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        mt: 'auto',
                        pt: 1,
                    }}
                >
                    <ViewMoreBtn
                        variant="contained"
                        endIcon={<ArrowRightAltIcon fontSize="small" />}
                        onClick={handleRedirect}
                    >
                        {t('buttons.view-more', 'View more')}
                    </ViewMoreBtn>
                </Grid>
            )}
            <DetailedChartModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                data={chartData}
                labels={xLabels}
                title={title}
                strokeColor={colors.chartColor}
                isTimeData={isTimeData}
                valueLabel={valueLabel}
                metricType={metricType}
            />
        </CardContainer>
    );
}

export default CaseCard;
