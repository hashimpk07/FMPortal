import HTTP from '../../../utils/api/helpers/axios';
import apiRequestHeaders from '../../../services/apiRequestHeaders';
import { API_BASE_URL, API_VERSION } from '../../../constants/api';
import type { TagsResponse } from './types';

/**
 * Fetches the list of tags
 * @returns Promise with the tags response
 */
async function fetchTagsList(): Promise<TagsResponse> {
    const url = `${API_BASE_URL}/${API_VERSION}/tags`;
    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as TagsResponse;
    } catch (error) {
        console.error('Error fetching tags list:', error);
        throw error;
    }
}

export default fetchTagsList;
