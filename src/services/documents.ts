import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type Documents } from '../types/pageTypes';

const documents = async (): Promise<Documents> => {
    /**
     * Fetch data from the endpoint
     */
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['documents', 'projects'],
            mapping: {
                invoices: ['documents'],
                projects: ['projects'],
            },
        },
        path: '/document-library',
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
    return { data: organizedData as any } satisfies Documents;
};

export default documents;
