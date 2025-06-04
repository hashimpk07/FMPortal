import HTTP from '../../../utils/api/helpers/axios';
import apiRequestHeaders from '../../../services/apiRequestHeaders';
import { API_BASE_URL, API_VERSION } from '../../../constants/api';
import type { Location, LocationsResponse } from './types';

/**
 * Fetches all locations for a centre
 * @param params Optional parameters for the request
 * @returns Promise with the locations array
 */
export async function fetchAllLocations(params: { centreId?: string } = {}): Promise<Location[]> {
    const { centreId } = params;
    const queryParams = new URLSearchParams();
    if (centreId) queryParams.append('filter[centreId]', centreId);
    const url = `${API_BASE_URL}/${API_VERSION}/locations?${queryParams.toString()}`;
    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data.data as Location[];
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
}

/**
 * Fetches paginated locations for a centre
 * @param params Parameters for fetching locations
 * @returns Promise with the locations response
 */
export async function fetchLocationsList({
    centreId,
    page = 1,
    pageSize = 10,
}: {
    centreId?: string;
    page?: number;
    pageSize?: number;
} = {}): Promise<LocationsResponse> {
    const queryParams = new URLSearchParams();
    if (centreId) queryParams.append('filter[centreId]', centreId);
    queryParams.append('page[number]', page.toString());
    queryParams.append('page[size]', pageSize.toString());
    const url = `${API_BASE_URL}/${API_VERSION}/locations?${queryParams.toString()}`;
    try {
        const response = await HTTP({ url, method: 'GET', headers: apiRequestHeaders });
        return response.data as LocationsResponse;
    } catch (error) {
        console.error('Error fetching locations list:', error);
        throw error;
    }
}
