import { format } from 'date-fns';
import HTTP from '../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../constants/api';
import {
    DashboardParams,
    Centre,
    WorkOrderData,
    WorkOrderList,
    ChartData,
    StatusItem,
    PriorityItem,
} from '../types/dashboardTypes';
import fetchCentresList from '../../../services/centres';

// Helper functions for transformation
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

// Helper function to format dates for the API
const formatDateForApi = (
    date: Date | string | null | undefined,
    isEndDate = false,
): string | undefined => {
    if (!date) return undefined;

    if (typeof date === 'string') {
        return date;
    }

    // Format start dates with midnight time and end dates with end of day time
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (isEndDate) {
        // End date with T23:59:59.000000Z
        return `${formattedDate}T23:59:59.000000Z`;
    }
    // Start date with T00:00:00.000000Z
    return `${formattedDate}T00:00:00.000000Z`;
};

/**
 * Fetch all dashboard data from the API
 * @param params Parameters to filter the dashboard data
 * @returns Promise with the dashboard data
 */
export const fetchDashboardData = async <T>(params: DashboardParams): Promise<T> => {
    try {
        // Build filter parameters
        const filterParams: Record<string, string> = {};

        if (params.centreId) {
            filterParams['filter[centreId]'] = params.centreId.toString();
        }

        if (params.startDate) {
            filterParams['filter[from]'] = formatDateForApi(params.startDate, false) as string;
        }

        if (params.endDate) {
            filterParams['filter[to]'] = formatDateForApi(params.endDate, true) as string;
        }

        const queryString = new URLSearchParams(filterParams).toString();

        const response = await HTTP({
            url: `${API_BASE_URL}/${API_VERSION}/tickets/dashboard${queryString ? `?${queryString}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        if (response.data?.data?.attributes?.data) {
            const transformedData = {
                data: {
                    ...response.data.data,
                    attributes: response.data.data.attributes.data,
                },
            };
            return transformedData as unknown as T;
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

/**
 * Helper function to calculate percentages for pie chart data
 */
export const calculatePercentages = (data: WorkOrderData[]): WorkOrderData[] => {
    if (data.length) {
        const sumValues = data.reduce((sum: number, item: any) => sum + item.value, 0);

        return data.map((item) => {
            const percentage = Number(((item.value / sumValues) * 100).toFixed(1));
            return {
                ...item,
                percentage,
            };
        });
    }
    return [];
};

// Get centres list
export const fetchCentres = async (): Promise<Centre[]> => {
    try {
        const response = await fetchCentresList();
        if (Array.isArray(response.data)) {
            const transformedData: Centre[] = response.data.map((item: any) => ({
                id: Number(item.id),
                name: item.attributes.name,
            }));
            sessionStorage.setItem('centres', JSON.stringify(response));
            return transformedData;
        }

        console.error("Response data 'data' is not an array", response.data);
        return [];
    } catch (error) {
        console.error('Error fetching centres:', error);
        throw error;
    }
};

// Get priority work orders data
export const fetchPriorityWorkOrders = async (centreId?: number): Promise<WorkOrderData[]> => {
    try {
        const dashboardData = await fetchDashboardData<any>({ centreId });

        if (dashboardData?.data?.attributes?.charts?.openWorkOrdersByPriority) {
            return transformPriorityData(
                dashboardData.data.attributes.charts.openWorkOrdersByPriority,
            );
        }

        return [];
    } catch (error) {
        console.error('Error fetching priority work orders:', error);
        return [];
    }
};

// Get status work orders data
export const fetchStatusWorkOrders = async (centreId?: number): Promise<WorkOrderData[]> => {
    try {
        const dashboardData = await fetchDashboardData<any>({ centreId });

        if (dashboardData?.data?.attributes?.charts?.openWorkOrdersByStatus) {
            return transformStatusData(dashboardData.data.attributes.charts.openWorkOrdersByStatus);
        }

        return [];
    } catch (error) {
        console.error('Error fetching status work orders:', error);
        return [];
    }
};

// Get work orders due today
export const fetchWorkOrdersDueToday = async (centreId?: number): Promise<WorkOrderList> => {
    try {
        // Use the fetchDashboardData function with the appropriate parameters
        const dashboardData = await fetchDashboardData<any>({ centreId });

        if (dashboardData?.data?.attributes?.lists?.workOrdersDueToday) {
            if (Array.isArray(dashboardData.data.attributes.lists.workOrdersDueToday)) {
                const workOrders = dashboardData.data.attributes.lists.workOrdersDueToday.map(
                    (item: any) => ({
                        id: item.id,
                        title: item.title || 'Work Order',
                        status: 1, // Default status
                        dueDate: item.dueDate || '',
                        description: item.description || `Work order due today`, // Generate description
                    }),
                );

                return {
                    name: 'Work Orders Due Today',
                    date: new Date().toISOString(),
                    workOrderData: workOrders,
                };
            }
        }

        // If no data or not an array
        return {
            name: 'Work Orders Due Today',
            date: new Date().toISOString(),
            workOrderData: [],
        };
    } catch (error) {
        console.error('Error fetching work orders due today:', error);
        return {
            name: 'Work Orders Due Today',
            date: new Date().toISOString(),
            workOrderData: [],
        };
    }
};

// Get work orders completed yesterday
export const fetchWorkOrdersCompletedYesterday = async (
    centreId?: number,
): Promise<WorkOrderList> => {
    try {
        const dashboardData = await fetchDashboardData<any>({ centreId });

        if (dashboardData?.data?.attributes?.lists?.workOrdersCompletedYesterday) {
            if (Array.isArray(dashboardData.data.attributes.lists.workOrdersCompletedYesterday)) {
                const workOrders =
                    dashboardData.data.attributes.lists.workOrdersCompletedYesterday.map(
                        (item: any) => ({
                            id: item.id,
                            title: item.title || 'Work Order',
                            status: 2, // Completed status
                            dueDate: item.completedDate || '',
                            description: item.description || `Work order completed yesterday`, // Generate description
                        }),
                    );

                return {
                    name: 'Work Orders Completed Yesterday',
                    date: new Date().toISOString(),
                    workOrderData: workOrders,
                };
            }
        }

        // If no data or not an array
        return {
            name: 'Work Orders Completed Yesterday',
            date: new Date().toISOString(),
            workOrderData: [],
        };
    } catch (error) {
        console.error('Error fetching work orders completed yesterday:', error);
        return {
            name: 'Work Orders Completed Yesterday',
            date: new Date().toISOString(),
            workOrderData: [],
        };
    }
};

// Get cases created data for charts
export const fetchCasesCreated = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=casesCreated${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching cases created data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseNumber: 0,
        };
    }
};

// Get cases closed data for charts
export const fetchCasesClosed = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=casesClosed${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching cases closed data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseNumber: 0,
        };
    }
};

// Get work orders created data for charts
export const fetchWorkOrdersCreated = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=workOrdersCreated${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching work orders created data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseNumber: 0,
        };
    }
};

// Get work orders closed data for charts
export const fetchWorkOrders = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=workOrders${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching work orders data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseNumber: 0,
        };
    }
};

// Get average case completion time data for charts
export const fetchAverageCaseCompletionTime = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=averageCaseCompletionTime${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching average case completion time data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseValue: '0h',
        };
    }
};

// Get average work order completion time data for charts
export const fetchAverageWorkOrderCompletionTime = async (
    centreId?: number,
    startDate?: string,
    endDate?: string,
): Promise<ChartData> => {
    try {
        // Real API implementation with axios for auth headers
        const response = await HTTP({
            url: `/api/dashboard?dataType=averageWorkOrderCompletionTime${centreId ? `&centreId=${centreId}` : ''}${
                startDate ? `&startDate=${startDate}` : ''
            }${endDate ? `&endDate=${endDate}` : ''}`,
            method: 'GET',
            headers: {
                'Auth-Token-Provider': 'gateway-api',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching average work order completion time data:', error);
        // Return empty chart data on error
        return {
            chartData: [],
            progress: '0%',
            caseValue: '0h',
        };
    }
};
