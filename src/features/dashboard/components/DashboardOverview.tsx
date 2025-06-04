import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import CaseCard, { MetricType } from './CaseCard';
import DashboardLoadingState from './DashboardLoadingState';
import DashboardCard from './DashboardCard';
import DateRangePickerWithShortcuts from '../../../components/common/DateRangePickerWithShortcuts';
import { DashboardService } from '../services/dashboardService';
import useDashboardStore from '../store/dashboardStore';

/**
 * Parses a completion time string to extract the numeric value
 */
function parseCompletionTime(
    timeStr: string | { total: string; data: Array<{ date: string; value: string }> },
): number {
    if (typeof timeStr === 'string') {
        const match = timeStr.match(/^(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    if (timeStr && typeof timeStr === 'object' && 'total' in timeStr) {
        const match = timeStr.total.match(/^(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    return 0;
}

/**
 * Displays an overview of dashboard metrics with date range filtering
 */
function DashboardOverview() {
    const { t } = useTranslation();
    const {
        startDate,
        endDate,
        setDateRange,
        // Chart data
        casesCreatedData,
        casesClosedData,
        workOrdersCreatedData,
        workOrdersData,
        averageCaseCompletionTimeData,
        averageWorkOrderCompletionTimeData,
        // Loading state
        isLoadingCharts,
        // Metrics from the store
        casesCreated,
        casesClosed,
        workOrdersCreated,
        workOrdersClosed,
        averageCaseCompletionTime,
        averageWorkOrderCompletionTime,
    } = useDashboardStore();

    // Track whether dates have been accepted
    const [datesAccepted, setDatesAccepted] = useState(false);

    // Trigger data fetching when both dates are selected AND accepted
    useEffect(() => {
        if (startDate && endDate && datesAccepted) {
            DashboardService.loadDashboardData();
            // Reset acceptance flag after fetching data
            setDatesAccepted(false);
        }
    }, [startDate, endDate, datesAccepted]);

    // Handler for date range changes
    const handleDateRangeChange = useCallback(
        (newStartDate: Date | null, newEndDate: Date | null) => {
            // The DateRangePickerWithShortcuts component now handles the proper formatting
            // with T00:00:00.000000Z for start dates and T23:59:59.000000Z for end dates
            setDateRange(newStartDate, newEndDate);
        },
        [setDateRange],
    );

    // Handle date acceptance (when user clicks Accept/OK in the picker)
    const handleDateRangeAccept = useCallback(() => {
        if (startDate && endDate) {
            setDatesAccepted(true);
        }
    }, [startDate, endDate]);

    // Create date range picker for the header
    const dateRangePicker = useMemo(
        () => (
            <DateRangePickerWithShortcuts
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={handleDateRangeChange}
                onAccept={handleDateRangeAccept}
                maxPastMonths={6}
                skipAutoInit={false}
                width="240px"
            />
        ),
        [startDate, endDate, handleDateRangeChange, handleDateRangeAccept],
    );

    // Define all cards with their data
    interface CardData {
        id: string;
        title: string;
        caseNumber: number | null;
        caseValue?: string;
        progress: string;
        chartData: any[];
        xLabels: string[];
        metricType: MetricType;
    }

    const cardsData = useMemo<CardData[]>(
        () => [
            // First row
            {
                id: 'cases-created',
                title: t('dashboard.cases-created'),
                caseNumber: casesCreated,
                progress: casesCreatedData?.progress || '---',
                chartData: casesCreatedData?.chartData || [],
                xLabels: casesCreatedData?.xLabels || [],
                metricType: 'casesCreated' as MetricType,
            },
            {
                id: 'cases-closed',
                title: t('dashboard.cases-closed'),
                caseNumber: casesClosed,
                progress: casesClosedData?.progress || '---',
                chartData: casesClosedData?.chartData || [],
                xLabels: casesClosedData?.xLabels || [],
                metricType: 'casesClosed' as MetricType,
            },
            {
                id: 'work-orders-created',
                title: t('dashboard.work-orders-created'),
                caseNumber: workOrdersCreated,
                progress: workOrdersCreatedData?.progress || '---',
                chartData: workOrdersCreatedData?.chartData || [],
                xLabels: workOrdersCreatedData?.xLabels || [],
                metricType: 'workOrdersCreated' as MetricType,
            },
            // Second row
            {
                id: 'work-orders-closed',
                title: t('dashboard.work-orders-closed'),
                caseNumber: workOrdersClosed,
                progress: workOrdersData?.progress || '---',
                chartData: workOrdersData?.chartData || [],
                xLabels: workOrdersData?.xLabels || [],
                metricType: 'workOrdersClosed' as MetricType,
            },
            {
                id: 'average-case-completion-time',
                title: t('dashboard.average-case-completion-time'),
                caseNumber: averageCaseCompletionTime
                    ? parseCompletionTime(averageCaseCompletionTime)
                    : null,
                caseValue: 'Days',
                progress: averageCaseCompletionTimeData?.progress || '---',
                chartData: averageCaseCompletionTimeData?.chartData || [],
                xLabels: averageCaseCompletionTimeData?.xLabels || [],
                metricType: 'averageCaseCompletionTime' as MetricType,
            },
            {
                id: 'average-work-order-completion-time',
                title: t('dashboard.average-work-order-completion-time'),
                caseNumber: averageWorkOrderCompletionTime
                    ? parseCompletionTime(averageWorkOrderCompletionTime)
                    : null,
                caseValue: 'Days',
                progress: averageWorkOrderCompletionTimeData?.progress || '---',
                chartData: averageWorkOrderCompletionTimeData?.chartData || [],
                xLabels: averageWorkOrderCompletionTimeData?.xLabels || [],
                metricType: 'averageWorkOrderCompletionTime' as MetricType,
            },
        ],
        [
            t,
            casesCreated,
            casesCreatedData,
            casesClosed,
            casesClosedData,
            workOrdersCreated,
            workOrdersCreatedData,
            workOrdersClosed,
            workOrdersData,
            averageCaseCompletionTime,
            averageCaseCompletionTimeData,
            averageWorkOrderCompletionTime,
            averageWorkOrderCompletionTimeData,
        ],
    );

    // Split cards into rows (first 3 for top row, next 3 for bottom row)
    const topRowCards = cardsData.slice(0, 3);
    const bottomRowCards = cardsData.slice(3, 6);

    return (
        <DashboardCard
            title={t('dashboard.overview', 'Overview')}
            headerAction={dateRangePicker}
            isLoading={isLoadingCharts}
            loadingComponent={<DashboardLoadingState message={t('common.loading', 'Loading...')} />}
            sx={{ boxShadow: 'inset 0 0 0 1 rgba(0, 0, 0, 0.1)' }}
        >
            <Box sx={{ width: '100%' }}>
                {/* Top Row */}
                <Grid container>
                    {topRowCards.map((card) => (
                        <Grid item xs={12} md={4} key={card.id}>
                            <CaseCard
                                title={card.title}
                                caseNumber={card.caseNumber}
                                caseValue={card.caseValue}
                                progress={card.progress}
                                chartData={card.chartData}
                                xLabels={card.xLabels}
                                isLoading={isLoadingCharts}
                                hideViewMore={true}
                                boxStyle={{ height: '100%', width: '100%' }}
                                metricType={card.metricType}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom Row */}
                <Grid container>
                    {bottomRowCards.map((card) => (
                        <Grid item xs={12} md={4} key={card.id}>
                            <CaseCard
                                title={card.title}
                                caseNumber={card.caseNumber}
                                caseValue={card.caseValue}
                                progress={card.progress}
                                chartData={card.chartData}
                                xLabels={card.xLabels}
                                isLoading={isLoadingCharts}
                                hideViewMore={true}
                                boxStyle={{ height: '100%', width: '100%' }}
                                metricType={card.metricType}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </DashboardCard>
    );
}

export default DashboardOverview;
