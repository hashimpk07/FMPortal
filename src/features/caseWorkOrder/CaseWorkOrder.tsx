import { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress, Drawer, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';

import DataGridWrapper from './components/DataGridWrapper';
import Controls from './controls';
import ViewCaseInfo from './ViewCaseInfo';
import CreateForm from './CreateForm';
import { useDashboardStore } from '../dashboard/store/dashboardStore';
import HTTP from '../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../constants';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

interface StatusListProps {
    id: string;
    name: string;
}

interface CategoryListProps {
    id: number;
    name: string;
}

interface StoreListProps {
    id: number;
    name: string;
}
interface PropertyListProps {
    id: number;
    name: string;
}

// Add interface for the case record
interface CaseRecord {
    id: string | number;
    caseId: string | number;
    title?: string;
    path?: any[];
    createdAt?: string;
    centreId?: string;
    status?: any;
    description?: string;
    [key: string]: any; // Allow for additional properties
}

const CaseWorkOrder = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [viewCaseModal, setViewCaseModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [hastabs, setHasTabs] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<CaseRecord | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<StatusListProps | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryListProps | null>(null);
    const [selectedStore, setSelectedStore] = useState<StoreListProps | null>(null);
    const [dateCreatedFrm, setDateCreatedFrm] = useState<Date | null>(null);
    const [dateCreatedTo, setDateCreatedTo] = useState<Date | null>(null);
    const [dateModifiedFrm, setDateModifiedFrm] = useState<Date | null>(null);
    const [dateModifiedTo, setDateModifiedTo] = useState<Date | null>(null);
    const [propertyList, setPropertyList] = useState<PropertyListProps[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyListProps | null>(null);
    const [currentParentId, setCurrentParentId] = useState<number | null>(null);
    const [currentParentCategoryId, setCurrentParentCategoryId] = useState<number | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    // used to refresh grid table when new case is added or on case update
    const [newCaseCount, setNewCaseCount] = useState(0);
    // Add search query state
    const [searchQuery, setSearchQuery] = useState('');
    // Get URL params to check for ID
    const [searchParams, setSearchParams] = useSearchParams();

    // Track whether this is the initial mount
    const isInitialMountRef = useRef(true);
    const idFromUrlRef = useRef<string | null>(null);
    const hasLoadedTicketsRef = useRef(false);

    // Track state update batches to help with debugging
    const renderCountRef = useRef(0);

    // Get date range from dashboard store if navigating from dashboard
    const { startDate: dashboardStartDate, endDate: dashboardEndDate } = useDashboardStore();

    // Add a ref to track if data was edited in drawer
    const dataEditedInDrawerRef = useRef(false);

    // Function to refresh data when date range changes
    const handleDateRangeChange = useCallback(() => {
        // Force table data refresh
        setNewCaseCount((prev) => prev + 1);
    }, []);

    // Function to mark data as edited
    const markDataAsEdited = useCallback(() => {
        dataEditedInDrawerRef.current = true;
    }, []);

    // Function to fetch a specific case by ID
    const fetchCaseById = useCallback(
        async (caseId: string, parentId: number | null, currentParentCategoryId: number | null) => {
            try {
                setLoading(true);
                const response = await HTTP.get(
                    `${API_BASE_URL}/${API_VERSION}/tickets/${caseId}?include=centre,category`,
                );

                if (response.data && response.data.data) {
                    const caseData = response.data.data;
                    const included = response.data.included || [];

                    // Process centre data if included
                    const centreData: { [key: number]: string } = {};
                    included.forEach((data: any) => {
                        if (data.type === 'centres') {
                            centreData[data.id] = data.attributes.name;
                        }
                    });

                    // Format the case data to match the expected structure
                    const {
                        id,
                        attributes: { data, createdAt, status },
                        relationships: { centre, category },
                    } = caseData;

                    const createdDate = new Date(createdAt);
                    const formattedCase = {
                        id,
                        caseId: id,
                        title: data.title,
                        path: [id],
                        createdAt: createdDate.toISOString(),
                        centreId: centre?.data?.id ? centreData[centre.data.id] : undefined,
                        status: status.label,
                        parentId,
                        categoryId: category?.data?.id,
                        parentCategoryId: currentParentCategoryId,

                        // Add other fields needed for display
                    };

                    // Set the selected record and open the drawer
                    setSelectedRecord(formattedCase);
                    showSliderModal();
                    setLoading(false);
                    return formattedCase;
                }
            } catch (error) {
                console.error('Error fetching case details:', error);
                setLoading(false);
            }
            return null;
        },
        [],
    );

    // Initialize case info once on mount
    useLayoutEffect(() => {
        isInitialMountRef.current = true;
        hasLoadedTicketsRef.current = false;

        // Store the ID from URL for use in subsequent effects
        idFromUrlRef.current = searchParams.get('id');
    }, [searchParams]);

    // Handle URL parameters and dashboard state
    useEffect(() => {
        if (!isInitialMountRef.current) {
            return;
        }

        renderCountRef.current += 1;

        // Set appropriate state based on URL params
        let shouldTriggerRefresh = false;

        if (idFromUrlRef.current && dashboardStartDate && dashboardEndDate) {
            // Set the date range filters to match the dashboard
            setDateCreatedFrm(dashboardStartDate);
            setDateCreatedTo(dashboardEndDate);
            setDateModifiedFrm(dashboardStartDate);
            setDateModifiedTo(dashboardEndDate);
            shouldTriggerRefresh = true;
        } else if (!idFromUrlRef.current) {
            // If there's no ID in the URL, reset date range to null
            setDateCreatedFrm(null);
            setDateCreatedTo(null);
            setDateModifiedFrm(null);
            setDateModifiedTo(null);
            shouldTriggerRefresh = true;
        } else {
            // When we have an ID but no dates, still need to load tickets
            shouldTriggerRefresh = true;
        }

        // Always trigger refresh with ID in URL to ensure tickets load
        if (shouldTriggerRefresh) {
            const timer = setTimeout(() => {
                handleDateRangeChange();
                isInitialMountRef.current = false;
                hasLoadedTicketsRef.current = true;

                // If we have an ID in the URL, fetch the specific case
                if (idFromUrlRef.current) {
                    fetchCaseById(idFromUrlRef.current, currentParentId, currentParentCategoryId);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }

        isInitialMountRef.current = false;

        // If we have an ID in the URL but no date range filters, still fetch the case
        if (idFromUrlRef.current && !hasLoadedTicketsRef.current) {
            // Ensure tickets load even when coming directly to a URL with an ID
            handleDateRangeChange();
            hasLoadedTicketsRef.current = true;
            fetchCaseById(idFromUrlRef.current, currentParentId, currentParentCategoryId);
        }
    }, [
        searchParams,
        dashboardStartDate,
        dashboardEndDate,
        handleDateRangeChange,
        fetchCaseById,
        currentParentId,
        currentParentCategoryId,
    ]);

    // Handle row click
    const handleRowClick = (params: any) => {
        setLoading(true);
        setCurrentParentId(params.row.parentId);
        setCurrentParentCategoryId(params.row.parentCategoryId);
        // Update URL with selected case ID
        if (params.row.originalId) {
            searchParams.set('id', params.row.originalId);
            setSearchParams(searchParams);
        }
    };

    // Show modal
    const handleOpen = () => setOpen(true);
    const showSliderModal = () => {
        setViewCaseModal(true);
        handleOpen();
    };

    const handleClose = () => {
        // Get reference to current state before clearing
        const wasCaseModal = viewCaseModal;
        const wasSelectedRecord = selectedRecord;
        const wasIdInUrl =
            searchParams.has('id') && searchParams.get('id') === String(selectedRecord?.id);

        // Clear UI state
        setViewCaseModal(false);
        setShowCreateModal(false);
        setOpen(false);
        setSelectedRecord(null);

        // Clear the 'id' search parameter when closing the drawer
        if (searchParams.has('id')) {
            searchParams.delete('id');
            setSearchParams(searchParams);
        }

        // Only force a data refresh if necessary (when data was edited in drawer)
        if (dataEditedInDrawerRef.current && wasCaseModal && wasSelectedRecord && wasIdInUrl) {
            // Small delay to ensure state is cleaned up before refresh
            setTimeout(() => {
                handleDateRangeChange();
                // Reset the edited flag
                dataEditedInDrawerRef.current = false;
            }, 100);
        } else {
            // Reset the edited flag regardless
            dataEditedInDrawerRef.current = false;
        }
    };

    const handleCreate = () => {
        setHasTabs(true);
        setIsEdit(false);
        setShowCreateModal(true);
        handleOpen();
    };

    const editCase = () => {
        setHasTabs(false);
        setIsEdit(true);
        setViewCaseModal(false);
        setShowCreateModal(true);
        handleOpen();
    };

    return (
        <>
            <StyledPage>
                <Typography variant="h1">{t('page-titles.case-work')}</Typography>
                <Controls
                    onCreate={handleCreate}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedStore={selectedStore}
                    setSelectedStore={setSelectedStore}
                    dateCreatedFrm={dateCreatedFrm}
                    setDateCreatedFrm={setDateCreatedFrm}
                    dateCreatedTo={dateCreatedTo}
                    setDateCreatedTo={setDateCreatedTo}
                    dateModifiedFrm={dateModifiedFrm}
                    setDateModifiedFrm={setDateModifiedFrm}
                    dateModifiedTo={dateModifiedTo}
                    setDateModifiedTo={setDateModifiedTo}
                    propertyList={propertyList}
                    setPropertyList={setPropertyList}
                    selectedProperty={selectedProperty}
                    setSelectedProperty={setSelectedProperty}
                    onDateRangeChange={handleDateRangeChange}
                    onSearchChange={setSearchQuery}
                />
                <DataGridWrapper
                    onRowClick={handleRowClick}
                    isTreeData={true}
                    getTreeDataPath={(row) => row.path ?? []}
                    // selectedType={selectedType}
                    selectedStatus={selectedStatus}
                    selectedCategory={selectedCategory}
                    selectedStore={selectedStore}
                    dateCreatedFrm={dateCreatedFrm}
                    dateCreatedTo={dateCreatedTo}
                    dateModifiedFrm={dateModifiedFrm}
                    dateModifiedTo={dateModifiedTo}
                    selectedProperty={selectedProperty}
                    newCaseCount={newCaseCount}
                    searchQuery={searchQuery}
                />

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
                    {viewCaseModal && selectedRecord && (
                        <ViewCaseInfo
                            onClose={handleClose}
                            caseInfo={selectedRecord}
                            onEditCase={editCase}
                            newCaseCount={newCaseCount}
                            setNewCaseCount={setNewCaseCount}
                            onDataEdited={markDataAsEdited}
                        />
                    )}

                    {showCreateModal && (
                        <CreateForm
                            hastabs={hastabs}
                            isEdit={isEdit}
                            onCancel={handleClose}
                            initialTabIndex={0}
                            data={selectedRecord}
                            setData={setSelectedRecord}
                            setNewCaseCount={setNewCaseCount}
                            onDataEdited={markDataAsEdited}
                        />
                    )}
                </Drawer>
            </StyledPage>
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>
    );
};

export default CaseWorkOrder;
