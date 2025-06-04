import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type ContractorDatabase, type ContractorDatabaseData } from '../types/pageTypes';

interface ContractorDatabaseProps {
    page: number;
    search: string;
}

const contractorDatabase = async ({
    page,
    search,
}: ContractorDatabaseProps): Promise<ContractorDatabase> => {
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
        path: `/contractors${pageSearchQuery}`,
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
        return {
            id: singleDataPoint.id,
            name: singleDataPoint.attributes.name,
            avatar: singleDataPoint.attributes.avatar,
            companyName: singleDataPoint.attributes.companyName,
            description: singleDataPoint.attributes.description,
            phoneNumber: singleDataPoint.attributes.phoneNumber,
            email: singleDataPoint.attributes.email,
            documentCount: singleDataPoint.attributes.documents || 0,
            invoiceCount: singleDataPoint.attributes.invoices || 0,
            workOrderCount: singleDataPoint.attributes.workOrders || 0,
        };
    }) satisfies ContractorDatabaseData[];

    /**
     * Return data matching specified ts interface
     */
    return { data: organizedData, meta, errors: null };
};

export default contractorDatabase;
