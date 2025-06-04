export default {
    data: [
        {
            type: 'asset-group',
            id: '0196407b-00da-7253-9f83-48b8a177de1e',
            attributes: {
                name: 'Tables',
                depth: 3,
                parentId: '0196407b-00d6-71d3-9931-b01e8a72d878',
                hasChildren: false,
            },
        },
        {
            type: 'asset-group',
            id: '0196407b-00d6-71d3-9931-b01e8a72d878',
            attributes: {
                name: 'Surfaces',
                depth: 2,
                parentId: '0196407b-00ce-72b2-aebb-76ac55fb32ee',
                hasChildren: true,
            },
        },
        {
            type: 'asset-group',
            id: '0196407b-00ed-72ab-9a7d-e1b0e3f1c4fd',
            attributes: {
                name: 'Sales',
                depth: 2,
                parentId: '0196407b-00eb-7342-bf09-cebcadc3370a',
                hasChildren: false,
            },
        },
        {
            type: 'asset-group',
            id: '0196407b-00c3-7390-bd5f-63d7699dfa2e',
            attributes: {
                name: 'Phones',
                depth: 3,
                parentId: '0196407b-00bc-7365-b8b9-5a942b04cd46',
                hasChildren: false,
            },
        },
        {
            type: 'asset-group',
            id: '0196407b-00e0-7197-a95f-b9951771f402',
            attributes: {
                name: 'Facilities',
                depth: 2,
                parentId: '0196407b-00de-7057-9291-71937711e3ce',
                hasChildren: false,
            },
        },
    ],
    links: {
        self: 'http://gateway.localhost/v1.0/assets/groups/tree?filter%5BcentreId%5D=1&filter%5Bsearch%5D=es&filter%5BmaxDepth%5D=3&page%5Blimit%5D=5&sort=-name',
    },
    meta: {
        totalCount: 5,
        filters: {
            centreId: '1',
            search: 'es',
            maxDepth: '3',
        },
        limit: 5,
    },
};
