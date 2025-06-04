/**
 * Asset Service - Consolidated service for all asset-related API operations
 * This file combines functionality from the previous assetApiService.ts and assetManagementService.ts
 */

import { AxiosError } from 'axios';
import HTTP from '../../../../utils/api/helpers/axios';
import apiRequestHeaders from '../../../../services/apiRequestHeaders';
import { API_BASE_URL, API_VERSION } from '../../../../constants/api';
import fetchData from '../../../../services/fetchData';

import type {
    Asset,
    AssetTag,
    AssetCentre,
    AssetGroup,
    AssetsListResponse,
    AssetDetailResponse,
    AssetOperationalSummaryResponse,
    AssetGroupDetailResponse,
    FetchAssetsParams,
    FetchAssetGroupDetailsParams,
    TagsResponse,
    DocumentsResponse,
    Location,
    LocationOption,
    LocationsResponse,
} from '../types';

// Export types that are used by other modules
export type {
    Asset,
    AssetTag,
    AssetCentre,
    AssetGroup,
    AssetsListResponse,
    AssetDetailResponse,
    AssetOperationalSummaryResponse,
    AssetGroupDetailResponse,
    FetchAssetsParams,
    FetchAssetGroupDetailsParams,
    TagsResponse,
    DocumentsResponse,
    Location,
    LocationOption,
    LocationsResponse,
};

export interface TimeBreakdown {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    percentage: number;
}

export interface AssetOperationalSummary {
    type: string;
    id: string;
    attributes: {
        operational: TimeBreakdown;
        non_operational: TimeBreakdown;
        total_days: number;
    };
    links: {
        self: string;
        asset: string;
        detailed: string;
    };
}

export interface SortField {
    field: string;
    direction: 'asc' | 'desc';
}

/**
 * Processes included data to enrich assets with related entities
 * @param assets The assets to be enriched
 * @param included The included data from the API response
 * @returns The enriched assets with related entities attached
 */
export function enrichAssetsWithIncluded(
    assets: Asset[] = [],
    included: Array<AssetTag | AssetCentre | AssetGroup> = [],
): Asset[] {
    if (!assets || !Array.isArray(assets)) return [];
    if (!included || !Array.isArray(included)) return assets;

    // Create a map of included items by type and ID for faster lookup
    const includedMap = new Map<string, Map<string, AssetTag | AssetCentre | AssetGroup>>();

    included.forEach((item) => {
        if (!includedMap.has(item.type)) {
            includedMap.set(item.type, new Map());
        }
        includedMap.get(item.type)?.set(item.id, item);
    });

    // Enrich each asset with the included data
    return assets.map((asset) => {
        const enrichedAsset = { ...asset };

        // Add centre data if available
        if (asset.relationships?.centre?.data) {
            const { type, id } = asset.relationships.centre.data;
            const centreMap = includedMap.get(type);
            if (centreMap && centreMap.has(id)) {
                enrichedAsset.centre = centreMap.get(id) as AssetCentre;
            }
        }

        // Add tags data if available
        if (asset.relationships?.tags?.data?.length) {
            enrichedAsset.tags = asset.relationships.tags.data
                .map((tag) => {
                    const tagMap = includedMap.get(tag.type);
                    return tagMap?.get(tag.id) as AssetTag;
                })
                .filter(Boolean);
        }

        // Add assetGroup data if available
        if (asset.relationships?.assetGroup?.data) {
            const { type, id } = asset.relationships.assetGroup.data;
            const assetGroupMap = includedMap.get(type);
            if (assetGroupMap && assetGroupMap.has(id)) {
                enrichedAsset.assetGroup = assetGroupMap.get(id) as AssetGroup;
            }
        }

        return enrichedAsset;
    });
}

/**
 * Formats validation errors from the API response
 * @param errors Array of error objects from the API
 * @returns Formatted error message
 */
function formatValidationErrors(errors: Array<{ detail: string }>): string {
    if (!errors?.length) return 'Validation error occurred';
    return errors.map((error) => error.detail).join('. ');
}

/**
 * Fetches the list of assets based on the provided parameters
 * @param params Parameters for fetching assets
 * @returns Promise with the assets list response
 */
