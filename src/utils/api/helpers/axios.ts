import axios, { InternalAxiosRequestConfig } from 'axios';
import * as jose from 'jose';
import { DateTime } from 'luxon';
import { userStore } from '@mallcomm/portals-auth';
import { API_BASE_URL, API_VERSION } from '../../../constants';

const HTTP = axios.create({
    headers: {
        'X-Mallcomm-Tenancy-Key': 'delta',
        // 'X-Mock-User': 'cmsUsers|1',
    },
});

HTTP.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) =>
        new Promise(async (resolve, _) => {
            const updatedConfig = { ...config };
            // Get token from sessionStorage (where it should be saved by the auth system)
            const token =
                sessionStorage.getItem('jwtToken') || sessionStorage.getItem('gateway-auth-token');

            if (
                config.headers['Auth-Token-Provider'] === 'gateway-api' &&
                (token === null || token === '')
            ) {
            } else if (config.headers['Auth-Token-Provider'] === 'gateway-api' && token) {
                const tokenClaims = jose.decodeJwt(token);

                const tokenExpires = DateTime.fromMillis((tokenClaims.exp as number) * 1000);
                const now = DateTime.now().plus({ minutes: 10 });

                if (now >= tokenExpires) {
                    await getGatewayApiToken(
                        // @ts-expect-error - userStore.getState() has tenancyKey property but TypeScript doesn't recognize it
                        userStore.getState().tenancyKey || '',
                        // @ts-expect-error - userStore.getState() has gatewayAuthUser property but TypeScript doesn't recognize it
                        userStore.getState().gatewayAuthUser || '',
                        // @ts-expect-error - userStore.getState() has setTenancyKey method but TypeScript doesn't recognize it
                        userStore.getState().setTenancyKey,
                        // @ts-expect-error - userStore.getState() has setGatewayAuthToken method but TypeScript doesn't recognize it
                        userStore.getState().setGatewayAuthToken,
                        // @ts-expect-error - userStore.getState() has setGatewayAuthUser method but TypeScript doesn't recognize it
                        userStore.getState().setGatewayAuthUser,
                    );

                    // @ts-expect-error - userStore.getState() has gatewayAuthToken property but TypeScript doesn't recognize it
                    sessionStorage.setItem('jwtToken', userStore.getState().gatewayAuthToken);
                }
            }

            if (token) {
                const token =
                    sessionStorage.getItem('jwtToken') ||
                    sessionStorage.getItem('gateway-auth-token');

                updatedConfig.headers.Authorization = `Bearer ${token}`;
            }

            resolve(config);
        }),
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    },
);

HTTP.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

const getGatewayApiToken = async (
    tenancyKey: string,
    tenancyUserType: string,
    setTenancyKey: (a: null | string) => void,
    setGatewayAuthToken: (a: null | string) => void,
    setGatewayAuthUser: (a: null | string) => void,
) => {
    setTenancyKey(tenancyKey);
    setGatewayAuthUser(tenancyUserType);

    const tokenExchangeResponse = await axios({
        url: `${API_BASE_URL}/${API_VERSION}/auth/tokens/exchange`,
        method: 'POST',
        headers: {
            'X-Mallcomm-Tenancy-Key': tenancyKey,
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Auth-Token-Provider': 'auth-service',
        },
        data: JSON.stringify({
            userType: tenancyUserType,
            tokenType: 'authService',
        }),
    });

    if (tokenExchangeResponse.status === 201) {
        setGatewayAuthToken(tokenExchangeResponse.data.data.attributes.token);
        return true;
    }

    throw new Error('Unable to get tenancy token');
};

export default HTTP;
