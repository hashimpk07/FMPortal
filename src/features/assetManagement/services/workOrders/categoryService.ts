import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants';

export interface CategoryForm {
    id: string;
    type: string;
    attributes: {
        name: string;
        intro: string | null;
        fields: any[];
        dateFormat: string;
        dateTimeFormat: string;
    };
}

export interface CategoryConfig {
    id: string;
    type: string;
    attributes: {
        config_key: string;
        config_value: string;
    };
}

export interface Category {
    id: string;
    type: string;
    attributes: {
        name: string;
        type: string;
        icon: string;
        colour: string;
        url: string;
    };
    relationships: {
        forms: {
            data: {
                type: string;
                id: string;
            }[];
        };
        config: {
            data: {
                type: string;
                id: string;
            }[];
        };
    };
    links: {
        self: {
            href: string;
        };
    };
}

export interface CategoriesResponse {
    data: Category[];
    included: (CategoryForm | CategoryConfig)[];
    links: {
        first: string;
        last: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

/**
 * Fetches categories for work orders that allow sub-tickets
 * @param centreId The ID of the center/property
 * @returns Promise with categories data
 */
export async function fetchWorkOrderCategories(centreId: string): Promise<CategoriesResponse> {
    if (!centreId) {
        throw new Error('Centre ID is required');
    }

    try {
        const url = `${API_BASE_URL}/${API_VERSION}/categories?include=forms,config&filter[centreId]=${centreId}&filter[config][key]=allow_sub_tickets`;
        const response = await HTTP.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching work order categories:', error);
        throw error;
    }
}

const categoryService = {
    fetchWorkOrderCategories,
};

export default categoryService;
