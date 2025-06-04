import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants';
import { appendIfExists } from '../../../../utils/api/helpers/queryParams';

// Types
export interface WorkOrderListParams {
    status?: string;
    state?: string;
    assignedTo?: string;
    search?: string;
    categoryId?: string;
    dueDate?: string;
    page?: number;
    pageSize?: number;
    include?: string[];
}

export interface WorkOrderDetailParams {
    id: string;
    include?: string[];
}

export interface CreateWorkOrderParams {
    title: string;
    details: string;
    document?: string | null;
    store?: string;
    reserved_due_date?: string;
    reserved_priority?: string;
    images?: Record<string, { type: string; id: string }>;
    // any additional fields based on form requirements
    assetId?: string; // Added for asset relationship
}

export interface WorkOrderStatus {
    slug: string;
    label: string;
}

export interface WorkOrderUser {
    id: string;
    type: string;
    attributes: {
        name: string;
        email: string;
    };
}

export interface WorkOrderHistory {
    current: boolean;
    status: WorkOrderStatus;
    user: WorkOrderUser;
    approvalSteps: Array<{
        name: string;
        order: number;
        approvalsRequired: number;
        approvals: any | null;
        createdAt: string;
    }> | null;
    occurredAt: string;
}

export interface WorkOrderAttributes {
    data: {
        title: string;
        details?: string;
        description?: string;
        document?: string | null;
        store?: string;
        reserved_due_date?: string;
        reserved_priority?: string;
        images?: Record<string, { type: string; id: string }>;
    };
    priority: number | null;
    createdAt: string;
    updatedAt: string;
    status: WorkOrderStatus;
    availableStatuses: WorkOrderStatus[];
    history: WorkOrderHistory[];
    unreadComments: boolean;
}

export interface WorkOrderData {
    id: string;
    type: string;
    attributes: WorkOrderAttributes;
    links: {
        self: { href: string };
        related: { href: string };
    };
    relationships?: {
        local?: { data: any };
        form?: { data: { type: string; id: string } };
        createdBy?: { data: { type: string; id: string } };
        asset?: { data: { type: string; id: string } };
    };
}

