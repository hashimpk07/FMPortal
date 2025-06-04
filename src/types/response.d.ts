interface Attributes {
    name: string;
    [key: string]: string | number;
}

declare global {
    export interface MetaData {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    }

    export interface JsonApiResponseData {
        attributes: Attributes;
        id: string;
        type: string;
        relationships?: any;
        included?: any;
    }

    export interface JsonApiResponse {
        data: JsonApiResponseData[];
        meta: MetaData | null;
        errors?: string;
    }
}

export {};
