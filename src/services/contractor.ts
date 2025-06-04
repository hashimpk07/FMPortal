import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type Invoices } from '../types/pageTypes';

const contractor = async (): Promise<Invoices> => {
    /**
     * Fetch data from the endpoint
     */
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['contractor', 'projects'],
            mapping: {
                invoices: ['contractor'],
                projects: ['projects'],
            },
        },
        path: '/listContractor',
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
    return { data: organizedData as any } satisfies Invoices;
};

export default contractor;
