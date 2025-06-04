import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import fetchData from './fetchData';
import AssetService from '../features/assetManagement/services/assets/assetService';
import type {
    FetchAssetsParams,
    AssetsListResponse,
} from '../features/assetManagement/services/types';

enum AssetStatus {
    OPERATIONAL = 'operational',
    PENDING_REPAIR = 'pending_repair',
    MISSING = 'missing',
    OUT_OF_SERVICE = 'out_of_service',
}

const getAllAssetGroups: any = async (centreId: number) => {
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: [],
            mapping: {},
        },
        filterList: [`[centreId]=${centreId}`],
        path: '/assets/groups/tree',
    });

    return data;
};

const getAssetGroupFullDetails: any = async (assetGroupId: string) => {
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['assets', 'children'],
            mapping: {},
        },
        path: `/assets/groups/${assetGroupId}`,
    });

    return data;
};

// Legacy function - use AssetManagementService.fetchAssetsList instead
const getAssets: any = async (centreId: number, page = 1, search = '') => {
    let path = `/assets?page[number]=${page}`;

    if (search) {
        path += `&filter[search]=${search}`;
    }

    return genericFetchEndpoint({
        filterList: [`[centreid]=${centreId}`],
        path: path,
    });
};

const createAssetGroup = async (data: any) => {
    const a = await fetchData({
        partialPath: '/assets/groups',
        stringifiedBody: JSON.stringify(data),
        method: 'POST',
    });

    // @TODO HANDLE ERRORS!

    return a;
};

const editAssetGroup = async (data: any, id: string) => {
    // @TODO HANDLE ERRORS!

    return fetchData({
        partialPath: `/assets/groups/${id}`,
        stringifiedBody: JSON.stringify(data),
        method: 'PATCH',
    });
};

const deleteAssetGroup = async (id: string) => {
    // @TODO HANDLE ERRORS!

    return fetchData({
        partialPath: `/assets/groups/delete`,
        stringifiedBody: JSON.stringify({
            data: {
                type: 'asset-group-delete',
                relationships: {
                    groups: {
                        data: [
                            {
                                type: 'asset-group',
                                id: id,
                            },
                        ],
                    },
                },
            },
        }),
        method: 'POST',
    });
};

export {
    getAllAssetGroups,
    getAssetGroupFullDetails,
    getAssets,
    createAssetGroup,
    editAssetGroup,
    deleteAssetGroup,
    AssetStatus,
    AssetService,
};

// Re-export types
export type { FetchAssetsParams, AssetsListResponse };
