import { http, delay, HttpResponse } from 'msw';
import {
    API_BASE_URL,
    API_VERSION,
    CONTRACTOR_DATABASE,
    INVOICE,
    INVOICE_PAYMENT,
    STATUS,
    CONTRACTOR,
    CASE_WORk_ORDER,
    CASE_WORk_ORDER_CATEGORY,
} from '../constants/api';
import contractorsList from './responses/contractorsList';
import invoice from './responses/invoice';
import invoicePayment from './responses/invoicePayment';
import contractor from './responses/contractor';
import status from './responses/status';
import generatePaginatedResponse from './helpers/paginatedData';
import assetGroups from './responses/assetManagement/assetGroups.js';
import assetGroupTree from './responses/assetManagement/assetGroupTree.js';

const handlers = [
    http.get(`${API_BASE_URL}/${API_VERSION}/${CONTRACTOR_DATABASE}*`, async ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        await delay(1000);

        const paginatedContractors = generatePaginatedResponse({
            data: contractorsList.data,
            page,
            limit,
            totalCount: contractorsList.data.length,
        });

        return HttpResponse.json(paginatedContractors, { status: 200 });
    }),
    http.get(`${API_BASE_URL}/${API_VERSION}/${INVOICE_PAYMENT}*`, () => {
        return HttpResponse.json(invoicePayment, { status: 200 });
    }),
    http.get(`${API_BASE_URL}/${API_VERSION}/${INVOICE}*`, () => {
        return HttpResponse.json(invoice, { status: 200 });
    }),
    http.get(`${API_BASE_URL}/${API_VERSION}/${STATUS}*`, () => {
        return HttpResponse.json(status, { status: 200 });
    }),
    http.get(`${API_BASE_URL}/${API_VERSION}/${CONTRACTOR}*`, () => {
        return HttpResponse.json(contractor, { status: 200 });
    }),

    http.get(`${API_BASE_URL}/${API_VERSION}/assets/groups`, () => {
        return HttpResponse.json(assetGroups, { status: 200 });
    }),

    http.get(`${API_BASE_URL}/${API_VERSION}/assets/groups/tree`, () => {
        return HttpResponse.json(assetGroupTree, { status: 200 });
    }),

    http.get(`${API_BASE_URL}/${API_VERSION}/${CASE_WORk_ORDER}*`, async ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        await delay(1000);

        const paginatedCaseWorkOrder = generatePaginatedResponse({
            data: [],
            page,
            limit,
            totalCount: 0,
        });

        return HttpResponse.json(paginatedCaseWorkOrder, { status: 200 });
    }),

    http.get(`${API_BASE_URL}/${API_VERSION}/${CASE_WORk_ORDER_CATEGORY}*`, () => {
        return HttpResponse.json({ data: [] }, { status: 200 });
    }),
];

export { handlers };
