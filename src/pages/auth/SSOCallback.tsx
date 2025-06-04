import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useAuth from '../../hooks/useAuth';
import { SELECT_LOGIN_PATH, GET_TENANCY_PATH } from '../../constants/routes';

/**
 * SSO Callback component
 * Handles OAuth callback and token exchange
 */
const SSOCallback: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { handleCallback, logout } = useAuth();
    const [authFailed, setAuthFailed] = useState(false);

    // Process the callback on component mount
    useEffect(() => {
        const processCallback = async () => {
            try {
                await handleCallback();
                navigate(GET_TENANCY_PATH);
            } catch (error) {
                console.error('Authentication error:', error);
                setAuthFailed(true);
            }
        };

        processCallback();
    }, [handleCallback, navigate]);

    /**
     * Handle returning to login page
     */
    const goBackToLogin = () => {
        logout();
        navigate(SELECT_LOGIN_PATH);
    };

    // Display error state if authentication failed
    if (authFailed) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                }}
            >
                <Box>{t('auth.an_error_occurred')}</Box>

                <Button
                    onClick={goBackToLogin}
                    variant="contained"
                    startIcon={<ArrowBackIosIcon />}
                    fullWidth
                    color="error"
                >
                    {t('auth.try_again')}
                </Button>
            </Box>
        );
    }

    // Display loading state while processing
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3rem',
            }}
        >
            <Box>{t('auth.please_wait_logging_in')}</Box>
            <CircularProgress color="secondary" thickness={4} size={70} />
        </Box>
    );
};

export default SSOCallback;
