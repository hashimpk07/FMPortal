import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, Typography } from '@mui/material';
import styled from '@emotion/styled';
import debounce from 'lodash.debounce';
import contractorDatabase from '../../services/contractorDatabase';
import type {
    ContractorDatabaseData as ContractorDatabaseDataType,
    MetaData,
} from '../../types/pageTypes';
import Controls from './Controls';
import ContractorDetail from './ContractorDetail';
import AddContractor from './AddContractor';
import DataGridWrapper from './components/DataGridWrapper';
import snackbar from '../../utils/ts/helper/snackbar';
import { RANDOM_AVATAR } from '../../constants';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

interface ContractorInfoprops {
    id?: number | null;
    imageUrl?: string;
    companyName: string;
    selectedCompanyId?: number;
    description: string;
    email: string;
    phoneNumber: string;
    rate: string;
    taxId: string;
    onlineStatus?: boolean;
    profileImage?: string;
    firstName: string;
    lastName: string;
    selectedRateUnit?: string;
    selectedRateUnitId?: number;
    addressline1: string;
    addressline2: string;
    country: string;
    city: string;
    street: string;
    postcode: string;
    selectedWorkOrder?: string;
    selectedWorkOrderId?: number;
    invoiceFiles?: File[];
    documentFiles?: File[];
    designation?: string;
    linkedInvoices?: InvoiceProps[];
    documents?: DocumentProps[];
    assignedWorkOrder?: WorkOrderProps[];
    isEdit?: boolean;
}

interface InvoiceProps {
    id: number;
    name: string;
    url: string;
}

interface DocumentProps {
    id: number;
    name: string;
    url: string;
    size?: string;
    lastUpdatedAt?: string;
    type?: string;
}

interface WorkOrderProps {
    id: number;
    name: string;
    url: string;
}
const DEBOUNCE_DELAY = 600;

const ContractorDatabase = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ContractorDatabaseDataType[]>();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [contractorInfo, setContractorinfo] = useState<ContractorInfoprops>();
    const [viewContractorModal, setViewContractorModal] = useState<boolean>(false);
    const [showContractorModal, setShowContractorModal] = useState<boolean>(false);
    const [isEditContractor, setIsEditContractor] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setViewContractorModal(false);
        setShowContractorModal(false);
        setIsEditContractor(false);
        setOpen(false);
    };
    const [page, setPage] = useState(0);
    const [meta, setMeta] = useState<MetaData>();
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const debouncedSetSearch = useMemo(
        () =>
            debounce((value) => {
                setPage(0);
                setDebouncedSearch(value);
            }, DEBOUNCE_DELAY),
        [setPage, setDebouncedSearch],
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            debouncedSetSearch(value);
        },
        [setSearch, debouncedSetSearch],
    );

    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const { data, errors, meta } = await contractorDatabase({
                page: page + 1,
                search: debouncedSearch,
            });

            if (errors) {
                snackbar(
                    `${errors}`,
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
                return;
            }

            setRows(data);
            setLoading(false);

            if (page + 1 === 1 && meta) {
                setMeta(meta);
            }
        };

        getData();
    }, [page, debouncedSearch]);

    const showSliderModal = (row: any) => {
        // pass the selected contractor id (from row) to get data details
        getContractorInfo(row.id);
        handleOpen();
    };

    const getContractorInfo = (userId: number) => {
        // api here
        setContractorinfo({
            id: userId || 1,
            firstName: 'Alex',
            lastName: 'Trapper',
            imageUrl: RANDOM_AVATAR,
            designation: 'Site manager',
            companyName: 'Oakwood Conveyancing',
            description: 'Site manager - Oakwood Conveyancing',
            email: 'alex@test.com',
            phoneNumber: '+22 7136 827319',
            rate: '£65',
            selectedRateUnit: 'Hour',
            taxId: '72534-738181',
            addressline1: 'Oakwood Conveyancing Ltd Suite 5B',
            addressline2: 'Ashton Building',
            country: 'United Kingdom',
            city: 'Birmingham',
            street: '12 Victoria Street',
            postcode: 'B1 1AA',
            linkedInvoices: [{ id: 10, name: 'INV-042', url: '' }],
            documents: [
                {
                    id: 100,
                    name: 'floor plan.png',
                    url: 'https://example.com/document2.pdf',
                    size: '3MB',
                    lastUpdatedAt: 'Modified 5 minutes ago',
                    type: 'DOC',
                },
                {
                    id: 101,
                    name: 'site plan.pdf',
                    url: 'https://example.com/document2.pdf',
                    size: '5MB',
                    lastUpdatedAt: 'Modified 30 minutes ago',
                    type: 'DOC',
                },
            ],
            assignedWorkOrder: [{ id: 1000, name: 'ASO-102', url: '' }],
            onlineStatus: true,
        });
    };

    const addContractor = () => {
        setShowContractorModal(true);
        handleOpen();
    };

    const submitAdd = (data: ContractorInfoprops) => {
        // api here... to add/edit contractor using if(data.isEdit)
        handleClose();
        const msg = data.isEdit
            ? t('snackbar.contractor-details-edited')
            : t('snackbar.contractor-details-added');
        return snackbar(msg, 'default', { horizontal: 'center', vertical: 'bottom' }, 2000);
    };

    const editContractor = () => {
        setIsEditContractor(true);
        setViewContractorModal(false);
        setShowContractorModal(true);
        handleOpen();
    };

    return (
        <StyledPage>
            <Typography variant="h1">{t('page-titles.contractor-database')}</Typography>

            <Typography variant="h2">{t('page-titles.contractor-database-subtitle')}</Typography>

            <Controls search={search} setSearch={handleSearchChange} onAdd={addContractor} />

            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                {viewContractorModal && contractorInfo && (
                    <ContractorDetail
                        onClose={handleClose}
                        data={contractorInfo}
                        onEdit={editContractor}
                    />
                )}
                {showContractorModal && (
                    <AddContractor
                        onSubmit={submitAdd}
                        onCancel={handleClose}
                        data={contractorInfo}
                        isEdit={isEditContractor}
                    />
                )}
            </Drawer>

            <DataGridWrapper
                rows={rows || []}
                loading={loading}
                meta={meta}
                setPage={setPage}
                onRowClick={(params) => {
                    setViewContractorModal(true);
                    showSliderModal(params.row);
                }}
            />
        </StyledPage>
    );
};

export default ContractorDatabase;