export async function fetchAssetsList({
    centreId,
    assetGroupId,
    search = '',
    status = '',
    page = 1,
    pageSize = 10,
    include = ['assetGroup', 'tags', 'centre'],
    sort = [],
}: FetchAssetsParams): Promise<AssetsListResponse> {
    if (!centreId) throw new Error('centreId is required');

    const queryParams = new URLSearchParams();
    queryParams.append('filter[centreId]', centreId);
    if (assetGroupId) queryParams.append('filter[assetGroupId]', assetGroupId);
    if (status) queryParams.append('filter[status]', status);
    if (search) queryParams.append('filter[search]', search);

    queryParams.append('page[number]', page.toString());
    queryParams.append('page[size]', pageSize.toString());

    if (include.length > 0) queryParams.append('include', include.join(','));

    if (sort.length > 0) {
        const sortParams = sort.map(
            (field) => `${field.direction === 'desc' ? '-' : ''}${field.field}`,
        );
        queryParams.append('sort', sortParams.join(','));
    }

    const url = `${API_BASE_URL}/${API_VERSION}/assets?${queryParams.toString()}`;

    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as AssetsListResponse;
    } catch (error) {
        console.error('Error fetching assets list:', error);

        if (error instanceof AxiosError) {
            // Handle validation errors (422)
            if (error.response?.status === 422) {
                const validationMessage = formatValidationErrors(error.response.data?.errors);
                throw new Error(`Validation Error: ${validationMessage}`);
            }

            // Handle other HTTP errors with response
            if (error.response) {
                throw new Error(
                    `Server Error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`,
                );
            }

            // Handle network errors
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Network Error: Unable to connect to the server');
            }

            // Handle timeout errors
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout: The server took too long to respond');
            }
        }

        throw error;
    }
}

/**
 * Fetches the details of a specific asset
 * @param assetId The ID of the asset to fetch
 * @param include Array of related entities to include
 * @returns Promise with the asset detail response
 */
export async function fetchAssetDetails(
    assetId: string,
    include: string[] = ['centre', 'tags', 'assetGroup'],
): Promise<AssetDetailResponse> {
    if (!assetId) throw new Error('assetId is required');

    const queryParams = new URLSearchParams();
    if (include.length > 0) queryParams.append('include', include.join(','));

    const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}?${queryParams.toString()}`;

    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as AssetDetailResponse;
    } catch (error) {
        console.error('Error fetching asset details:', error);
        throw error;
    }
}

/**
 * Creates a new asset
 * @param assetData The asset data to create
 * @returns Promise with the created asset response
 */
export async function createAsset(assetData: Omit<Asset, 'id'>): Promise<AssetDetailResponse> {
    const url = `${API_BASE_URL}/${API_VERSION}/assets`;
    const payload = createAssetPayload('', assetData);

    try {
        const response = await HTTP({
            url,
            method: 'POST',
            headers: apiRequestHeaders,
            data: payload,
        });
        return response.data as AssetDetailResponse;
    } catch (error) {
        console.error('Error creating asset:', error);

        if (error instanceof AxiosError && error.response?.status === 422) {
            throw new Error(
                `Validation Error: ${formatValidationErrors(error.response.data?.errors)}`,
            );
        }
        throw error;
    }
}

/**
 * Updates an existing asset
 * @param assetId The ID of the asset to update
 * @param assetData The asset data to update
 * @returns Promise with the updated asset response
 */
export async function updateAsset(
    assetId: string,
    assetData: Partial<Asset>,
): Promise<AssetDetailResponse> {
    if (!assetId) throw new Error('assetId is required');

    const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}`;
    const payload = createAssetPayload(assetId, assetData);

    try {
        const response = await HTTP({
            url,
            method: 'PATCH',
            headers: apiRequestHeaders,
            data: payload,
        });
        return response.data as AssetDetailResponse;
    } catch (error) {
        console.error('Error updating asset:', error);

        if (error instanceof AxiosError && error.response?.status === 422) {
            throw new Error(
                `Validation Error: ${formatValidationErrors(error.response.data?.errors)}`,
            );
        }
        throw error;
    }
}

/**
 * Deletes an asset by its UUID
 * @param assetUuid The UUID of the asset to delete
 * @returns Promise that resolves when the asset is successfully deleted
 */
