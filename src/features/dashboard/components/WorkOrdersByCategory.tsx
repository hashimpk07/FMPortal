import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../store/dashboardStore';
import WorkOrderChart from './WorkOrderChart';

export default function WorkOrdersByCategory({ category }: WorkOrdersByCategoryProps) {
    const { t } = useTranslation();
    const {
        priorityWorkOrderData,
        isLoadingPriorityWorkOrders,
        statusWorkOrderData,
        isLoadingStatusWorkOrders,
    } = useDashboardStore();

    const config =
        category === 'priority'
            ? {
                  title: t('dashboard.work-orders-by-priority', 'Work Orders by priority'),
                  emptyMessage: t(
                      'dashboard.no-work-orders-by-priority',
                      'No work orders to display by priority',
                  ),
                  data: priorityWorkOrderData,
                  isLoading: isLoadingPriorityWorkOrders,
              }
            : {
                  title: t('dashboard.work-orders-by-status', 'Work Orders by status'),
                  emptyMessage: t(
                      'dashboard.no-work-orders-by-status',
                      'No work orders to display by status',
                  ),
                  data: statusWorkOrderData,
                  isLoading: isLoadingStatusWorkOrders,
              };

    return (
        <WorkOrderChart
            title={config.title}
            emptyMessage={config.emptyMessage}
            data={config.data}
            isLoading={config.isLoading}
        />
    );
}

interface WorkOrdersByCategoryProps {
    category: 'priority' | 'status';
}
