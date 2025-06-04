import { useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../store/dashboardStore';
import DashboardLoadingState from './DashboardLoadingState';
import EmptyWorkOrdersList from './EmptyWorkOrdersList';
import WorkOrderListCard from './WorkOrderListCard';
import { WorkOrderList as WorkOrderListType } from '../types/dashboardTypes';

interface WorkOrderListProps {
    data: WorkOrderListType | null;
    isLoading: boolean;
    emptyTitle: string;
    emptyMessage: string;
}

/**
 * Reusable component for displaying a work order list with loading/empty states
 */
export function WorkOrderList({ data, isLoading, emptyTitle, emptyMessage }: WorkOrderListProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return <DashboardLoadingState message={t('common.loading', 'Loading...')} />;
    }

    if (!data || !data.workOrderData?.length) {
        return <EmptyWorkOrdersList title={emptyTitle} message={emptyMessage} />;
    }

    return <WorkOrderListCard data={data} />;
}

/**
 * Displays work orders lists section with due today and completed yesterday data
 */
function WorkOrdersLists() {
    const { t } = useTranslation();
    const { workOrdersDueToday, workOrdersCompletedYesterday, isLoadingWorkOrderLists } =
        useDashboardStore();

    // Due today props
    const dueTodayProps = useMemo(
        () => ({
            data: workOrdersDueToday,
            isLoading: isLoadingWorkOrderLists,
            emptyTitle: t('dashboard.due-today', 'Work Orders Due Today'),
            emptyMessage: t('common.no-data', 'No work orders due today'),
        }),
        [workOrdersDueToday, isLoadingWorkOrderLists, t],
    );

    // Completed yesterday props
    const completedYesterdayProps = useMemo(
        () => ({
            data: workOrdersCompletedYesterday,
            isLoading: isLoadingWorkOrderLists,
            emptyTitle: t('dashboard.completed-yesterday', 'Work Orders Completed Yesterday'),
            emptyMessage: t('common.no-data', 'No work orders completed yesterday'),
        }),
        [workOrdersCompletedYesterday, isLoadingWorkOrderLists, t],
    );

    return (
        <Grid container spacing={6} sx={{ marginTop: '6%', alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <WorkOrderList {...dueTodayProps} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <WorkOrderList {...completedYesterdayProps} />
            </Grid>
        </Grid>
    );
}

export default WorkOrdersLists;
