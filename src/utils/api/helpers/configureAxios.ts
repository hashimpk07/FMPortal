import axios from 'axios';

/**
 * Configures global axios interceptors to ensure all requests include authorization tokens
 * This helps maintain backward compatibility for any direct axios calls
 */
export function configureGlobalAxiosInterceptors() {
    axios.interceptors.request.use((config) => {
        const updatedConfig = { ...config };

        // Don't override if headers already have Authorization
        if (!updatedConfig.headers.Authorization) {
            // Get token from sessionStorage
            const token =
                sessionStorage.getItem('jwtToken') || sessionStorage.getItem('gateway-auth-token');
            if (token) {
                updatedConfig.headers.Authorization = `Bearer ${token}`;
            }
        }

        return updatedConfig;
    });
}

export default configureGlobalAxiosInterceptors;
