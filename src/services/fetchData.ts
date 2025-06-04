import HTTP from '../utils/api/helpers/axios';
import apiRequestHeaders from './apiRequestHeaders';
import urlContainsQueryString from '../utils/urlContainsQueryString';
import { API_BASE_URL, API_VERSION } from '../constants';

interface FetchDataProps {
    path?: string;
    partialPath?: string;
    queryString?: string;
    signal?: AbortSignal;
    method?: string;
    stringifiedBody?: string | any;
}

const fetchData = async ({
    path,
    partialPath,
    queryString = '',
    signal,
    method = 'GET',
    stringifiedBody,
}: FetchDataProps) => {
    let startOrAppendQuery;

    if (path) {
        startOrAppendQuery = !urlContainsQueryString(path) ? '?' : '&';
    }

    if (partialPath) {
        startOrAppendQuery = !urlContainsQueryString(partialPath) ? '?' : '&';
    }

    const fullPath = `${path}${startOrAppendQuery}${queryString}`;

    let configuredPath;

    if (partialPath) {
        configuredPath = `${API_BASE_URL}/${API_VERSION}${partialPath}${startOrAppendQuery}${queryString}`;
    }

    const apiPath = configuredPath || fullPath;

    interface FetchParamsProps {
        url: string;
        method: string;
        headers: typeof apiRequestHeaders;
        signal?: AbortSignal;
        data?: string;
    }

    let fetchParams: FetchParamsProps = {
        url: apiPath,
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

            return response.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
};

export default fetchData;
