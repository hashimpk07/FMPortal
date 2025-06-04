export const MUI_LICENSE_KEY = import.meta.env.VITE_APP_MUI_LICENSE_KEY;
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
export const API_VERSION = import.meta.env.VITE_APP_API_VERSION;
export const AUTH_BASE_URL = import.meta.env.VITE_APP_AUTH_BASE_URL;
export const APP_CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;

export const APP_URL = import.meta.env.VITE_APP_URL;

export const ENABLE_CMS_USER_TYPE = import.meta.env.VITE_APP_ENABLE_CMS_USER_TYPE === 'true';
export const ENABLE_PROFILE_USER_TYPE = false;
export const APP_TOKEN_EXPIRY_BUFFER_MINUTES = import.meta.env.VITE_APP_TOKEN_EXPIRY_BUFFER_MINUTES;
export const GET_TENANCY_PATH = '/get-tenancy';

export const AUTO_TENANCY_SELECTION = import.meta.env.VITE_APP_AUTO_TENANCY_SELECTION === 'true';
export const TOKEN_EXPIRY_BUFFER_MINUTES =
    (import.meta.env.VITE_TOKEN_EXPIRY_BUFFER_MINUTES as number) || 15;

export const GET = 'GET';
export const POST = 'POST';

// endpoints
export const CONTRACTOR_DATABASE = 'contractors';
export const INVOICE = 'invoices';
export const INVOICE_PAYMENT = 'invoicesPayments';
export const STATUS = 'status';
export const CONTRACTOR = 'listContractor';
export const DOCUMENTS = 'documents';
export const CASE_WORk_ORDER = 'case-work-order';
export const CASE_WORk_ORDER_CATEGORY = 'caseworkcategories';
