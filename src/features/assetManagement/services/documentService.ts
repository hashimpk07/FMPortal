import HTTP from '../../../utils/api/helpers/axios';
import apiRequestHeaders from '../../../services/apiRequestHeaders';
import { API_BASE_URL, API_VERSION } from '../../../constants/api';
import type { DocumentsResponse } from './types';

/**
 * Fetches the list of documents
 * @param page Page number for pagination
 * @param pageSize Number of items per page
 * @returns Promise with the documents response
 */
async function fetchDocumentsList(page = 1, pageSize = 20): Promise<DocumentsResponse> {
    const queryParams = new URLSearchParams({
        'page[number]': page.toString(),
        'page[size]': pageSize.toString(),
    });
    const url = `${API_BASE_URL}/${API_VERSION}/documents?${queryParams.toString()}`;
    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as DocumentsResponse;
    } catch (error) {
        console.error('Error fetching documents list:', error);
        throw error;
    }
}

export default fetchDocumentsList;
