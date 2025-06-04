import { WorkOrderData, WorkOrderStatus } from './ticketWorkOrderService';

/**
 * Get the appropriate color class based on work order status
 * @param status The work order status
 * @returns CSS class name for the status color
 */
export function getStatusColorClass(status: WorkOrderStatus | string): string {
    // If status is a string, create a mock status object
    const statusSlug = typeof status === 'string' ? status : status.slug;

    switch (statusSlug) {
        case 'sent':
            return 'bg-blue-100 text-blue-800';
        case 'draft':
            return 'bg-gray-100 text-gray-800';
        case 'approved':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        case 'inProgress':
            return 'bg-yellow-100 text-yellow-800';
        case 'completed':
            return 'bg-green-300 text-green-900';
        case 'deleted':
            return 'bg-red-300 text-red-900';
        case 'preApproved':
            return 'bg-teal-100 text-teal-800';
        case 'completedUnconfirmed':
            return 'bg-green-200 text-green-800';
        case 'onHold':
            return 'bg-orange-100 text-orange-800';
        case 'inReview':
            return 'bg-purple-100 text-purple-800';
        case 'scheduled':
            return 'bg-indigo-100 text-indigo-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}

/**
 * Format date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Get a priority level label and icon based on numeric priority
 * @param priority Priority number (1-5, null, or undefined)
 * @returns Object with label and icon information
 */
export function getPriorityInfo(priority: number | null | undefined) {
    if (priority === null || priority === undefined) {
        return {
            label: 'None',
            icon: '/assets/images/default.svg',
            colorClass: 'bg-gray-100 text-gray-800',
        };
    }

    switch (priority) {
        case 1:
            return {
                label: 'Critical',
                icon: '/assets/images/high.svg',
                colorClass: 'bg-red-100 text-red-800',
            };
        case 2:
            return {
                label: 'High',
                icon: '/assets/images/medium-high.svg',
                colorClass: 'bg-orange-100 text-orange-800',
            };
        case 3:
            return {
                label: 'Medium',
                icon: '/assets/images/medium.svg',
                colorClass: 'bg-yellow-100 text-yellow-800',
            };
        case 4:
            return {
                label: 'Low',
                icon: '/assets/images/medium-low.svg',
                colorClass: 'bg-blue-100 text-blue-800',
            };
        case 5:
            return {
                label: 'Very Low',
                icon: '/assets/images/low.svg',
                colorClass: 'bg-green-100 text-green-800',
            };
        default:
            return {
                label: 'Unknown',
                icon: '/assets/images/default.svg',
                colorClass: 'bg-gray-100 text-gray-800',
            };
    }
}

/**
 * Extract the relevant display data from a work order for use in lists or cards
 * @param workOrder The work order object
 * @returns Object with formatted display data
 */
export function getWorkOrderDisplayData(workOrder: WorkOrderData) {
    const { id, attributes } = workOrder;
    const { data, priority, createdAt, status } = attributes;
    const { title, details, description } = data;

    return {
        id,
        title,
        description: details || description || '',
        priority: getPriorityInfo(priority),
        status: {
            label: status.label,
            slug: status.slug,
            colorClass: getStatusColorClass(status),
        },
        createdAt: formatDate(createdAt),
        rawData: workOrder, // Include the raw data for any additional needs
    };
}

/**
 * Get the available next statuses for a work order
 * @param workOrder The work order object
 * @returns Array of available statuses
 */
export function getAvailableNextStatuses(workOrder: WorkOrderData) {
    return workOrder.attributes.availableStatuses || [];
}

/**
 * Group work orders by status for dashboard display
 * @param workOrders Array of work order data
 * @returns Object with work orders grouped by status
 */
export function groupWorkOrdersByStatus(workOrders: WorkOrderData[]) {
    return workOrders.reduce(
        (acc, workOrder) => {
            const status = workOrder.attributes.status.slug;

            if (!acc[status]) {
                acc[status] = [];
            }

            acc[status].push(getWorkOrderDisplayData(workOrder));
            return acc;
        },
        {} as Record<string, ReturnType<typeof getWorkOrderDisplayData>[]>,
    );
}

const workOrderUtils = {
    getStatusColorClass,
    formatDate,
    getPriorityInfo,
    getWorkOrderDisplayData,
    getAvailableNextStatuses,
    groupWorkOrdersByStatus,
};

export default workOrderUtils;