export async function deleteAsset(assetUuid: string): Promise<void> {
    if (!assetUuid) throw new Error('assetUuid is required');

    const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetUuid}`;

    try {
        await HTTP({ url, method: 'DELETE', headers: apiRequestHeaders });
    } catch (error) {
        console.error('Error deleting asset:', error);

        if (error instanceof AxiosError) {
            // Handle validation errors (422)
            if (error.response?.status === 422) {
                const validationMessage = formatValidationErrors(error.response.data?.errors);
                throw new Error(`Validation Error: ${validationMessage}`);
            }

            // Handle not found error (404)
            if (error.response?.status === 404) {
                throw new Error(
                    `Asset not found: The asset with UUID ${assetUuid} does not exist or was already deleted`,
                );
            }

            // Handle other HTTP errors with response
            if (error.response) {
                throw new Error(
                    `Server Error (${error.response.status}): ${error.response.data?.message || 'Unknown error'}`,
                );
            }

            // Handle network errors
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Network Error: Unable to connect to the server');
            }

            // Handle timeout errors
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout: The server took too long to respond');
            }
        }

        throw error;
    }
}

/**
 * Creates the proper payload format for asset API requests
 * @param assetId The ID of the asset (can be empty for create operations)
 * @param assetData The asset data
 * @returns The formatted payload
 */
export function createAssetPayload(assetId: string, assetData: Partial<Asset>) {
    const { attributes } = assetData;
    if (!attributes) return null;

    // Create a copy of attributes without the contractor field
    const { contractor, ...attributesWithoutContractor } = attributes;

    const payload = {
        data: {
            type: 'asset',
            id: assetId,
            attributes: {
                name: attributesWithoutContractor.name,
                description: attributesWithoutContractor.description,
                serialNumber: attributesWithoutContractor.serialNumber,
                purchaseCost: attributesWithoutContractor.purchaseCost,
                estimatedValue: attributesWithoutContractor.estimatedValue,
                depreciationRate: attributesWithoutContractor.depreciationRate,
                warrantyExpiresAt: attributesWithoutContractor.warrantyExpiresAt,
                estimatedLifetime: attributesWithoutContractor.estimatedLifetime,
                status: attributesWithoutContractor.status,
                locations: attributesWithoutContractor.locations,
                tags: attributesWithoutContractor.tags,
                documents: attributesWithoutContractor.documents,
                mediaId: attributesWithoutContractor.mediaId,
            },
            relationships: {
                ...assetData.relationships,
                ...(contractor && contractor.id
                    ? {
                          contractor: {
                              data: {
                                  type: 'contractor',
                                  id: contractor.id,
                              },
                          },
                      }
                    : {}),
            },
        },
    };

    Object.keys(payload.data.attributes).forEach((key) => {
        const attributes = payload.data.attributes as Record<string, unknown>;
        if (attributes[key] === undefined) delete attributes[key];
    });

    return payload;
}

/**
 * Fetches the operational summary of a specific asset
 * @param assetId The ID of the asset to fetch the operational summary for
 * @returns Promise with the asset operational summary response
 */
export async function fetchAssetOperationalSummary(
    assetId: string,
): Promise<AssetOperationalSummaryResponse> {
    if (!assetId) throw new Error('assetId is required');

    const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}`;
    // const url = `${API_BASE_URL}/${API_VERSION}/assets/${assetId}/operational-summary`;

    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as AssetOperationalSummaryResponse;
    } catch (error) {
        console.error('Error fetching asset operational summary:', error);
        throw error;
    }
}

/**
 * Fetches the details of a specific asset group
 * @param assetGroupUuid The UUID of the asset group to fetch
 * @param params Optional parameters for the request
 * @returns Promise with the asset group detail response
 */
export async function fetchAssetGroupDetails(
    assetGroupUuid: string,
    params: FetchAssetGroupDetailsParams = {},
): Promise<AssetGroupDetailResponse> {
    if (!assetGroupUuid) {
        throw new Error('assetGroupUuid is required');
    }

    const {
        include = ['parent', 'children', 'assets', 'centre'],
        centreId = '1',
        parentFields = ['createdAt'],
        assetFields = ['description'],
        childrenFields = ['depth'],
        centreFields = [],
        assetGroupFields = ['name'],
    } = params;

    const queryParams = new URLSearchParams();

    if (include.length > 0) {
        queryParams.append('include', include.join(','));
    }

    if (centreId) {
        queryParams.append('filter[centreId]', centreId);
    }

    if (parentFields.length > 0) {
        queryParams.append('fields[parent]', parentFields.join(','));
    }

    if (assetFields.length > 0) {
        queryParams.append('fields[asset]', assetFields.join(','));
    }

    if (childrenFields.length > 0) {
        queryParams.append('fields[children]', childrenFields.join(','));
    }

    if (centreFields.length > 0) {
        queryParams.append('fields[centre]', centreFields.join(','));
    }

    if (assetGroupFields.length > 0) {
        queryParams.append('fields[asset-group]', assetGroupFields.join(','));
    }

    const url = `${API_BASE_URL}/${API_VERSION}/assets/groups/${assetGroupUuid}?${queryParams.toString()}`;

    try {
        const response = await fetchData({
            path: url,
        });

        return response as AssetGroupDetailResponse;
    } catch (error) {
        console.error('Error fetching asset group details:', error);
        throw error;
    }
}

