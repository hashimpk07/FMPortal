import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';
import { type Property } from '../types/pageTypes';

const property = async (): Promise<Property> => {
    /**
     * Fetch data from the endpoint
     */
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: ['property', 'projects'],
            mapping: {
                invoices: ['property'],
                projects: ['projects'],
            },
        },
        path: '/listProperty',
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
    return { data: organizedData as any } satisfies Property;
};

export default property;
