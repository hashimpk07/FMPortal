import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type DocumentType } from '../types/pageTypes';

const documentType = async (): Promise<DocumentType> => {
    /**
     * Fetch data from the endpoint
     */
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['documentType', 'projects'],
            mapping: {
                invoices: ['documentType'],
                projects: ['projects'],
            },
        },
        path: '/listDocumentType',
        useWalkEndpoint: false,
    });
    // If there are errors, return them
    if (data?.errors) {
        return { errors: data.errors, data: [] };
    }

    // If no data is returned, indicate "no data found"
    if (!data) {
        return { errors: 'no data found', data: [] };
    }

    /**
     * Organize the data
     * This section might grow as the data structure is further understood
     */
    const { aggData } = data;
    const organizedData = aggData;

    /**
     * Return data matching the specified type
     */
    return { data: organizedData as any } satisfies DocumentType;
};

export default documentType;
