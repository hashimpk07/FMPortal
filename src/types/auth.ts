export interface TenancyOptionsProps {
    id: string;
    name: string;
    key: string;
}

export interface UserProps {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenancy: TenancyOptionsProps;
    attributes?: {
        name: string;
        email: string;
    };
}
