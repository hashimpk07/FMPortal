import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { userStore } from '@mallcomm/portals-auth';
import routeList from './routes/RouteList';
import { API_VERSION, API_BASE_URL } from '../constants';
import fetchData from '../services/fetchData';

const RouterConfig: React.FC = () => {
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

    return (
        <Routes>
            {routeList.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/*<Route path="/get-tenancy" element={<SelectTenancy />} />*/}
        </Routes>
    );
};

export default RouterConfig;
