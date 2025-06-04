declare module '@mallcomm/portals-auth' {
    export const userStore: () => {
        userType: string;
        stateChallenge: string;
        pkceCodeVerifier: string;
        authToken: string;
        refreshAuthToken: string;
        tenancyKey: string | null;
        gatewayAuthToken: string | null;
        gatewayAuthUser: string | null;
        tenancy: any | null;
        userDetails: any | null;
        setUserType: (userType: string) => void;
        setStateChallenge: (stateChallenge: string) => void;
        setPkceCodeVerifier: (pkceCodeVerifier: string) => void;
        setAuthToken: (authToken: string) => void;
        setRefreshAuthToken: (refreshAuthToken: string) => void;
        setTenancyKey: (tenancyKey: string) => void;
        setGatewayAuthToken: (gatewayAuthToken: string) => void;
        setGatewayAuthUser: (gatewayAuthUser: string) => void;
        setTenancy: (tenancy: any) => void;
        setUserDetails: (userDetails: any) => void;
        resetAuthState: () => void;
    };

    export function setupAuth(config: any): void;
    export function useAxiosInterceptor(): void;
    export function SelectTenancy(props: any): JSX.Element;
}