/**
 * Fetches the list of available tags
 * @returns Promise with the tags response
 */
export async function fetchTagsList(): Promise<TagsResponse> {
    // TODO: Replace with actual endpoint when available
    console.log('Fetching tags...');
    return { data: [], meta: { count: 0 } };
}

/**
 * Fetches the list of documents
 * @param page Page number for pagination
 * @param pageSize Number of items per page
 * @returns Promise with the documents response
 */
export async function fetchDocumentsList(page = 1, pageSize = 20): Promise<DocumentsResponse> {
    const queryParams = new URLSearchParams({
        'page[number]': page.toString(),
        'page[size]': pageSize.toString(),
    });

    const url = `${API_BASE_URL}/${API_VERSION}/documents?${queryParams.toString()}`;

    try {
        const response = await HTTP({
            url,
            method: 'GET',
            headers: apiRequestHeaders,
        });

        return response.data as DocumentsResponse;
    } catch (error) {
        console.error('Error fetching documents list:', error);
        throw error;
    }
}

/**
 * Fetches the list of all asset groups
 * @param params Optional parameters like pagination, filtering, etc.
 * @returns Promise with the asset groups list response
 */
export async function fetchAssetGroupsList(
    params: {
        centreId?: string;
        page?: number;
        pageSize?: number;
    } = {},
): Promise<{ data: AssetGroup[] }> {
    const { centreId, page = 1, pageSize = 50 } = params;

    const queryParams = new URLSearchParams();

    // Add pagination
    queryParams.append('page[number]', page.toString());
    queryParams.append('page[size]', pageSize.toString());

    // Add centre filter if provided
    if (centreId) {
        queryParams.append('filter[centreId]', centreId);
    }

    const url = `${API_BASE_URL}/${API_VERSION}/assets/groups?${queryParams.toString()}`;

    try {
        const response = await HTTP({
            url,
            method: 'GET',
            headers: apiRequestHeaders,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching asset groups list:', error);
        throw error;
    }
}

/**
 * Fetches all locations with pagination handling
 * @param params Optional parameters for filtering locations
 * @returns Promise with all locations
 */
export async function fetchAllLocations(
    params: {
        centreId?: string;
    } = {},
): Promise<Location[]> {
    const allLocations: Location[] = [];
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await fetchLocationsList({
            ...params,
            page: currentPage,
            pageSize: 100, // Fetch maximum allowed per page
        });

        allLocations.push(...response.data);

        // Check if there's a next page
        hasNextPage = !!response.links.next;
        currentPage++;
    }

    return allLocations;
}

/**
 * Fetches a page of locations
 * @param params Parameters for fetching locations
 * @returns Promise with the locations response
 */
export async function fetchLocationsList({
    centreId,
    page = 1,
    pageSize = 10,
}: {
    centreId?: string;
    page?: number;
    pageSize?: number;
} = {}): Promise<LocationsResponse> {
    const queryParams = new URLSearchParams();

    // Add filters
    if (centreId) {
        queryParams.append('filter[centreId]', centreId);
    }

    // Add pagination
    queryParams.append('page[number]', page.toString());
    queryParams.append('page[size]', pageSize.toString());

    // Add includes
    queryParams.append('include', 'location-options,centre');

    const url = `${API_BASE_URL}/${API_VERSION}/locations?${queryParams.toString()}`;

    try {
        const response = await HTTP({
            url,
            method: 'GET',
            headers: apiRequestHeaders,
        });

        return response.data as LocationsResponse;
    } catch (error) {
        console.error('Error fetching locations list:', error);
        throw error;
    }
}

/**
 * Asset Service containing all API calls for asset management features
 */
const AssetService = {
    fetchAssetsList,
    enrichAssetsWithIncluded,
    fetchAssetDetails,
    fetchAssetOperationalSummary,
    fetchAssetGroupDetails,
    createAsset,
    updateAsset,
    deleteAsset,
    createAssetPayload,
    fetchTagsList,
    fetchDocumentsList,
    fetchAssetGroupsList,
    fetchAllLocations,
    fetchLocationsList,
};

export default AssetService;
