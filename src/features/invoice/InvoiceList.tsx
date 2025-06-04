import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridPro, GridSortModel } from '@mui/x-data-grid-pro';
import { Drawer, Typography } from '@mui/material';
import styled from '@emotion/styled';
//import serviceInvoice from '../../services/invoices';
import { format } from 'date-fns';
import type { InvoicesData as InvoiceDataType } from '../../types/pageTypes';
import columns from '../../columnDefinitions/invoice';
import Controls from './Controls';
import ViewInvoice from './ViewInvoice';
import { API_BASE_URL, API_VERSION } from '../../constants/api';
import HTTP from '../../utils/api/helpers/axios';
import extractSortParams from '../../utils/api/helpers/sortHelpers';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2em;
`;

const InvoiceList = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<InvoiceDataType[]>([]);
    const [search, setSearch] = useState('');
    const [openInvoiceDetailModal, setInvoiceDetailModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number>(0);
    const [isLoading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 15,
    });
    const [totalPages, setTotalPages] = useState(0);
    const [sortCol, setSortCol] = useState('');
    const [sortDirection, setSortDirection] = useState<string | null | undefined>('asc');
    const [isReceivedChecked, setIsReceivedChecked] = useState<boolean>(false);
    const [isIssuedChecked, setIsIssuedChecked] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedContractor, setSelectedContractor] = useState<string>('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
    const [updateCount, setUpdateCount] = useState(0);
    const [paymentDate, setPaymentDate] = useState<Date | null>(null);
    const [dueDateStart, setDueDateStart] = useState<Date | null>(null);
    const [dueDateEnd, setDueDateEnd] = useState<Date | null>(null);

    const rowCountRef = useRef(0);

    const rowCount = useMemo(() => {
        if (totalPages) {
            rowCountRef.current = totalPages;
        }
        return rowCountRef.current;
    }, [totalPages]);

    useEffect(() => {
        try {
            const getData = async () => {
                setLoading(true);
                let selectedInvoiceType = '';

                if (isIssuedChecked && !isReceivedChecked) {
                    selectedInvoiceType = 'issued';
                }
                if (!isIssuedChecked && isReceivedChecked) {
                    selectedInvoiceType = 'received';
                }
                let sortValue = '';

                if (sortCol) {
                    const sortDir = sortDirection === 'asc' ? '' : '-';
                    sortValue = `${sortDir}${sortCol}`;
                }
                const formattedPaymentDate = paymentDate ? format(paymentDate, 'yyyy-MM-dd') : '';
                const formattedDueDateStart = dueDateStart
                    ? format(dueDateStart, 'yyyy-MM-dd')
                    : '';
                const formatteddueDateEnd = dueDateEnd ? format(dueDateEnd, 'yyyy-MM-dd') : '';

                const queryString = `perPage=${paginationModel.pageSize}&
                    page[size]=${paginationModel.pageSize}&
                    page[number]=${paginationModel.page + 1}&
                    filter[invoiceType]=${selectedInvoiceType}&
                    filter[paymentStatus]=${selectedPaymentStatus}&
                    filter[paymentDate]=${formattedPaymentDate || ''}&
                    filter[dueDateStart]=${formattedDueDateStart || ''}&
                    filter[dueDateEnd]=${formatteddueDateEnd || ''}&
                    sort=${sortValue}`.replace(/\s+/g, '');

                const {
                    data: {
                        data,
                        meta: { total },
                    },
                } = await HTTP.get(
                    `${API_BASE_URL}/${API_VERSION}/invoicing/invoices?${queryString}`,
                );
                setTotalPages(total);

                setRows(
                    data.map((invoice: any) => {
                        return {
                            id: invoice.id,
                            ...invoice.attributes,
                        };
                    }),
                );
                setLoading(false);
            };

            getData();
        } catch (err) {
            console.log('Error in inoice search api', err);
            setLoading(false);
        }
    }, [
        paginationModel,
        sortCol,
        sortDirection,
        selectedStatus,
        selectedContractor,
        selectedPaymentStatus,
        isIssuedChecked,
        isReceivedChecked,
        updateCount, // Increment the count each time payment status is updated
        paymentDate,
        dueDateStart,
        dueDateEnd,
    ]);

    const onRowSelect = (params: any) => {
        setSelectedInvoiceId(params.row.id);
        setInvoiceDetailModal(true);
    };

    const onSortChange = (model: GridSortModel) => {
        const { field, sort } = extractSortParams(model);
        setSortCol(field);
        setSortDirection(sort);
    };

    return (
        <StyledPage>
            <Typography variant="h1">{t('page-titles.invoices')}</Typography>

            <Typography variant="h5" sx={{ fontSize: '32px' }}>
                {t('page-titles.invoices-subtitle')}
            </Typography>

            <Controls
                search={search}
                setSearch={setSearch}
                setRows={setRows}
                isReceivedChecked={isReceivedChecked}
                setIsReceivedChecked={setIsReceivedChecked}
                isIssuedChecked={isIssuedChecked}
                setIsIssuedChecked={setIsIssuedChecked}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedContractor={selectedContractor}
                setSelectedContractor={setSelectedContractor}
                selectedPaymentStatus={selectedPaymentStatus}
                setSelectedPaymentStatus={setSelectedPaymentStatus}
                paymentDate={paymentDate}
                setPaymentDate={setPaymentDate}
                dueDateStart={dueDateStart}
                setDueDateStart={setDueDateStart}
                dueDateEnd={dueDateEnd}
                setDueDateEnd={setDueDateEnd}
                setUpdateCount={setUpdateCount}
            />

            <DataGridPro
                onRowClick={onRowSelect}
                columns={columns({ t })}
                pagination
                rows={rows || []}
                rowCount={rowCount}
                loading={isLoading}
                paginationModel={paginationModel}
                sortingMode="server"
                filterMode="server"
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={onSortChange}
                pageSizeOptions={[15]}
                sx={{
                    // pointer cursor on ALL rows
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
            />

            <Drawer
                anchor="right"
                open={openInvoiceDetailModal}
                onClose={() => setInvoiceDetailModal(false)}
            >
                <ViewInvoice
                    setUpdateCount={setUpdateCount}
                    closeForm={setInvoiceDetailModal}
                    id={selectedInvoiceId}
                />
            </Drawer>
        </StyledPage>
    );
};

export default InvoiceList;
