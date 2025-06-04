export default   {
    data: [
        {
            type: 'asset-group',
            id: '01962180-f756-726d-9f7b-eb3de945bc37',
            attributes: {
                name: 'Asset Types',
                depth: 0,
                hasChildren: true,
                deletedAt: null,
                createdAt: '2025-04-10T21:00:22+00:00',
                updatedAt: '2025-04-10T21:04:17+00:00',
                isDeleted: false,
            },
            links: {
                self: 'http://gateway.localhost/v1.0/assets/groups/01962180-f756-726d-9f7b-eb3de945bc37',
            },
        },
        {
            type: 'asset-group',
            id: '01962180-f758-7188-b0ff-5330d661b305',
            attributes: {
                name: 'Departments',
                depth: 0,
                hasChildren: true,
                deletedAt: null,
                createdAt: '2025-04-10T21:00:22+00:00',
                updatedAt: '2025-04-10T21:00:22+00:00',
                isDeleted: false,
            },
            links: {
                self: 'http://gateway.localhost/v1.0/assets/groups/01962180-f758-7188-b0ff-5330d661b305',
            },
        },
        {
            type: 'asset-group',
            id: '01962180-f755-702f-a335-5011e0cc5bf6',
            attributes: {
                name: 'Locations',
                depth: 0,
                hasChildren: true,
                deletedAt: null,
                createdAt: '2025-04-10T21:00:22+00:00',
                updatedAt: '2025-04-10T21:04:21+00:00',
                isDeleted: false,
            },
            links: {
                self: 'http://gateway.localhost/v1.0/assets/groups/01962180-f755-702f-a335-5011e0cc5bf6',
            },
        },
    ],
    links: {
        first: 'http://gateway.localhost/v1.0/assets/groups?page[number]=1',
        last: 'http://gateway.localhost/v1.0/assets/groups?page[number]=1',
        self: 'http://gateway.localhost/v1.0/assets/groups',
    },
    meta: {
        filters: [],
        page: {
            current: 1,
            from: 1,
            to: 3,
            totalPages: 1,
            size: 15,
            total: 3,
        },
    },
}
