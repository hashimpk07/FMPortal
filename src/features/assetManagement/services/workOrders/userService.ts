import i18next from 'i18next';
import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants';

export interface Assignee {
    id: string | number;
    name: string;
    email?: string;
}

/**
 * Fetches users who can be assigned to work orders for a specific center/property
 * @param centreId The ID of the center/property
 * @returns Promise with assignees data
 */
export async function fetchAssignableUsers(centreId: string): Promise<Assignee[]> {
    if (!centreId) {
        throw new Error(i18next.t('errors.centre-id-required', 'Centre ID is required'));
    }

    try {
        const response = await HTTP.get(
            `${API_BASE_URL}/${API_VERSION}/users?filter[centreId]=${centreId}`,
        );

        const userData = response.data.data;
        if (Array.isArray(userData)) {
            return userData.map((item: any) => ({
                id: Number(item.id),
                name: item.attributes.name,
                email: item.attributes.email,
            }));
        }

        return [];
    } catch (error) {
        console.error('Error fetching assignable users:', error);
        throw new Error(
            i18next.t('errors.failed-to-fetch-assignees', 'Failed to fetch assignable users'),
        );
    }
}

const userService = {
    fetchAssignableUsers,
};

export default userService;
