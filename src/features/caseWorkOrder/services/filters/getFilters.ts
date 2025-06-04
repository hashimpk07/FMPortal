import genericFetchEndpoint from '../../../../utils/api/genericFetchEndpoint';

interface GetFiltersProps {
    path: string;
    useWalkEndpoint: boolean;
}

interface FilterData {
    id: string | number;
    label: string;
}

interface Filter {
    data: FilterData[];
    errors?: string;
}

const getFilters = async ({ path, useWalkEndpoint }: GetFiltersProps): Promise<Filter> => {
    const data = await genericFetchEndpoint({
        path,
        useWalkEndpoint,
    });

    /**
     * If there are errors, return them
     */
    if (data?.errors) {
        return { errors: data.errors, data: [] };
    }

    /**
     * If no data is returned, indicate "no data found"
     */
    if (!data) {
        return { errors: 'no data found', data: [] };
    }

    /**
     * Organize the data
     * Ensure that organizedData is always an array
     */
    const { aggData } = data;
    const organizedData: FilterData[] = aggData
        ? aggData.map((item) => ({
              id: item.id,
              label: item.attributes?.name || '',
          }))
        : [];

    /**
     * Return data matching the specified type
     */
    return { data: organizedData, errors: undefined };
};

export default getFilters;
