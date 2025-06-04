import mapToPlainObject from './helpers/mapToPlainObject';
import walkEndpoint from './helpers/walkEndpoint';
import fetchData from './helpers/fetchData';
import populateRelationships from './helpers/populateRelationships';

interface GenericFetchEndpointProps {
    includeListAndMapping?:
        | { includes: string[]; mapping: Record<string, string | string[]> }
        | undefined;
    filterList?: string[];
    path: string;
    useWalkEndpoint?: boolean;
}

interface GenericFetchEndpoint {
    aggData: any[] | null;
    lists: any[] | null | Record<string, Record<string, string>[]>;
    dicts: any | null;
    meta: any | null;
    errors: string | null;
    combinedData: any[] | null;
}

const genericFetchEndpoint = async ({
    includeListAndMapping,
    filterList,
    path,
    useWalkEndpoint = true,
}: GenericFetchEndpointProps): Promise<GenericFetchEndpoint> => {
    const includes = includeListAndMapping?.includes || [];
    const includesMapping = includeListAndMapping?.mapping || {};

    const filters = filterList || ([] as string[]);

    let queryString = `${filters.length ? `&filter${filters.join('&filter')}` : ''}`;

    if (includes.length > 0) {
        queryString += `${queryString !== '' ? '' : '&'}&include=${includes.join('%2C')}`;
    }
    queryString = queryString.substring(1);

    let aggData: any[];
    let typeMap: any;
    let meta: any;

    try {
        if (useWalkEndpoint) {
            const { aggData: resAddData, typeMap: resTypeMap }: any = await walkEndpoint({
                path,
                queryString,
            });

            aggData = resAddData;
            typeMap = resTypeMap;
        } else {
            const {
                data,
                typeMap: fetchTypeMap,
                error,
                meta: fetchMeta,
            } = await fetchData({
                path: path,
                queryString,
                includeTypeMap: true,
            });

            if (error) {
                return {
                    errors: error,
                    aggData: null,
                    meta: null,
                    lists: null,
                    dicts: null,
                    combinedData: null,
                };
            }

            aggData = [data];
            typeMap = fetchTypeMap;
            meta = fetchMeta;
        }

        const dicts = includes.reduce(
            (acc, include) => {
                const includeMapping = includesMapping[include];

                const mappingsArray = Array.isArray(includeMapping)
                    ? includeMapping
                    : [includeMapping];

                mappingsArray.forEach((dictKey) => {
                    acc[dictKey] = mapToPlainObject({
                        jsMap: typeMap,
                        mapKey: dictKey,
                    });
                });

                return acc;
            },
            {} as Record<string, Record<string, unknown>>,
        );

        const lists = includes.reduce(
            (acc, include) => {
                const includeMapping = includesMapping[include];
                const mappingsArray = Array.isArray(includeMapping)
                    ? includeMapping
                    : [includeMapping];

                mappingsArray.forEach((listKey) => {
                    acc[listKey] = Object.entries(dicts[listKey as keyof typeof dicts]).map(
                        ([id, form]) => ({
                            id,
                            ...(typeof form === 'object' && form !== null ? form : {}),
                        }),
                    );
                });
                return acc;
            },
            {} as Record<string, Record<string, string>[]>,
        );

        const populatedRelationships = populateRelationships({
            aggData,
            includesMapping,
            dicts,
        });

        return {
            aggData: useWalkEndpoint ? aggData : aggData?.[0],
            lists,
            dicts,
            meta,
            errors: null,
            combinedData: populatedRelationships,
        };
    } catch (error) {
        console.error(error);
        const errorObject = error as Error;

        return {
            aggData: null,
            lists: null,
            dicts: null,
            meta,
            errors: errorObject.message,
            combinedData: null,
        };
    }
};

export default genericFetchEndpoint;
