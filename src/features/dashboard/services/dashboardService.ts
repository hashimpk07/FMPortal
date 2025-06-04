import { format } from 'date-fns';
import { useDashboardStore } from '../store/dashboardStore';
import { calculatePercentages, fetchDashboardData, fetchCentres } from './dashboardAPI';
// Import types from dashboardTypes
import {
    DashboardApiResponse,
    ChartData,
    StatusItem,
    PriorityItem,
    WorkOrderData,
} from '../types/dashboardTypes';

// Define the transformation functions directly in this file since mock file was removed
function transformStatusData(data: {
    pending: StatusItem[];
    scheduled: StatusItem[];
    onHold: StatusItem[];
    inProgress: StatusItem[];
}): WorkOrderData[] {
    // Flatten and transform all status groups into a single array
    const allStatuses: WorkOrderData[] = [
        ...Object.entries(data).flatMap(([statusGroup, items]) =>
            items.map((item) => ({
                id: Number(item.id) || 0,
                value: item.count || 0,
                label: item.name || 'Unknown',
                color: getColorForStatus(statusGroup),
            })),
        ),
    ];

    return allStatuses;
}

function transformPriorityData(data: PriorityItem[]): WorkOrderData[] {
    // Transform priority items into WorkOrderData format
    return data.map((item) => ({
        id: Number(item.id) || 0,
        value: item.count || 0,
        label: item.name || 'Unknown Priority',
        color: getColorForPriority(item.name),
    }));
}

// Helper function to get colors for statuses
function getColorForStatus(status: string): string {
    const colors: Record<string, string> = {
        pending: '#FFA500', // Orange
        scheduled: '#4169E1', // Royal Blue
        onHold: '#FF6347', // Tomato
        inProgress: '#228B22', // Forest Green
    };
    return colors[status] || '#CCCCCC';
}

// Helper function to get colors for priorities
function getColorForPriority(priority: string): string {
    const colors: Record<string, string> = {
        high: '#FF0000', // Red
        medium: '#FFA500', // Orange
        low: '#008000', // Green
    };
    return colors[priority.toLowerCase()] || '#CCCCCC';
}

