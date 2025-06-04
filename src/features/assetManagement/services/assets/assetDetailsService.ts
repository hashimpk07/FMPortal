import {
    fetchAssetDetails,
    enrichAssetsWithIncluded,
    fetchAssetOperationalSummary,
    fetchAssetGroupDetails,
    fetchAssetGroupsList,
} from './assetService';
import fetchTagsList from '../tagService';
import fetchDocumentsList from '../documentService';
import type { Asset } from '../types';
import useAssetManagementStore from '../../store/assetManagementStore';

/**
 * Fetches the details of a selected asset and stores it in the global store
 * @param assetId The ID of the asset to fetch details for
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreAssetDetails(assetId: string): Promise<void> {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    const { setSelectedAssetLoading, setSelectedAssetError, setSelectedAssetDetails } =
        useAssetManagementStore.getState();

    try {
        setSelectedAssetLoading(true);

        const response = await fetchAssetDetails(assetId);

        // Store the response in the state
        setSelectedAssetDetails(response);
        setSelectedAssetError(null);

        return Promise.resolve();
    } catch (error) {
        console.error('Error fetching asset details:', error);
        setSelectedAssetError(error instanceof Error ? error.message : 'Unknown error occurred');
        return Promise.reject(error);
    } finally {
        setSelectedAssetLoading(false);
    }
}

/**
 * Fetches the operational summary of a selected asset and stores it in the global store
 * @param assetId The ID of the asset to fetch operational summary for
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreAssetOperationalSummary(assetId: string): Promise<void> {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    const { setOperationalSummaryLoading, setOperationalSummaryError, setAssetOperationalSummary } =
        useAssetManagementStore.getState();

    try {
        setOperationalSummaryLoading(true);

        const response = await fetchAssetOperationalSummary(assetId);

        // Store the response in the state
        setAssetOperationalSummary(response);
        setOperationalSummaryError(null);

        return Promise.resolve();
    } catch (error) {
        console.error('Error fetching asset operational summary:', error);
        setOperationalSummaryError(
            error instanceof Error ? error.message : 'Unknown error occurred',
        );
        return Promise.reject(error);
    } finally {
        setOperationalSummaryLoading(false);
    }
}

/**
 * Fetches both the asset details and operational summary in parallel
 * @param assetId The ID of the asset to fetch data for
 * @returns Promise that resolves when both fetches are complete
 */
export async function fetchAllAssetData(assetId: string): Promise<void> {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    try {
        await Promise.all([
            fetchAndStoreAssetDetails(assetId),
            fetchAndStoreAssetOperationalSummary(assetId),
        ]);

        return Promise.resolve();
    } catch (error) {
        console.error('Error fetching asset data:', error);
        return Promise.reject(error);
    }
}

/**
 * Resets the selected asset state in the store
 */
export function resetSelectedAssetData(): void {
    const { resetSelectedAsset } = useAssetManagementStore.getState();
    resetSelectedAsset();
}

/**
 * Helper to get enriched asset data from the store
 * @returns The enriched asset from the store, if available
 */
export function getEnrichedSelectedAsset(): Asset | null {
    const { selectedAssetDetails } = useAssetManagementStore.getState();

    if (!selectedAssetDetails) {
        return null;
    }

    // Enrich the asset with included data
    const enrichedAssets = enrichAssetsWithIncluded(
        [selectedAssetDetails.data],
        selectedAssetDetails.included,
    );

    return enrichedAssets.length > 0 ? enrichedAssets[0] : null;
}

