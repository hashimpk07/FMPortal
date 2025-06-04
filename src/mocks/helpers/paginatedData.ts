interface GeneratePaginatedResponseProps {
    data: any[];
    page?: number;
    limit?: number;
    path: string;
}

interface PaginatedResponse {
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    data: any[];
}

const generatePaginatedResponse = ({
    data,
    page = 1,
    limit = 10,
    path = '',
}: GeneratePaginatedResponseProps): PaginatedResponse => {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Slice the data for the current page
    const paginatedData = data.slice((page - 1) * limit, page * limit);

    // Calculate pagination metadata
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, totalCount);

    // Generate pagination links structure
    const links = [
        { url: `${path}?page=1`, label: '&laquo; Previous', active: page > 1 },
        ...Array.from({ length: totalPages }, (_, i) => ({
            url: `${path}?page=${i + 1}`,
            label: `${i + 1}`,
            active: i + 1 === page,
        })),
        {
            url: `${path}?page=${totalPages}`,
            label: 'Next &raquo;',
            active: page < totalPages,
        },
    ];

    return {
        data: paginatedData,
        meta: {
            current_page: page,
            from,
            last_page: totalPages,
            links,
            path,
            per_page: limit,
            to,
            total: totalCount,
        },
    };
};

export default generatePaginatedResponse;
