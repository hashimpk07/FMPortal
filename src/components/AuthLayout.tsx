import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Route, Routes } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SelectAuth from '../pages/auth/SelectAuth';
import SSOCallback from '../pages/auth/SSOCallback';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        backgroundColor: '#F5F5F5',
    },
    content: {
        flexGrow: 1,
        padding: 3,
    },
}));

// Auth container with simple transitions
const AuthBox = styled(Box)({
    background: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0px 0px 30px 0px rgba(89, 28, 105, 0.15)',
    maxWidth: '60vw',
    minWidth: '30vw',
    padding: '5.25rem 3rem',
    transition: 'all 0.5s ease-in-out',
});

const AuthLayout: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh',
                    background: 'url(/background_image.jpg) lightgray 50% / cover no-repeat',
                }}
            >
                <AuthBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <img
                        src="/kinexio_logo.svg"
                        alt="Logo"
                        style={{
                            height: '3.5rem',
                            marginBottom: '2rem',
                            textAlign: 'center',
                            width: '100%',
                        }}
                    />
                    <Box sx={{ width: '100%' }}>
                        <Routes>
                            <Route path="/select-login" element={<SelectAuth />} />
                            <Route path="/sso/callback" element={<SSOCallback />} />
                        </Routes>
                    </Box>
                </AuthBox>
            </Box>
        </div>
    );
};

export default AuthLayout;
