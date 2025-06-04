declare global {
    interface GenericFetchEndpointData {
        aggData: JsonApiResponseData[];
        lists: any[] | null | Record<string, Record<string, string>[]>;
        dicts: any | null;
        meta: any | null;
        errors: string | null;
        combinedData: any[] | null;
    }
}

export {};
