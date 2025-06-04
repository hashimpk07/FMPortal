import i18next from 'i18next';
import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants';

export interface Status {
    id: string;
    name: string;
    slug?: string;
    label?: string;
}

/**
 * Fetches available statuses for work orders
 * @returns Promise with statuses data
 */
export async function fetchWorkOrderStatuses(): Promise<Status[]> {
    try {
        const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/tickets/statuses`);
        const statusData = response.data.data;

        return statusData.map((item: any) => ({
            id: item.attributes.slug,
            name: item.attributes.label,
            slug: item.attributes.slug,
            label: item.attributes.label,
        }));
    } catch (error) {
        console.error('Error fetching work order statuses:', error);
        throw new Error(
            i18next.t('errors.failed-to-fetch-statuses', 'Failed to fetch work order statuses'),
        );
    }
}

const statusService = {
    fetchWorkOrderStatuses,
};

export default statusService;
