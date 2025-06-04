import fetchData from '../../../../services/fetchData';
import { API_BASE_URL, API_VERSION } from '../../../../constants/api';
import type { AssetGroupDetailResponse, FetchAssetGroupDetailsParams, AssetGroup } from '../types';
import * as queryParams from '../../../../utils/api/helpers/queryParams';

/**
 * Fetches the details of a specific asset group
 * @param assetGroupUuid The UUID of the asset group to fetch
 * @param params Optional parameters for the request
 * @returns Promise with the asset group detail response
 */
export async function fetchAssetGroupDetails(
    assetGroupUuid: string,
    params: Omit<FetchAssetGroupDetailsParams, 'centreId'> & { centreId: string },
): Promise<AssetGroupDetailResponse> {
    if (!assetGroupUuid) throw new Error('assetGroupUuid is required');
    const {
        include = ['parent', 'children', 'assets', 'centre'],
        centreId,
        parentFields = ['createdAt'],
        assetFields = ['description'],
        childrenFields = ['depth'],
        centreFields = [],
        assetGroupFields = ['name'],
    } = params;
    if (!centreId) throw new Error('centreId is required');

    const urlParams = new URLSearchParams();

    queryParams.appendArrayIfNotEmpty(urlParams, 'include', include);
    queryParams.appendIfExists(urlParams, 'filter[centreId]', centreId);

    queryParams.appendFields(urlParams, {
        parent: parentFields,
        asset: assetFields,
        children: childrenFields,
        centre: centreFields,
        'asset-group': assetGroupFields,
    });

    const url = `${API_BASE_URL}/${API_VERSION}/assets/groups/${assetGroupUuid}?${urlParams.toString()}`;
    try {
        const response = await fetchData({ path: url });
        return response as AssetGroupDetailResponse;
    } catch (error) {
        console.error('Error fetching asset group details:', error);
        throw error;
    }
}

/**
 * Fetches the list of asset groups
 * @param params Optional parameters for the request
 * @returns Promise with the asset groups response
 */
export async function fetchAssetGroupsList(
    params: {
        centreId?: string;
        page?: number;
        pageSize?: number;
    } = {},
): Promise<{ data: AssetGroup[] }> {
    const { centreId, page = 1, pageSize = 100 } = params;

    const urlParams = new URLSearchParams();

    queryParams.appendIfExists(urlParams, 'filter[centreId]', centreId);
    queryParams.appendPagination(urlParams, page, pageSize);

    const url = `${API_BASE_URL}/${API_VERSION}/assets/groups?${urlParams.toString()}`;
    try {
        const response = await fetchData({ path: url });
        return response as { data: AssetGroup[] };
    } catch (error) {
        console.error('Error fetching asset groups list:', error);
        throw error;
    }
}