export interface WorkOrderListResponse {
    data: WorkOrderData[];
    links: {
        first: string;
        last: string;
        next?: string;
        prev?: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface WorkOrderDetailResponse {
    data: WorkOrderData;
    included?: Array<any>;
}

export interface WorkOrderComment {
    id: string;
    type: 'comments';
    attributes: {
        body: string;
        createdAt: string;
        updatedAt: string;
    };
    relationships: {
        user: {
            data: {
                type: string;
                id: string;
            };
        };
    };
}

export interface WorkOrderCommentsResponse {
    data: WorkOrderComment[];
    links: {
        first: string;
        last: string;
        next?: string;
        prev?: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    included?: Array<any>;
}

export interface AddCommentParams {
    workOrderId: string;
    comment: string;
}

/**
 * Fetches a list of work orders with optional filtering
 * @param params Optional filtering parameters
 * @returns Promise with work orders list
 */
export async function fetchWorkOrdersList(
    params: WorkOrderListParams = {},
): Promise<WorkOrderListResponse> {
    const {
        status,
        state,
        assignedTo,
        search,
        page = 1,
        pageSize = 15,
        include = [],
        categoryId,
        dueDate,
    } = params;

    const queryParams = new URLSearchParams();

    // Add pagination if needed
    if (page > 1) {
        queryParams.append('page', page.toString());
    }

    // Set page size if different from default
    if (pageSize !== 15) {
        queryParams.append('page_size', pageSize.toString());
    }

    // Add filters using appendIfExists
    appendIfExists(queryParams, 'filter[status]', status);
    appendIfExists(queryParams, 'filter[state]', state);
    appendIfExists(queryParams, 'filter[assignedTo]', assignedTo);
    appendIfExists(queryParams, 'search', search);
    appendIfExists(queryParams, 'filter[categoryId]', categoryId);
    appendIfExists(queryParams, 'filter[dueDate]', dueDate);

    // Set filter to get only work orders
    queryParams.append('filter[type]', 'work_orders');

    // Include related data if specified
    if (include.length > 0) {
        queryParams.append('include', include.join(','));
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets?${queryParams.toString()}`;
        const response = await HTTP.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching work orders list:', error);
        throw error;
    }
}

/**
 * Fetches a single work order by ID
 * @param params Parameters with the work order ID and optional includes
 * @returns Promise with the work order details
 */
export async function fetchWorkOrderDetail(
    params: WorkOrderDetailParams,
): Promise<WorkOrderDetailResponse> {
    const { id, include = ['local', 'createdBy', 'form'] } = params;

    if (!id) {
        throw new Error('Work order ID is required');
    }

    const queryParams = new URLSearchParams();

    // Include related data
    if (include.length > 0) {
        queryParams.append('include', include.join(','));
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets/${id}${queryParams.size > 0 ? '?' + queryParams.toString() : ''}`;
        const response = await HTTP.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching work order details:', error);
        throw error;
    }
}

/**
 * Creates a new work order
 * @param params Work order data
 * @returns Promise with the created work order
 */
export async function createWorkOrder(
    params: CreateWorkOrderParams,
): Promise<WorkOrderDetailResponse> {
    const { assetId, ...restParams } = params;

    const payload: any = {
        data: {
            type: 'tickets',
            attributes: {
                ...restParams,
                // Ensure work order type is set
                type: 'work_orders',
            },
            relationships: {},
        },
    };

    // Add asset relationship if provided
    if (assetId) {
        payload.data.relationships = {
            ...payload.data.relationships,
            asset: {
                data: {
                    type: 'assets',
                    id: assetId,
                },
            },
        };
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets`;
        const response = await HTTP.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating work order:', error);
        throw error;
    }
}

/**
 * Updates the status of a work order
 * @param id Work order ID
 * @param status New status value
 * @returns Promise with the updated work order
 */
export async function updateWorkOrderStatus(
    id: string,
    status: string,
): Promise<WorkOrderDetailResponse> {
    if (!id) {
        throw new Error('Work order ID is required');
    }

    if (!status) {
        throw new Error('Status is required');
    }

    const payload = {
        data: {
            type: 'tickets',
            id,
            attributes: {
                status,
            },
        },
    };

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets/${id}`;
        const response = await HTTP.patch(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating work order status:', error);
        throw error;
    }
}

/**
 * Fetches comments for a work order
 * @param workOrderId The ID of the work order
 * @param page Optional page number for pagination
 * @returns Promise with the comments
 */
export async function fetchWorkOrderComments(
    workOrderId: string,
    page = 1,
): Promise<WorkOrderCommentsResponse> {
    if (!workOrderId) {
        throw new Error('Work order ID is required');
    }

    const queryParams = new URLSearchParams();

    // Add pagination if needed
    if (page > 1) {
        queryParams.append('page', page.toString());
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets/${workOrderId}/comments${queryParams.size > 0 ? '?' + queryParams.toString() : ''}`;
        const response = await HTTP.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching work order comments:', error);
        throw error;
    }
}

/**
 * Adds a comment to a work order
 * @param params Parameters with work order ID and comment text
 * @returns Promise with the created comment
 */
export async function addWorkOrderComment(
    params: AddCommentParams,
): Promise<{ data: WorkOrderComment }> {
    const { workOrderId, comment } = params;

    if (!workOrderId) {
        throw new Error('Work order ID is required');
    }

    if (!comment) {
        throw new Error('Comment text is required');
    }

    const payload = {
        data: {
            type: 'comments',
            attributes: {
                body: comment,
            },
        },
    };

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/tickets/${workOrderId}/comments`;
        const response = await HTTP.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error adding work order comment:', error);
        throw error;
    }
}

/**
 * Assigns existing work orders to an asset
 * @param assetId The ID of the asset
 * @param workOrderIds Array of work order IDs to assign
 * @returns Promise with the updated asset
 */
export async function assignWorkOrdersToAsset(assetId: string, workOrderIds: string[]) {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    if (!workOrderIds.length) {
        throw new Error('At least one work order ID is required');
    }

    const payload = {
        data: workOrderIds.map((id) => ({
            type: 'tickets',
            id,
        })),
    };

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}/relationships/tickets`;
        const response = await HTTP.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error assigning work orders to asset:', error);
        throw error;
    }
}

/**
 * Fetches work orders assigned to an asset
 * @param assetId The ID of the asset
 * @returns Promise with the assigned work orders
 */
export async function fetchAssignedWorkOrdersToAsset(assetId: string) {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}/tickets?filter[type]=work_orders`;
        const response = await HTTP.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching assigned work orders:', error);
        throw error;
    }
}

const ticketWorkOrderService = {
    fetchWorkOrdersList,
    fetchWorkOrderDetail,
    createWorkOrder,
    updateWorkOrderStatus,
    fetchWorkOrderComments,
    addWorkOrderComment,
    assignWorkOrdersToAsset,
    fetchAssignedWorkOrdersToAsset,
};

export default ticketWorkOrderService;
