import genericFetchEndpoint from '../../../utils/api/genericFetchEndpoint';
import type { CaseWorkOrder, CaseWorkOrderData } from '../types/pageTypes';
import getFilters from './filters/getFilters';

interface CaseWorkOrderProps {
    search?: string | undefined;
    selectedPriority: string | undefined;
    selectedCategory: string | undefined;
    selectedStatus: string | undefined;
    selectedStore: string | undefined;
    selectedOwner: string | undefined;
    fetchFilters?: boolean;
    page: number;
}

const caseWorkOrder = async ({
    selectedStatus,
    selectedCategory,
    selectedPriority,
    selectedStore,
    selectedOwner,
    fetchFilters,
    page,
    search,
}: CaseWorkOrderProps): Promise<CaseWorkOrder> => {
    /**
     * Page & search
     */
    const pageQuery = !!page && page > 1 ? `page=${page}` : '';
    const searchQuery = !!search ? `search=${search}` : '';

    const queryPrefix = !!pageQuery || !!searchQuery ? '?' : '';
    const pageSearchQuery = `${queryPrefix}${pageQuery}${!!pageQuery && !!searchQuery ? '&' : ''}${searchQuery}`;

    /**
     * Build filters
     */
    const filterList = [];

    if (selectedStatus) {
        filterList.push(`filter[status]=${selectedStatus}`);
    }

    if (selectedCategory) {
        filterList.push(`filter[category]=${selectedCategory}`);
    }

    if (selectedPriority) {
        filterList.push(`filter[priority]=${selectedPriority}`);
    }

    if (selectedStore) {
        filterList.push(`filter[store]=${selectedStore}`);
    }

    if (selectedOwner) {
        filterList.push(`filter[owner]=${selectedOwner}`);
    }

    /**
     * Fetch data for casework orders
     */
    const data = await genericFetchEndpoint({
        path: `/case-work-order${pageSearchQuery}`,
        useWalkEndpoint: false,
        filterList,
    });

    /**
     * Fetch filters data
     */
    let filters = null;

    if (fetchFilters) {
        const [
            caseWorkCategoryForFilter,
            caseWorkPriorityForFilter,
            caseWorkStatusForFilter,
            caseWorkStoreForFilter,
            caseWorkOwnerForFilter,
        ] = await Promise.all([
            getFilters({
                path: '/caseworkcategories',
                useWalkEndpoint: true,
            }),
            getFilters({
                path: '/case-work-priority',
                useWalkEndpoint: true,
            }),
            getFilters({
                path: '/case-work-status',
                useWalkEndpoint: true,
            }),
            getFilters({
                path: '/case-work-store',
                useWalkEndpoint: true,
            }),
            getFilters({
                path: '/case-work-owner',
                useWalkEndpoint: true,
            }),
        ]);

        if (caseWorkCategoryForFilter.errors) {
            return {
                errors: caseWorkCategoryForFilter.errors,
                filters: null,
                meta: null,
                data: [],
            };
        }

        // Handle filter errors
        if (
            caseWorkCategoryForFilter.errors ||
            caseWorkPriorityForFilter.errors ||
            caseWorkStatusForFilter.errors ||
            caseWorkStoreForFilter.errors ||
            caseWorkOwnerForFilter.errors
        ) {
            return {
                errors: 'Error fetching filters',
                filters: null,
                meta: null,
                data: [],
            };
        }

        filters = {
            status: caseWorkStatusForFilter.data,
            category: caseWorkCategoryForFilter.data,
            priority: caseWorkPriorityForFilter.data,
            store: caseWorkStoreForFilter.data,
            owner: caseWorkOwnerForFilter.data,
        };
    }

    // Handle data errors
    if (data?.errors) {
        return {
            errors: data.errors || 'Unknown error',
            filters: null,
            meta: null,
            data: [],
        };
    }

    if (!data) {
        return {
            errors: 'no data found',
            filters: null,
            meta: null,
            data: [],
        };
    }

    /**
     * Organize the data
     */
    const { aggData, meta } = data;

    const organizedData = aggData?.map((aggData) => {
        const priority = aggData.attributes.priority.toLowerCase();
        return {
            id: aggData.id,
            caseId: aggData.attributes.caseId,
            title: aggData.attributes.title,
            property: aggData.attributes.property,
            datacreated: aggData.attributes.datacreated,
            owner: aggData.attributes.owner,
            priority: `/assets/images/${priority}.svg`,
            status: aggData.attributes.status,
        };
    });

    /**
     * Return data matching the specified type
     */
    return {
        data: organizedData as CaseWorkOrderData[],
        filters,
        meta,
        errors: null,
    } satisfies CaseWorkOrder;
};

export default caseWorkOrder;
