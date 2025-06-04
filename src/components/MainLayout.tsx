import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Route, Routes } from 'react-router-dom';
import { Toolbar, CssBaseline } from '@mui/material';
import { userStore, SelectTenancy } from '@mallcomm/portals-auth';
import { API_BASE_URL, API_VERSION, DRAWER_WIDTH, TENANCY_PAGE } from '../constants';
import fetchData from '../services/fetchData';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
    },
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
    content: {
        flexGrow: 1,
        padding: 3,
        minWidth: 0,
    },
}));
const MainLayout: React.FC = () => {
    const { tenancy, userDetails, setUserDetails } = userStore();
    useEffect(() => {
        if (!userDetails && tenancy) {
            fetchData({
                path: `${API_BASE_URL}/${API_VERSION}/users/current`,
            }).then((r: any) => {
                setUserDetails(r.data);
            });
        }
    }, [userDetails, tenancy, setUserDetails]);
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <main className={classes.content}>
                <Toolbar />
                <Routes>
                    <Route path={TENANCY_PAGE} element={<SelectTenancy />} />
                    {/* Add other routes here */}
                </Routes>
            </main>
        </div>
    );
};
export default MainLayout;
