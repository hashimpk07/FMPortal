import HTTP from './axios';
import apiRequestHeaders from './apiRequestHeaders';
import { API_BASE_URL, API_VERSION, GET } from '../../../constants/api';

export interface FetchData {
    data: any;
    meta: any;
    included: any;
    typeMap: any;
    error: string | undefined;
}

interface FetchDataProps {
    path?: string;
    queryString?: string;
    signal?: AbortSignal;
    method?: string;
    stringifiedBody?: string | any;
    includeTypeMap?: boolean;
}

const fetchData = async ({
    path,
    queryString = '',
    signal,
    method = GET,
    stringifiedBody,
    includeTypeMap,
}: FetchDataProps): Promise<FetchData> => {
    let startOrAppendQuery;

    const hasQuery = path?.indexOf('?') !== -1;

    if (path) {
        startOrAppendQuery = !hasQuery ? '?' : '&';
    }

    const fullPath = `${API_BASE_URL}/${API_VERSION}${path}${startOrAppendQuery}${queryString}`;

    interface FetchParamsProps {
        url: string;
        method: string;
        headers: typeof apiRequestHeaders;
        signal?: AbortSignal;
        data?: string;
    }

    let fetchParams: FetchParamsProps = {
        url: fullPath,
        method,
        headers: apiRequestHeaders,
        signal,
    };

    if (stringifiedBody) {
        fetchParams = {
            ...fetchParams,
            data: stringifiedBody,
        };
    }

    return HTTP({
        ...fetchParams,
    })
        .then((response) => {
            if (response.status === 422) {
                throw new Error('Invalid data');
            }

            if (includeTypeMap) {
                let typeMap = new Map<string, Map<string, any>>();

                const { data } = response;

                data?.included?.forEach((item: any) => {
                    const { type, id, attributes, relationships } = item;

                    if (!typeMap.has(type)) {
                        typeMap.set(type, new Map<string, any>());
                    }

                    typeMap.get(type)!.set(id, { ...attributes, relationships });
                });

                const returnData = {
                    data: data?.data,
                    included: data?.included,
                    typeMap,
                    meta: data?.meta,
                    error: undefined,
                };

                return returnData;
            }

            return {
                data: response.data,
                meta: response.data.meta,
                included: {},
                typeMap: {},
                error: undefined,
            };
        })
        .catch((error: Error) => {
            return {
                error: error.message,
                included: [],
                data: [],
                typeMap: new Map(),
                meta: {},
            };
        });
};

export default fetchData;
