import axios from 'axios';
import { userStore } from '@mallcomm/portals-auth';
import HTTP from './axios';

/**
 * Utility to verify if authorization headers are correctly configured
 * Call this from a debugging component to check if headers are being set properly
 */
export function testAuthHeaders(): { hasAuthorizationHeader: boolean } {
    // Check headers that would be sent
    const directHeaders = axios.defaults.headers.common;
    const httpHeaders = HTTP.defaults.headers;

    console.log('Direct Axios Headers:', directHeaders);
    console.log('HTTP Instance Headers:', httpHeaders);

    // Get token from storage for comparison
    const sessionToken = sessionStorage.getItem('jwtToken');
    console.log('Session Token Available:', !!sessionToken);

    // Get token from store
    const { gatewayAuthToken } = userStore();
    console.log('Gateway Auth Token Available:', !!gatewayAuthToken);

    // Apply our custom interceptor logic manually to check result
    // We're only testing the presence of tokens, not actually using the headers
    if (gatewayAuthToken) {
        console.log('Would add authorization header with gateway token');
    } else if (sessionToken) {
        console.log('Would add authorization header with session token');
    } else {
        console.log('No token available for authorization header');
    }

    // Check if Authorization header would be added
    const hasAuthorizationHeader = !!(gatewayAuthToken || sessionToken);

    return {
        hasAuthorizationHeader,
    };
}

export default testAuthHeaders;
