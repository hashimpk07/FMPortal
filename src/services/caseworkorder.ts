import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type CaseWorkOrder, type CaseWorkOrderData } from '../types/pageTypes';

interface CaseWorkOrderDataProps {
    page: number;
    search: string;
}

const caseworkorder = async ({ page, search }: CaseWorkOrderDataProps): Promise<CaseWorkOrder> => {
    /**
     * Get the data
     */
    const pageQuery = !!page && page > 1 ? `page=${page}` : '';
    const searchQuery = !!search ? `search=${search}` : '';

    const queryPrefix = !!pageQuery || !!searchQuery ? '?' : '';
    const pageSearchQuery = `${queryPrefix}${pageQuery}${!!pageQuery && !!searchQuery ? '&' : ''}${searchQuery}`;

    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['projects'],
            mapping: {
                projects: ['projects'],
            },
        },
        path: `/case-work-order${pageSearchQuery}`,
        useWalkEndpoint: false,
    });

    if (data?.errors) {
        return {
            errors: data.errors,
            data: [],
            meta: null,
        };
    }

    if (!data) {
        return {
            errors: 'no data found',
            data: [],
            meta: null,
        };
    }

    /**
     * Organize the data
     * expect this section to grow as the data structure is understood.
     * If the logic becomes too complex, it'll move into /feature.
     */
    const { aggData, meta } = data;

    const organizedData = (aggData ?? [])?.map((singleDataPoint) => {
        const priority = singleDataPoint.attributes.priority.toLowerCase();
        return {
            id: singleDataPoint.id,
            caseId: singleDataPoint.attributes.caseId,
            title: singleDataPoint.attributes.title,
            property: singleDataPoint.attributes.property,
            datacreated: singleDataPoint.attributes.datacreated,
            owner: singleDataPoint.attributes.owner,
            priority: `/assets/images/${priority}.svg`,
            status: singleDataPoint.attributes.status,
        };
    }) satisfies CaseWorkOrderData[];

    /**
     * Return data matching specified ts interface
     */

    return { data: organizedData, meta, errors: null };
};

export default caseworkorder;