/**
 * Fetches the details of a selected asset group and stores it in the global store
 * @param assetGroupId The UUID of the asset group to fetch details for
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreAssetGroupDetails(assetGroupId: string): Promise<void> {
    if (!assetGroupId) {
        throw new Error('Asset group UUID is required');
    }

    const { setAssetGroupLoading, setAssetGroupError, setAssetGroupDetails } =
        useAssetManagementStore.getState();

    setAssetGroupLoading(true);

    try {
        // Get the selectedCentreId from the store
        const { selectedCentreId } = useAssetManagementStore.getState();

        if (!selectedCentreId) {
            throw new Error('Centre ID is required to fetch asset group details');
        }

        const response = await fetchAssetGroupDetails(assetGroupId, {
            centreId: String(selectedCentreId),
        });
        setAssetGroupDetails(response);
        setAssetGroupError(null);
    } catch (error) {
        console.error('Error fetching asset group details:', error);

        // Fail silently - don't set an error message
        setAssetGroupError(null);

        // Set a null response - UI component will handle showing "No group details found"
        setAssetGroupDetails(null);
    } finally {
        setAssetGroupLoading(false);
    }
}

/**
 * Fetches the list of tags and stores them in the global store
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreTagsList(): Promise<void> {
    const { tagsLoading, tags } = useAssetManagementStore.getState();

    // Don't fetch if already loading or if we have tags
    if (tagsLoading || tags.length > 0) {
        return;
    }

    const { setTagsLoading, setTagsError, setTags } = useAssetManagementStore.getState();

    try {
        setTagsLoading(true);
        const response = await fetchTagsList();
        setTags(response.data);
        setTagsError(null);
    } catch (error) {
        console.error('Error fetching tags:', error);
        setTagsError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
        setTagsLoading(false);
    }
}

/**
 * Fetches the list of documents and stores them in the global store
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreDocumentsList(): Promise<void> {
    const { documentsLoading, documents } = useAssetManagementStore.getState();

    // Don't fetch if already loading or if we have documents
    if (documentsLoading || documents.length > 0) {
        return;
    }

    const { setDocumentsLoading, setDocumentsError, setDocuments } =
        useAssetManagementStore.getState();

    try {
        setDocumentsLoading(true);
        const response = await fetchDocumentsList();
        setDocuments(response.data);
        setDocumentsError(null);
    } catch (error) {
        console.error('Error fetching documents:', error);
        setDocumentsError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
        setDocumentsLoading(false);
    }
}

/**
 * Fetches the list of asset groups and stores them in the global store
 * @param centreId The centre ID to fetch asset groups for
 * @returns Promise that resolves when the fetch is complete
 */
export async function fetchAndStoreAssetGroupsList(centreId: string | number): Promise<void> {
    if (!centreId) {
        throw new Error('Centre ID is required');
    }

    const { assetGroupsLoading } = useAssetManagementStore.getState();

    // Don't fetch if already loading
    if (assetGroupsLoading) {
        return;
    }

    const { setAssetGroupsLoading, setAssetGroupsError, setAssetGroups } =
        useAssetManagementStore.getState();

    try {
        setAssetGroupsLoading(true);
        const response = await fetchAssetGroupsList({ centreId: String(centreId) });

        // The response already has the correct format as it comes directly from the API
        setAssetGroups(response.data);
        setAssetGroupsError(null);
    } catch (error) {
        console.error('Error fetching asset groups:', error);
        setAssetGroupsError(error instanceof Error ? error.message : 'Failed to load asset groups');
    } finally {
        setAssetGroupsLoading(false);
    }
}

/**
 * Fetches maintenance plans assigned to an asset
 * @param assetId The ID of the asset to fetch assigned maintenance plans for
 * @returns Promise that resolves with the assigned maintenance plans
 */
export async function fetchAssignedMainteancePlansToAsset(assetId: string) {
    if (!assetId) {
        throw new Error('Asset ID is required');
    }

    return {
        data: [
            {
                id: 'id',
                attributes: {
                    name: 'Testing #1',
                    frequency: 'monthly',
                    next_date_at: '2025-05-15T14:51:08.000Z',
                },
            },
            {
                id: 'id-2',
                attributes: {
                    name: 'Testing #2',
                    frequency: 'yearly',
                    next_date_at: '2026-01-08T17:51:08.000Z',
                },
            },
        ],
    };
}

const AssetDetailsService = {
    fetchAndStoreAssetDetails,
    fetchAndStoreAssetOperationalSummary,
    fetchAllAssetData,
    resetSelectedAssetData,
    getEnrichedSelectedAsset,
    fetchAndStoreAssetGroupDetails,
    fetchAndStoreTagsList,
    fetchAndStoreDocumentsList,
    fetchAndStoreAssetGroupsList,
};

export default AssetDetailsService;
