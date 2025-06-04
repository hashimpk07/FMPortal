import { useEffect } from 'react';
import { userStore } from '@mallcomm/portals-auth';

/**
 * Custom hook to synchronize authentication tokens between the userStore and sessionStorage
 * This ensures our HTTP requests can access tokens without using hooks in non-React contexts
 */
const useSyncAuthToken = () => {
    const { gatewayAuthToken } = userStore();

    // Keep sessionStorage in sync with userStore
    useEffect(() => {
        if (gatewayAuthToken) {
            sessionStorage.setItem('jwtToken', gatewayAuthToken);
            sessionStorage.setItem('gateway-auth-token', gatewayAuthToken);
        } else {
            // If userStore doesn't have a token, check if sessionStorage has one we can use
            const sessionToken =
                sessionStorage.getItem('jwtToken') || sessionStorage.getItem('gateway-auth-token');
            if (!sessionToken) {
                // Clear tokens from sessionStorage if neither location has a valid token
                sessionStorage.removeItem('jwtToken');
                sessionStorage.removeItem('gateway-auth-token');
            }
        }
    }, [gatewayAuthToken]);

    return null;
};

export default useSyncAuthToken;
