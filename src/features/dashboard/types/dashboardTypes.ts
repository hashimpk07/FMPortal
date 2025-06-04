/**
 * Dashboard API Types
 * This file contains type definitions for the Dashboard API
 */

// Work Order Data for charts and visualization
export interface WorkOrderData {
    id: number;
    value: number;
    label: string;
    color: string;
    percentage?: number;
    status?: number;
}

// Dashboard API response structure
export interface DashboardApiResponse {
    data: {
        type: string;
        id: string;
        attributes: {
            dateRange: {
                start: string;
                end: string;
            };
            metrics: {
                averageCaseCompletionTime: {
                    total: string;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: string;
                    }>;
                };
                casesCreated: {
                    total: number;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: number;
                    }>;
                };
                casesClosed: {
                    total: number;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: number;
                    }>;
                };
                workOrdersCreated: {
                    total: number;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: number;
                    }>;
                };
                workOrdersClosed: {
                    total: number;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: number;
                    }>;
                };
                averageWorkOrderCompletionTime: {
                    total: string;
                    previousTotal?: number;
                    percentageChange: number | null;
                    data: Array<{
                        date: string;
                        value: string;
                    }>;
                };
            };
            charts: {
                openWorkOrdersByStatus: {
                    pending: StatusItem[];
                    scheduled: StatusItem[];
                    onHold: StatusItem[];
                    inProgress: StatusItem[];
                };
                openWorkOrdersByPriority: PriorityItem[];
            };
            lists: {
                workOrdersDueToday: {
                    count: number;
                    data: Array<{
                        id: string;
                        title: string;
                        dueDate: string;
                        completedDate?: string;
                        status: {
                            id: number;
                            name: string;
                        };
                        priority: string;
                    }>;
                };
                workOrdersCompletedYesterday: {
                    count: number;
                    data: Array<{
                        id: string;
                        title: string;
                        dueDate?: string;
                        completedDate: string;
                        status: {
                            id: number;
                            name: string;
                        };
                        priority: string;
                    }>;
                };
            };
        };
    };
}

// Status item for work orders by status chart
export interface StatusItem {
    id: string | number;
    name: string;
    count: number;
}

// Priority item for work orders by priority chart
export interface PriorityItem {
    id: string;
    name: string;
    count: number;
}

// Work order item for lists
export interface WorkOrderItem {
    id: string;
    title: string;
    dueDate?: string;
    completedDate?: string;
    status: string;
    priority: string;
}

// Dashboard parameters
export interface DashboardParams {
    centreId?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    dataType?: DashboardDataType;
}

// Dashboard data types enum
export enum DashboardDataType {
    PRIORITY_WORK_ORDERS = 'priorityWorkOrders',
    STATUS_WORK_ORDERS = 'statusWorkOrders',
    WORK_ORDERS_DUE_TODAY = 'workOrdersDueToday',
    WORK_ORDERS_COMPLETED_YESTERDAY = 'workOrdersCompletedYesterday',
    CASES_CREATED = 'casesCreated',
    CASES_CLOSED = 'casesClosed',
    WORK_ORDERS_CREATED = 'workOrdersCreated',
    WORK_ORDERS = 'workOrders',
    AVERAGE_CASE_COMPLETION_TIME = 'averageCaseCompletionTime',
    AVERAGE_WORK_ORDER_COMPLETION_TIME = 'averageWorkOrderCompletionTime',
    CENTRES = 'centres',
}

// Centre data
export interface Centre {
    id: number;
    name: string;
}

// Work order for lists
export interface WorkOrder {
    title: string;
    id: string;
    img?: string;
    status: number;
    description: string;
    dueDate: string;
}

// Work order list container
export interface WorkOrderList {
    name: string;
    date: string;
    workOrderData: WorkOrder[];
}

// Define DataPoint interface for chart data
export interface DataPoint {
    date: string;
    value: number;
}

// Chart data for dashboard charts
export interface ChartData {
    chartData: number[] | DataPoint[];
    xLabels?: string[];
    caseNumber?: number;
    caseValue?: string;
    progress?: string;
}

// Generic response type for dashboard data
export interface DashboardResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}