export const DashboardService = {
    // Load centre list
    loadCentres: async () => {
        const { setLoadingCentres, setCentres } = useDashboardStore.getState();

        setLoadingCentres(true);
        try {
            const centres = await fetchCentres();
            setCentres(centres);
        } catch (error) {
            console.error('Error loading centres:', error);
        } finally {
            setLoadingCentres(false);
        }
    },

    // Load all dashboard data from a single API call
    loadDashboardData: async () => {
        const {
            selectedCentreId,
            startDate,
            endDate,
            setLoadingCharts,
            setLoadingPriorityWorkOrders,
            setLoadingStatusWorkOrders,
            setLoadingWorkOrderLists,
            // Setters for data
            setPriorityWorkOrderData,
            setStatusWorkOrderData,
            setWorkOrdersDueToday,
            setWorkOrdersCompletedYesterday,
            setCasesCreatedData,
            setCasesClosedData,
            setWorkOrdersCreatedData,
            setWorkOrdersData,
            setAverageCaseCompletionTimeData,
            setAverageWorkOrderCompletionTimeData,
            // Setters for metrics
            setCasesCreated,
            setCasesClosed,
            setWorkOrdersCreated,
            setWorkOrdersClosed,
            setAverageCaseCompletionTime,
            setAverageWorkOrderCompletionTime,
        } = useDashboardStore.getState();

        // Now we only skip if selectedCentreId is undefined
        if (selectedCentreId === undefined) {
            return;
        }

        // Pass undefined to the API for "All Centers" (0), otherwise pass the actual centre ID
        const centreIdParam = selectedCentreId === 0 ? undefined : selectedCentreId;

        // Set all loading states to true
        setLoadingCharts(true);
        setLoadingPriorityWorkOrders(true);
        setLoadingStatusWorkOrders(true);
        setLoadingWorkOrderLists(true);

        try {
            // Format dates to strings for the API or pass undefined
            const formattedStartDate = startDate
                ? `${format(startDate, 'yyyy-MM-dd')}T00:00:00.000000Z`
                : undefined;
            const formattedEndDate = endDate
                ? `${format(endDate, 'yyyy-MM-dd')}T23:59:59.000000Z`
                : undefined;

            // Fetch all dashboard data in a single call using the new API
            const dashboardData = await fetchDashboardData<DashboardApiResponse>({
                centreId: centreIdParam,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });

            // Set metrics directly from the API response
            const metrics = dashboardData.data.attributes.metrics;
            setCasesCreated(metrics.casesCreated.total);
            setCasesClosed(metrics.casesClosed.total);
            setWorkOrdersCreated(metrics.workOrdersCreated.total);
            setWorkOrdersClosed(metrics.workOrdersClosed.total);
            setAverageCaseCompletionTime(metrics.averageCaseCompletionTime.total);
            setAverageWorkOrderCompletionTime(metrics.averageWorkOrderCompletionTime.total);

            // Process Work Orders by Status
            const statusData = transformStatusData(
                dashboardData.data.attributes.charts.openWorkOrdersByStatus,
            );
            const statusDataWithPercentages = calculatePercentages(statusData);
            setStatusWorkOrderData(statusDataWithPercentages);

            // Process Work Orders by Priority
            const priorityData = transformPriorityData(
                dashboardData.data.attributes.charts.openWorkOrdersByPriority,
            );
            const priorityDataWithPercentages = calculatePercentages(priorityData);
            setPriorityWorkOrderData(priorityDataWithPercentages);

            // Process Work Orders lists
            const workOrdersDueToday = {
                name: 'Work Orders Due Today',
                date: format(new Date(), 'dd MMM yyyy - HH:mm'),
                workOrderData: dashboardData.data.attributes.lists.workOrdersDueToday?.data
                    ? dashboardData.data.attributes.lists.workOrdersDueToday.data.map((item) => ({
                          id: item.id,
                          title: item.title || 'Work Order',
                          status: item.status.id || 1,
                          dueDate: item.dueDate
                              ? format(new Date(item.dueDate), 'dd MMM yyyy - HH:mm')
                              : '',
                          description: `Priority: ${item.priority || 'Unknown'}`,
                      }))
                    : [],
            };
            setWorkOrdersDueToday(workOrdersDueToday);

            const workOrdersCompletedYesterday = {
                name: 'Work Orders Completed Yesterday',
                date: format(new Date(), 'dd MMM yyyy - HH:mm'),
                workOrderData: dashboardData.data.attributes.lists.workOrdersCompletedYesterday
                    ?.data
                    ? dashboardData.data.attributes.lists.workOrdersCompletedYesterday.data.map(
                          (item) => ({
                              id: item.id,
                              title: item.title || 'Work Order',
                              status: item.status.id || 2,
                              dueDate: item.completedDate
                                  ? format(new Date(item.completedDate), 'dd MMM yyyy - HH:mm')
                                  : '',
                              description: `Priority: ${item.priority || 'Unknown'}`,
                          }),
                      )
                    : [],
            };
            setWorkOrdersCompletedYesterday(workOrdersCompletedYesterday);

            // Generate chart data from the actual data using types from DashboardApiResponse
            const createChartDataFromMetrics = (
                metricData:
                    | DashboardApiResponse['data']['attributes']['metrics']['casesCreated']
                    | DashboardApiResponse['data']['attributes']['metrics']['casesClosed']
                    | DashboardApiResponse['data']['attributes']['metrics']['workOrdersCreated']
                    | DashboardApiResponse['data']['attributes']['metrics']['workOrdersClosed'],
            ): ChartData => {
                // Create an array of DataPoint objects with date and value
                const dataPoints = metricData.data.map((item) => ({
                    date: item.date,
                    value: item.value,
                }));

                // Handle null percentageChange
                let progress: string;
                if (metricData.percentageChange === null) {
                    if (
                        typeof metricData.total === 'number' &&
                        typeof metricData.previousTotal === 'number'
                    ) {
                        if (metricData.previousTotal === 0 && metricData.total > 0)
                            progress = '+100%';
                        else if (metricData.previousTotal === 0 && metricData.total < 0)
                            progress = '-100%';
                        else if (metricData.previousTotal === 0 && metricData.total === 0)
                            progress = '0%';
                        else {
                            const change =
                                ((metricData.total - metricData.previousTotal) /
                                    Math.abs(metricData.previousTotal)) *
                                100;
                            progress = `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
                        }
                    } else progress = '+100%';
                } else
                    progress = `${metricData.percentageChange > 0 ? '+' : ''}${metricData.percentageChange}%`;

                return { chartData: dataPoints, progress, caseNumber: metricData.total };
            };

            // Create chart data for time-based metrics using types from DashboardApiResponse
            const createTimeChartDataFromMetrics = (
                metricData:
                    | DashboardApiResponse['data']['attributes']['metrics']['averageCaseCompletionTime']
                    | DashboardApiResponse['data']['attributes']['metrics']['averageWorkOrderCompletionTime'],
            ): ChartData => {
                // Create an array of DataPoint objects with date and value
                const dataPoints = metricData.data.map((item) => {
                    // Ensure item.value is a string before using match
                    const valueStr =
                        typeof item.value === 'string' ? item.value : String(item.value);
                    const match = valueStr.match(/^\d+(\.\d+)?/);
                    const numericValue = match ? parseFloat(match[0]) : 0;
                    return {
                        date: item.date,
                        value: numericValue,
                    };
                });

                // Handle null percentageChange
                let progress: string;
                if (metricData.percentageChange === null) progress = '+100%';
                else
                    progress = `${metricData.percentageChange > 0 ? '+' : ''}${metricData.percentageChange}%`;

                return { chartData: dataPoints, progress, caseValue: metricData.total };
            };

            setCasesCreatedData(createChartDataFromMetrics(metrics.casesCreated));
            setCasesClosedData(createChartDataFromMetrics(metrics.casesClosed));
            setWorkOrdersCreatedData(createChartDataFromMetrics(metrics.workOrdersCreated));
            setWorkOrdersData(createChartDataFromMetrics(metrics.workOrdersClosed));
            setAverageCaseCompletionTimeData(
                createTimeChartDataFromMetrics(metrics.averageCaseCompletionTime),
            );
            setAverageWorkOrderCompletionTimeData(
                createTimeChartDataFromMetrics(metrics.averageWorkOrderCompletionTime),
            );

            // Set metric values
            setCasesCreated(metrics.casesCreated.total);
            setCasesClosed(metrics.casesClosed.total);
            setWorkOrdersCreated(metrics.workOrdersCreated.total);
            setWorkOrdersClosed(metrics.workOrdersClosed.total);
            setAverageCaseCompletionTime(metrics.averageCaseCompletionTime.total);
            setAverageWorkOrderCompletionTime(metrics.averageWorkOrderCompletionTime.total);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            // Set all loading states back to false
            setLoadingCharts(false);
            setLoadingPriorityWorkOrders(false);
            setLoadingStatusWorkOrders(false);
            setLoadingWorkOrderLists(false);
        }
    },

    // Load all dashboard data
    loadAllDashboardData: async () => {
        await DashboardService.loadDashboardData();
    },
};

export default DashboardService;
