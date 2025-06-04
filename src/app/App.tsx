import { setupAuth, useAxiosInterceptor } from '@mallcomm/portals-auth';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import RouterConfig from './Router';
import PageNavigation from '../components/layout2/PageNavigation';
import '../lang/config';
import Nav from '../features/dashboard/Nav';
import AuthLayout from '../components/AuthLayout';
import useAuth from '../hooks/useAuth';
import useSyncAuthToken from '../hooks/useSyncAuthToken';

import {
    AUTO_TENANCY_SELECTION,
    GET_TENANCY_PATH,
    APP_CLIENT_ID,
    APP_URL,
    AUTH_BASE_URL,
    API_BASE_URL,
    API_VERSION,
    TOKEN_EXPIRY_BUFFER_MINUTES,
    ENABLE_CMS_USER_TYPE,
    ENABLE_PROFILE_USER_TYPE,
    TENANCY_PAGE,
} from '../constants';

const StyledPage = styled.div`
    display: flex;
    width: 100%;
    overflow-x: hidden; /* Prevent horizontal scroll */
`;

interface StyledPageContentProps {
    isTenancyPage?: boolean;
}

const StyledPageContent = styled.div<StyledPageContentProps>`
    padding: ${(props) => (props.isTenancyPage ? '0' : '2.5rem 2rem')};
    margin-top: 3rem;
    width: 80%; /* This can be dynamic if needed */
    flex-grow: 1; /* Ensure it takes up the remaining space */
    overflow-x: auto; /* Allow horizontal scrolling inside content if needed */
`;

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, hasAuthToken, handleAuthRedirect, tenancy } = useAuth();

    // Sync auth tokens between userStore and sessionStorage
    useSyncAuthToken();

    // Setup auth configuration once
    useEffect(() => {
        setupAuth({
            AUTO_TENANCY_SELECTION,
            GET_TENANCY_PATH,
            APP_CLIENT_ID,
            APP_URL,
            AUTH_BASE_URL,
            API_BASE_URL,
            API_VERSION,
            TOKEN_EXPIRY_BUFFER_MINUTES,
            ENABLE_CMS_USER_TYPE,
            ENABLE_PROFILE_USER_TYPE,
        });
    }, []);

    // Setup axios interceptor
    // @ts-expect-error - Type definition mismatch with actual return type
    const { registerInterceptors, axiosInterceptor } = useAxiosInterceptor(navigate);

    useEffect(() => {
        if (!registerInterceptors) {
            axiosInterceptor(); // Register axios interceptors
        }
    }, [registerInterceptors, axiosInterceptor]);

    // Handle authentication redirects
    useEffect(() => {
        handleAuthRedirect(location.pathname);
    }, [location.pathname, handleAuthRedirect]);

    // Wait for interceptor to be registered
    if (!registerInterceptors) {
        return <div />;
    }

    // Render auth layout for unauthenticated users
    // except for users with auth token on the tenancy page
    if (!isAuthenticated && !(hasAuthToken && location.pathname === TENANCY_PAGE)) {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthLayout />
            </LocalizationProvider>
        );
    }

    // Main application UI for authenticated users
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledPage>
                <Nav />
                {tenancy && <PageNavigation />}
                <StyledPageContent isTenancyPage={location.pathname === TENANCY_PAGE}>
                    <RouterConfig />
                </StyledPageContent>
            </StyledPage>
        </LocalizationProvider>
    );
};

export default App;
