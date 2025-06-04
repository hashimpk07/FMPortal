import { useNavigate } from 'react-router-dom';
import { userStore } from '@mallcomm/portals-auth';
import { useCallback, useEffect, useRef } from 'react';
import HTTP from '../utils/api/helpers/axios';
import {
    HOME,
    SELECT_LOGIN_PAGE,
    LOGIN_PAGE,
    SSO_CALLBACK_PAGE,
    TENANCY_PAGE,
    APP_CLIENT_ID,
    APP_URL,
    AUTH_BASE_URL,
} from '../constants';

/**
 * Custom hook for authentication functionality across the app
 * Centralizes auth-related navigation, state access, and operations
 */
const useAuth = () => {
    const navigate = useNavigate();

    const {
        gatewayAuthToken,
        authToken,
        userDetails,
        tenancy,
        resetAuthState,
        setStateChallenge,
        setPkceCodeVerifier,
        setAuthToken,
        setRefreshAuthToken,
        stateChallenge,
        pkceCodeVerifier,
    } = userStore();

    // Create a logout function reference to avoid circular dependencies
    const logoutRef = useRef<() => void>();

    const PUBLIC_PATHS = [SELECT_LOGIN_PAGE, LOGIN_PAGE, SSO_CALLBACK_PAGE, TENANCY_PAGE];

    /**
     * Validates token expiration
     * JWT tokens are base64 encoded and contain expiration time
     */
    const isTokenExpired = useCallback((token: string | null): boolean => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiration = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expiration;
        } catch (error) {
            console.error('Error validating token:', error);
            return true;
        }
    }, []);

    /**
     * Handles logout and redirects to login page
     */
    const logout = useCallback(() => {
        console.log('Logging out');
        resetAuthState();

        // Clear session storage for security
        try {
            // Explicitly remove specific tokens
            const tokenKeys = [
                'jwtToken',
                'accessToken',
                'refreshToken',
                'user-storage', // Zustand storage key
                'auth-token',
                'gateway-auth-token',
            ];

            // @ts-ignore
            userStore.getState().resetAuthState();

            // Remove all known token keys
            tokenKeys.forEach((key) => {
                if (sessionStorage.getItem(key)) {
                    sessionStorage.removeItem(key);
                }
            });

            // Also clear all storage to be thorough
            sessionStorage.clear();

            // Clear local storage tokens as well if they exist
            tokenKeys.forEach((key) => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing auth tokens from storage:', error);
        }

        navigate(SELECT_LOGIN_PAGE);
    }, [resetAuthState, navigate]);

    // Update the logout reference to avoid circular dependencies
    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    /**
     * Check for token expiration periodically
     */
    useEffect(() => {
        if (!tenancy) return;
        // Only check if we have a token to check
        if (!gatewayAuthToken && !authToken) return;

        const checkTokenValidity = () => {
            const {
                gatewayAuthToken: latestGatewayAuthToken,
                authToken: latestAuthToken,
                // @ts-expect-error - userStore.getState() contains these properties but TypeScript doesn't recognize them
            } = userStore.getState();

            if (isTokenExpired(latestGatewayAuthToken) && !isTokenExpired(latestAuthToken)) {
                console.warn('Auth tokens expired, logging out');
                if (logoutRef.current) {
                    logoutRef.current();
                }
            }
        };

        // Check token validity immediately
        checkTokenValidity();

        // Set up interval to check token validity
        const intervalId = setInterval(checkTokenValidity, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [gatewayAuthToken, authToken, tenancy, isTokenExpired]);

    /**
     * Checks if the current path is public
     */
    const isPublicPath = useCallback(
        (path: string): boolean => {
            return PUBLIC_PATHS.includes(path);
        },
        [PUBLIC_PATHS],
    );

    /**
     * Handles authentication redirects based on auth state
     */
    const handleAuthRedirect = useCallback(
        (currentPath: string) => {
            if (authToken && currentPath === TENANCY_PAGE) {
                // Allow user to stay on tenancy page if they have an auth token
                return;
            }

            if (gatewayAuthToken && isPublicPath(currentPath)) {
                // Redirect authenticated users away from public pages
                navigate(HOME);
                return;
            }

            if (!gatewayAuthToken && !isPublicPath(currentPath)) {
                // Redirect unauthenticated users to login
                navigate(SELECT_LOGIN_PAGE);
            }
        },
        [gatewayAuthToken, authToken, isPublicPath, navigate],
    );

    /**
     * Initiates login with provided email
     */
    const login = useCallback(
        async (email: string) => {
            try {
                // Generate the auth state challenge and PKCE code verifier
                const state = createRandomString(40);
                setStateChallenge(state);

                // Generate the code verifier and prepare for authorization redirect
                const codeVerifier = generateCodeVerifier();
                setPkceCodeVerifier(codeVerifier);

                // Redirect to authorization endpoint
                const clientId = APP_CLIENT_ID;
                const redirectUri = encodeURIComponent(`${APP_URL}/sso/callback`);

                // Generate code challenge from verifier
                const codeChallenge = await generateCodeChallenge(codeVerifier);

                window.location.href = `${AUTH_BASE_URL}/oauth/authorize?email=${email}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}&scope=user_email`;

                return true;
            } catch (error) {
                console.error('Login error:', error);
                return false;
            }
        },
        [setStateChallenge, setPkceCodeVerifier],
    );

    /**
     * Handles the OAuth callback
     */
    const handleCallback = useCallback(async () => {
        if (!stateChallenge || !pkceCodeVerifier) {
            throw new Error('Missing auth state parameters');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        const authorizationStateChallenge = urlParams.get('state');

        if (!authorizationCode) {
            throw new Error('Authorization code not found');
        }

        if (
            !stateChallenge ||
            !authorizationStateChallenge ||
            stateChallenge !== authorizationStateChallenge
        ) {
            throw new Error('Authorization state challenge failed');
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: APP_CLIENT_ID.toString(),
            code: authorizationCode,
            redirect_uri: `${APP_URL}/sso/callback`,
            code_verifier: pkceCodeVerifier,
        });

        try {
            const response = await HTTP({
                url: `${AUTH_BASE_URL}/oauth/token`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: body,
            });

            if (response.status === 200) {
                setAuthToken(response.data.access_token);
                setRefreshAuthToken(response.data.refresh_token);

                // Save tokens to sessionStorage for interceptors to use
                sessionStorage.setItem('jwtToken', response.data.access_token);
                sessionStorage.setItem('gateway-auth-token', response.data.access_token);

                return;
            }
        } catch (error) {
            console.error(error);
            throw new Error('Unable to authenticate');
        }

        throw new Error('Unable to authenticate');
    }, [stateChallenge, pkceCodeVerifier, setAuthToken, setRefreshAuthToken]);

    return {
        isAuthenticated: !!gatewayAuthToken,
        hasAuthToken: !!authToken,
        isTokenExpired,
        userDetails,
        tenancy,
        handleAuthRedirect,
        isPublicPath,
        login,
        handleCallback,
        logout,
    };
};

// Helper functions for authentication
const createRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
        result += chars[number % chars.length];
    });
    return result;
};

const generateCodeVerifier = () => {
    const array = new Uint32Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join('');
};

const base64UrlEncode = (input: string) => {
    return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(
        String.fromCharCode.apply(null, new Uint8Array(digest) as unknown as number[]),
    );
};

export default useAuth;
