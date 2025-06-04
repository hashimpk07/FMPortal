import HTTP from '../../../utils/api/helpers/axios';
import apiRequestHeaders from '../../../services/apiRequestHeaders';
import { API_BASE_URL, API_VERSION } from '../../../constants/api';
import type { ContractorListResponse, Contractor } from './types';
import { useAssetManagementStore } from '../store/assetManagementStore';

interface FetchContractorsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    signal?: AbortSignal;
}

/**
 * Processes included data to enrich contractors with related entities
 * @param contractors The contractors to be enriched
 * @returns The enriched contractors with related entities attached
 */
export function enrichContractorsWithIncluded(contractors: Contractor[]): Contractor[] {
    if (!contractors || !Array.isArray(contractors)) return [];

    return contractors.map((contractor) => {
        // Just pass through the original contractor as the API already provides
        // the needed data at the top level
        return contractor;
    });
}

/**
 * Sorts contractors by name (companyName and name)
 * @param contractors Array of contractors to sort
 * @returns Sorted array of contractors
 */
export function sortContractorsByName(contractors: Contractor[]): Contractor[] {
    return [...contractors].sort((a, b) => {
        const aName = getContractorSortName(a);
        const bName = getContractorSortName(b);
        return aName.localeCompare(bName);
    });
}

/**
 * Helper function to get a standardized name for sorting
 * @param contractor The contractor to get the name from
 * @returns A string used for sorting
 */
function getContractorSortName(contractor: Contractor): string {
    const companyName = contractor.attributes?.companyName || '';
    const contactName = contractor.attributes?.name || '';

    // Use a combination of company and contact name, or whichever is available
    return `${companyName} ${contactName}`.trim().toLowerCase();
}

/**
 * Fetches all pages of contractors manually (not using paginatedApiService)
 * This is needed because the contractors API has a different pagination format
 * @param params Parameters for fetching contractors
 * @returns Array of contractors from all pages
 */
export async function fetchAllContractorsManually({
    pageSize = 50,
    search = '',
    signal,
}: Omit<FetchContractorsParams, 'page'>): Promise<Contractor[]> {
    try {
        // Fetch the first page to get pagination info
        const firstPageResponse = await fetchContractorsList({
            page: 1,
            pageSize,
            search,
            signal,
        });

        // Get total pages from the meta information
        const totalPages = firstPageResponse.meta.last_page;
        // Add first page data to our results
        const allContractors = [...firstPageResponse.data];

        // If there are more pages, fetch them all
        if (totalPages > 1) {
            const pagePromises: Promise<ContractorListResponse>[] = [];

            // Create promises for pages 2 to totalPages
            for (let page = 2; page <= totalPages; page++) {
                pagePromises.push(
                    fetchContractorsList({
                        page,
                        pageSize,
                        search,
                        signal,
                    }),
                );
            }

            // Wait for all pages to load
            const pageResults = await Promise.all(pagePromises);

            // Add all contractors from additional pages
            pageResults.forEach((response) => {
                allContractors.push(...response.data);
            });
        }

        // Sort contractors by name before returning
        return sortContractorsByName(allContractors);
    } catch (error) {
        if (signal?.aborted) {
            // Request was intentionally aborted, don't log an error
            return [];
        }

        console.error('Error fetching all contractors:', error);
        return [];
    }
}

/**
 * Fetches the list of contractors with optional pagination and search
 * @param params Parameters for fetching contractors
 * @returns Promise with the contractors list response
 */
export async function fetchContractorsList({
    page = 1,
    pageSize = 20,
    search = '',
    signal,
}: FetchContractorsParams = {}): Promise<ContractorListResponse> {
    try {
        // For direct component use, make a single page request
        const queryParams = new URLSearchParams();

        // Try the standard 'page' parameter instead of 'page[number]'
        // as many APIs use this format
        queryParams.append('page', page.toString());

        // Keep the page[size] parameter
        queryParams.append('page[size]', pageSize.toString());

        if (search) {
            queryParams.append('filter[search]', search);
        }

        const url = `${API_BASE_URL}/${API_VERSION}/contractors?${queryParams.toString()}`;

        const response = await HTTP({
            url,
            method: 'GET',
            headers: apiRequestHeaders,
            signal,
        });

        return response.data as ContractorListResponse;
    } catch (error) {
        if (signal?.aborted) {
            throw new DOMException('Request aborted', 'AbortError');
        }

        console.error(`Error fetching contractors page ${page}:`, error);
        throw error;
    }
}

/**
 * Convenience function that fetches contractors and stores them in the asset management store
 * @param params Parameters for fetching contractors
 */
export async function fetchAndStoreContractorsList({
    search = '',
    pageSize = 50,
}: Omit<FetchContractorsParams, 'page' | 'signal'> = {}): Promise<void> {
    const { setContractors, setContractorsLoading, setContractorsError } =
        useAssetManagementStore.getState();

    setContractorsLoading(true);

    try {
        // Use the manual approach to get all contractors
        const contractors = await fetchAllContractorsManually({ search, pageSize });

        // Extra check: ensure we don't have duplicate IDs
        const uniqueContractors = Array.from(
            new Map(contractors.map((contractor) => [contractor.id, contractor])).values(),
        );

        // Set contractors in the store - they're already sorted from fetchAllContractorsManually
        setContractors(uniqueContractors);
        setContractorsError(null);
    } catch (error) {
        console.error('Error fetching contractors:', error);
        setContractorsError(error instanceof Error ? error.message : 'Error fetching contractors');
        setContractors([]);
    } finally {
        setContractorsLoading(false);
    }
}
