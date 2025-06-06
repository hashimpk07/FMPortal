import { RANDOM_AVATAR } from '../../constants';

const contractorsList = {
    data: [
        {
            id: '1',
            type: 'contractor',
            attributes: {
                name: 'Michael Brown',
                avatar: {RANDOM_AVATAR}+'?img=1',
                companyName: 'Brown Construction',
                description: 'Carpenter',
                phoneNumber: '+44 7976 123456',
                email: 'michael.brown@example.com',
                documents: 3,
                invoices: 5,
                workOrders: 2,
            },
        },
        {
            id: '2',
            type: 'contractor',
            attributes: {
                name: 'Sophia Williams',
                avatar: {RANDOM_AVATAR}+'?img=2',
                companyName: 'Williams Plumbing',
                description: 'Plumber',
                phoneNumber: '+44 7912 654321',
                email: 'sophia.williams@example.com',
                documents: 2,
                invoices: 4,
                workOrders: 1,
            },
        },
        {
            id: '3',
            type: 'contractor',
            attributes: {
                name: 'Daniel Lee',
                avatar: '',
                companyName: 'Lee Electrical',
                description: 'Electrician',
                phoneNumber: '+44 7920 567890',
                email: 'daniel.lee@example.com',
                documents: 1,
                invoices: null,
                workOrders: 1,
            },
        },
        {
            id: '4',
            type: 'contractor',
            attributes: {
                name: 'Olivia Harris',
                avatar: {RANDOM_AVATAR}+'?img=4',
                companyName: 'Harris Painting',
                description: 'Painter',
                phoneNumber: '+44 7990 234567',
                email: 'olivia.harris@example.com',
                documents: 3,
                invoices: 2,
                workOrders: 5,
            },
        },
        {
            id: '5',
            type: 'contractor',
            attributes: {
                name: 'James Taylor',
                avatar: {RANDOM_AVATAR}+'?img=5',
                companyName: 'Taylor Builders',
                description: 'Builder',
                phoneNumber: '+44 7943 876543',
                email: 'james.taylor@example.com',
                documents: 2,
                invoices: 3,
                workOrders: 4,
            },
        },
        {
            id: '6',
            type: 'contractor',
            attributes: {
                name: 'Charlotte King',
                avatar: {RANDOM_AVATAR}+'?img=6',
                companyName: 'King Construction',
                description: 'Landscaper',
                phoneNumber: '+44 7981 543210',
                email: 'charlotte.king@example.com',
                documents: 4,
                invoices: 2,
                workOrders: 1,
            },
        },
        {
            id: '7',
            type: 'contractor',
            attributes: {
                name: 'Ethan Scott',
                avatar: {RANDOM_AVATAR}+'?img=7',
                companyName: 'Scott Renovations',
                description: 'Renovation Specialist',
                phoneNumber: '+44 7911 654987',
                email: 'ethan.scott@example.com',
                documents: 5,
                invoices: 3,
                workOrders: 2,
            },
        },
        {
            id: '8',
            type: 'contractor',
            attributes: {
                name: 'Isabella Green',
                avatar: {RANDOM_AVATAR}+'?img=8',
                companyName: 'Green Electrical',
                description: 'Electrician',
                phoneNumber: '+44 7933 213456',
                email: 'isabella.green@example.com',
                documents: 6,
                invoices: 1,
                workOrders: 3,
            },
        },
        {
            id: '9',
            type: 'contractor',
            attributes: {
                name: 'Liam Moore',
                avatar: {RANDOM_AVATAR}+'?img=9',
                companyName: 'Moore Painting',
                description: 'Painter',
                phoneNumber: '+44 7921 341234',
                email: 'liam.moore@example.com',
                documents: 3,
                invoices: 4,
                workOrders: 2,
            },
        },
        {
            id: '10',
            type: 'contractor',
            attributes: {
                name: 'Amelia White',
                avatar: {RANDOM_AVATAR}+'?img=10',
                companyName: 'White Renovations',
                description: 'Renovation Specialist',
                phoneNumber: '+44 7925 123456',
                email: 'amelia.white@example.com',
                documents: 4,
                invoices: 5,
                workOrders: 3,
            },
        },
        {
            id: '11',
            type: 'contractor',
            attributes: {
                name: 'Benjamin Clark',
                avatar: {RANDOM_AVATAR}+'?img=11',
                companyName: 'Clark Builders',
                description: 'Builder',
                phoneNumber: '+44 7947 908765',
                email: 'benjamin.clark@example.com',
                documents: 3,
                invoices: 2,
                workOrders: 4,
            },
        },
        {
            id: '12',
            type: 'contractor',
            attributes: {
                name: 'Mia Adams',
                avatar: {RANDOM_AVATAR}+'?img=12',
                companyName: 'Adams Plumbing',
                description: 'Plumber',
                phoneNumber: '+44 7923 876543',
                email: 'mia.adams@example.com',
                documents: 5,
                invoices: 4,
                workOrders: 3,
            },
        },
        {
            id: '13',
            type: 'contractor',
            attributes: {
                name: 'Oliver Collins',
                avatar: {RANDOM_AVATAR}+'?img=13',
                companyName: 'Collins Carpentry',
                description: 'Carpenter',
                phoneNumber: '+44 7930 234567',
                email: 'oliver.collins@example.com',
                documents: 2,
                invoices: 3,
                workOrders: 5,
            },
        },
        {
            id: '14',
            type: 'contractor',
            attributes: {
                name: 'Jack Thomas',
                avatar: {RANDOM_AVATAR}+'?img=14',
                companyName: 'Thomas Electrical',
                description: 'Electrician',
                phoneNumber: '+44 7978 987654',
                email: 'jack.thomas@example.com',
                documents: 4,
                invoices: 2,
                workOrders: 6,
            },
        },
        {
            id: '15',
            type: 'contractor',
            attributes: {
                name: 'Grace Nelson',
                avatar: {RANDOM_AVATAR}+'?img=15',
                companyName: 'Nelson Renovations',
                description: 'Renovation Specialist',
                phoneNumber: '+44 7928 654123',
                email: 'grace.nelson@example.com',
                documents: 2,
                invoices: 3,
                workOrders: 4,
            },
        },
        {
            id: '16',
            type: 'contractor',
            attributes: {
                name: 'Lucas King',
                avatar: {RANDOM_AVATAR}+'?img=16',
                companyName: 'King Construction',
                description: 'Builder',
                phoneNumber: '+44 7974 321098',
                email: 'lucas.king@example.com',
                documents: 5,
                invoices: 4,
                workOrders: 2,
            },
        },
    ],
};

export default contractorsList;
