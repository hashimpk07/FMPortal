import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import HTTP from '../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../constants';

interface ApiResponse<T> {
    data: T[];
    included?: any[];
    meta?: {
        pagination?: {
            current_page: number;
            total_pages: number;
            total: number;
        };
        current_page?: number;
        last_page?: number;
        total?: number;
    };
    links?: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
}

interface PaginatedApiOptions {
    partialPath: string;
    queryParams?: Record<string, string>;
    filters?: Record<string, string | string[]>;
    include?: string[];
    signal?: AbortSignal;
    pageSize?: number;
}

interface ApiItem {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, any>;
    links?: Record<string, any>;
}

type GroupedIncluded = Record<string, ApiItem[]>;

const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // Base delay in ms

/**
 * Groups included items by their type for easier access
 */
const groupIncludedByType = (included: ApiItem[]): GroupedIncluded => {
    if (!included || !included.length) return {};

    const grouped: Record<string, Map<string, ApiItem>> = {};

    included.forEach((item) => {
        if (!grouped[item.type]) {
            grouped[item.type] = new Map();
        }
        grouped[item.type].set(item.id, item);
    });

    // Convert maps to arrays
    return Object.fromEntries(
        Object.entries(grouped).map(([key, map]) => [key, Array.from(map.values())]),
    );
};

/**
 * Fetches a single page with retries
 */
const fetchWithRetry = async <T>(
    url: string,
    signal?: AbortSignal,
    retries: number = MAX_RETRIES,
): Promise<ApiResponse<T> | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await HTTP.get<ApiResponse<T>>(url, { signal });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                return null; // Request was cancelled, don't retry
            }

            if (attempt < retries) {
                // Exponential backoff with jitter
                const delay = RETRY_DELAY * 2 ** (attempt - 1) * (0.5 + Math.random() * 0.5);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error(`Failed to fetch after ${retries} retries:`, error);
                return null;
            }
        }
    }
    return null;
};

/**
 * Builds the URL with query parameters and filters
 */
const buildUrl = (options: PaginatedApiOptions, page: number): string => {
    const { partialPath, queryParams = {}, filters = {}, include = [], pageSize } = options;
    const baseApiPath = `${API_BASE_URL}/${API_VERSION}${partialPath}`;
    const url = new URL(baseApiPath);

    // Add page parameters
    url.searchParams.set('page[number]', page.toString());
    if (pageSize) {
        url.searchParams.set('page[size]', pageSize.toString());
    }

    // Add includes
    if (include.length > 0) {
        url.searchParams.set('include', include.join(','));
    }

    // Add query params
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    });

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // Handle array values for filters
            value.forEach((val) => {
                if (val !== undefined && val !== null && val !== '') {
                    url.searchParams.append(`filter[${key}]`, val);
                }
            });
        } else if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(`filter[${key}]`, value);
        }
    });

    return url.toString();
};

/**
 * Fetches all pages of paginated data from an API endpoint
 */
const fetchPaginatedData = async <T extends ApiItem>({
    partialPath,
    queryParams = {},
    filters = {},
    include = [],
    signal,
    pageSize,
}: PaginatedApiOptions): Promise<{
    data: T[];
    included: GroupedIncluded;
    totalItems: number;
    totalPages: number;
}> => {
    const aggregatedData = new Map<string, T>();
    const aggregatedIncluded: ApiItem[] = [];
    let totalItems = 0;
    let totalPages = 1;

    try {
        // Fetch first page
        const firstPageUrl = buildUrl({ partialPath, queryParams, filters, include, pageSize }, 1);
        const firstPageResponse = await fetchWithRetry<T>(firstPageUrl, signal);

        if (!firstPageResponse) {
            if (!signal?.aborted) {
                enqueueSnackbar('Error fetching data', { variant: 'error' });
            }
            return { data: [], included: {}, totalItems: 0, totalPages: 0 };
        }

        // Extract data and metadata
        const { data = [], included = [], meta = {} } = firstPageResponse;

        // Handle different API response formats for pagination
        if (meta.pagination) {
            totalPages = meta.pagination.total_pages;
            totalItems = meta.pagination.total;
        } else {
            totalPages = meta.last_page || 1;
            totalItems = meta.total || data.length;
        }

        // Merge first page data
        data.forEach((item: T) => aggregatedData.set(item.id, item));
        if (included?.length) {
            aggregatedIncluded.push(...included);
        }

        // If there are more pages, fetch them in parallel
        if (totalPages > 1) {
            const pageRequests: Promise<ApiResponse<T> | null>[] = [];

            for (let page = 2; page <= totalPages; page++) {
                const pageUrl = buildUrl(
                    { partialPath, queryParams, filters, include, pageSize },
                    page,
                );
                pageRequests.push(fetchWithRetry<T>(pageUrl, signal));
            }

            const pageResponses = await Promise.allSettled(pageRequests);
            const failedPages: number[] = [];

            pageResponses.forEach((result, index) => {
                const pageNumber = index + 2; // Page index starts at 2

                if (result.status === 'fulfilled' && result.value) {
                    const { data = [], included = [] } = result.value;
                    data.forEach((item: T) => aggregatedData.set(item.id, item));
                    if (included?.length) {
                        aggregatedIncluded.push(...included);
                    }
                } else {
                    failedPages.push(pageNumber);
                }
            });

            // Retry failed pages one by one (if any)
            if (failedPages.length > 0 && !signal?.aborted) {
                console.warn(`Retrying failed pages: ${failedPages.join(', ')}`);

                for (const page of failedPages) {
                    const pageUrl = buildUrl(
                        { partialPath, queryParams, filters, include, pageSize },
                        page,
                    );
                    const retryResponse = await fetchWithRetry<T>(pageUrl, signal);

                    if (retryResponse) {
                        const { data = [], included = [] } = retryResponse;
                        data.forEach((item: T) => aggregatedData.set(item.id, item));
                        if (included?.length) {
                            aggregatedIncluded.push(...included);
                        }
                    } else if (!signal?.aborted) {
                        console.error(`Failed to fetch page ${page} after multiple retries`);
                    }
                }
            }
        }

        return {
            data: Array.from(aggregatedData.values()),
            included: groupIncludedByType(aggregatedIncluded),
            totalItems,
            totalPages,
        };
    } catch (error) {
        if (axios.isCancel(error)) {
            // Request was cancelled, return empty result
            return { data: [], included: {}, totalItems: 0, totalPages: 0 };
        }

        if (!signal?.aborted) {
            console.error('Error fetching paginated data:', error);
            enqueueSnackbar('Error fetching data', { variant: 'error' });
        }

        return { data: [], included: {}, totalItems: 0, totalPages: 0 };
    }
};

export default fetchPaginatedData;
