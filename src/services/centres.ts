import genericFetchEndpoint from '../utils/api/genericFetchEndpoint';

// Define a type for the centre config from the API
export interface CentreConfig {
    default_currency_code: string;
    default_currency_divider: string;
    default_currency_symbol: string;
    locale?: string; // Add locale property for formatters
}

// Extend the PropertyData interface to include config
export interface CentreData {
    id: string | number;
    type: string;
    attributes: {
        name: string;
        phoneCode: number;
        language: string;
        locale: string;
        logoUrl: string;
        config: CentreConfig;
    };
    links?: {
        self: { href: string };
        related: { href: string };
    };
}

/**
 * Fetches the list of centres from the API
 * @returns Promise with the list of centres
 */
const fetchCentresList = async (): Promise<{ data: CentreData[]; errors?: any }> => {
    // Check if centre data is saved in session storage, if available return the saved data
    // Otherwise call centres API
    try {
        const centreData = sessionStorage.getItem('centres');
        if (centreData) {
            const savedCentres = JSON.parse(centreData);
            if (savedCentres && savedCentres.data.length) {
                return { data: savedCentres.data as CentreData[] };
            }
        }
    } catch (error) {
        return { errors: error, data: [] };
    }

    /**
     * Fetch data from the endpoint
     */
    const data = await genericFetchEndpoint({
        includeListAndMapping: {
            includes: [],
            mapping: {},
        },
        path: '/centres',
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
     * We're preserving the full data structure to keep the config
     */
    const { aggData } = data;
    const organizedData =
        aggData?.map((centre: any) => {
            // Create a new object instead of modifying the parameter directly
            if (centre.attributes && centre.attributes.config && centre.attributes.locale) {
                return {
                    ...centre,
                    attributes: {
                        ...centre.attributes,
                        config: {
                            ...centre.attributes.config,
                            locale: centre.attributes.locale,
                        },
                    },
                };
            }
            return centre;
        }) || [];

    /**
     * Return data matching the specified type
     */
    return { data: organizedData as CentreData[] };
};

export default fetchCentresList;
