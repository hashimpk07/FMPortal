// Import services
import categoryService from './categoryService';
import ticketWorkOrderService from './ticketWorkOrderService';
import workOrderCommentsService from './workOrderCommentsService';
import statusService from './statusService';
import userService from './userService';
import workOrderUtils from './workOrderUtils';

// Export category service
export { categoryService };
export type { Category, CategoryForm, CategoryConfig, CategoriesResponse } from './categoryService';

// Export status service
export { statusService };
export { fetchWorkOrderStatuses } from './statusService';
export type { Status } from './statusService';

// Export user service
export { userService };
export { fetchAssignableUsers } from './userService';
export type { Assignee } from './userService';

// Export ticket work order service
export { ticketWorkOrderService };
export {
    fetchWorkOrdersList,
    fetchWorkOrderDetail,
    createWorkOrder,
    updateWorkOrderStatus,
    fetchWorkOrderComments as fetchTicketWorkOrderComments,
    addWorkOrderComment as addTicketWorkOrderComment,
    assignWorkOrdersToAsset,
    fetchAssignedWorkOrdersToAsset,
} from './ticketWorkOrderService';

export type {
    WorkOrderListParams,
    WorkOrderDetailParams,
    CreateWorkOrderParams,
    WorkOrderStatus,
    WorkOrderUser,
    WorkOrderHistory,
    WorkOrderAttributes,
    WorkOrderData,
    WorkOrderListResponse,
    WorkOrderDetailResponse,
    WorkOrderComment,
    WorkOrderCommentsResponse,
    AddCommentParams,
} from './ticketWorkOrderService';

// Export work order comments service
export { workOrderCommentsService };
export { fetchWorkOrderComments, addWorkOrderComment } from './workOrderCommentsService';
export type { CommentUser, Comment, FormattedComment } from './workOrderCommentsService';

// Export work order utils
export * from './workOrderUtils';
export { default as WorkOrderUtils } from './workOrderUtils';

// Default export with all services
export default {
    categoryService,
    ticketWorkOrderService,
    workOrderCommentsService,
    statusService,
    userService,
    workOrderUtils,
};
