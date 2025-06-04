import fetchData, { FetchData } from './fetchData';

interface FetchPageProps {
    page: number;
    path?: string | undefined;
    queryString?: string | undefined;
    signal?: AbortSignal;
}

const fetchPage = async ({
    page,
    path,
    queryString,
    signal,
}: FetchPageProps): Promise<FetchData | null> => {
    if (!path) {
        console.error('No path to fetch');
        return null;
    }

    try {
        let pathKey = 'path';

        if (!path) {
            pathKey = 'partialPath';
        }

        return await fetchData({
            [pathKey]: path,
            queryString: `${queryString}&page=${page}`,
            signal,
        });
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        return null;
    }
};

export default fetchPage;
