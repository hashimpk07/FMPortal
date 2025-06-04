import buildApiIncludedMap from './includedKeysMap';
import fetchData from './fetchData';
import fetchPage from './fetchPage';

const ERR_WEP001 = 'WEP001';
const ERR_WEP002 = 'WEP002';
const ERR_WEP003 = 'WEP003';

const possibleErrors = new Map();

possibleErrors.set(ERR_WEP001, `${ERR_WEP001}: No path to walk`);
possibleErrors.set(ERR_WEP002, `${ERR_WEP002}: Path error when walking endpoint`);
possibleErrors.set(ERR_WEP003, `${ERR_WEP003}: API Call error:`);

let typeMap = new Map<string, Map<string, any>>();
let previousURL: string = '';

const walkEndpoint = async ({
    path,
    queryString,
    aggData = [],
    signal,
    firstRun = true,
}: any): Promise<any> => {
    if (firstRun) {
        typeMap = new Map();
        previousURL = '';
    }

    if (!path) {
        return {
            error: possibleErrors.get(ERR_WEP001),
            aggData: [],
            typeMap: new Map(),
        };
    }

    if (previousURL === path) {
        return {
            error: possibleErrors.get(ERR_WEP002),
            aggData: [],
            typeMap: new Map(),
        };
    }

    let responseJson;

    try {
        responseJson = (await fetchData({
            path,
            queryString,
            signal,
        })) as any;
    } catch (error) {
        if (signal?.aborted) {
            return {
                error: 'Request cancelled',
                aggData: [],
                typeMap: new Map(),
            };
        }

        return {
            error: `${possibleErrors.get(ERR_WEP003)} ${(error as Error).message}`,
            aggData: [],
            typeMap: new Map(),
        };
    }

    const { data, included, meta } = responseJson;

    const lastPage = meta?.last_page || 1;

    const updatedAggData = [...aggData, ...data?.data];

    buildApiIncludedMap({ included: Object.values(included), typeMap });

    const pageRequests = [];

    for (let page = 2; page <= lastPage; page++) {
        pageRequests.push(fetchPage({ page, path, queryString, signal }));

        await new Promise((f) => setTimeout(f, 50));
    }

    const pageResponses = await Promise.allSettled(pageRequests);

    pageResponses.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
            const responseData = result.value.data?.data;

            const responseIncluded = result.value?.data?.included;

            updatedAggData.push(...responseData);

            buildApiIncludedMap({ included: responseIncluded, typeMap });
        }
    });

    return {
        aggData: updatedAggData,
        typeMap,
        error: null,
        loading: false,
    };
};

export default walkEndpoint;
