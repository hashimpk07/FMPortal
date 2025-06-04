import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CustomPieChart from './CustomPieChart';
import DashboardLoadingState from './DashboardLoadingState';
import DashboardCard from './DashboardCard';
import { DashboardEmptyState } from './DashboardEmptyState';
import { WorkOrderData } from '../types/dashboardTypes';

interface WorkOrderChartProps {
    title: string;
    emptyMessage: string;
    data: WorkOrderData[];
    isLoading: boolean;
}

/**
 * Reusable component for displaying work orders in a pie chart
 * Used by both WorkOrdersByPriority and WorkOrdersByStatus
 */
function WorkOrderChart({ title, emptyMessage, data, isLoading }: WorkOrderChartProps) {
    const { t } = useTranslation();

    // Calculate total work orders
    const totalWorkOrders = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

    const content = useMemo(() => {
        if (isLoading) return <DashboardLoadingState message={t('common.loading', 'Loading...')} />;
        if (!data?.length || totalWorkOrders === 0)
            return (
                <DashboardEmptyState
                    title={t('dashboard.no-work-orders', 'No Work Orders')}
                    message={emptyMessage}
                    icon="chart"
                />
            );
        return (
            <CustomPieChart
                data={data}
                centerLabel={totalWorkOrders.toString()}
                additionalLabel={t('dashboard.total-work-orders', 'Total work orders')}
            />
        );
    }, [isLoading, data, totalWorkOrders, emptyMessage, t]);

    return (
        <DashboardCard
            title={title}
            isLoading={isLoading}
            loadingComponent={<DashboardLoadingState message={t('common.loading', 'Loading...')} />}
        >
            {content}
        </DashboardCard>
    );
}

export default WorkOrderChart;
