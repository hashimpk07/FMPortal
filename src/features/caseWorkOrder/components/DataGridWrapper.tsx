import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import {
    DataGridPro,
    type GridSlotProps,
    type DataGridProProps,
    GridRenderCellParams,
    useGridApiContext,
    useGridSelector,
    gridFilteredDescendantCountLookupSelector,
    GridSortModel,
} from '@mui/x-data-grid-pro';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';
import { ButtonProps, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';
import columns from '../../../columnDefinitions/caseWorkOrder';
import { API_BASE_URL, API_VERSION } from '../../../constants';
import HTTP from '../../../utils/api/helpers/axios';
// import ImageIcon from '@mui/icons-material/Image';

interface DataGridWrapperProps {
    onRowClick: (params: any) => void;
    isTreeData?: boolean;
    getTreeDataPath?: (row: any) => string[];
    selectedStatus: StatusListProps | null;
    selectedCategory: CategoryListProps | null;
    selectedStore: StoreListProps | null;
    dateCreatedFrm: Date | null;
    dateCreatedTo: Date | null;
    dateModifiedFrm: Date | null;
    dateModifiedTo: Date | null;
    selectedProperty: PropertyListProps | null;
    newCaseCount: number;
    searchQuery: string;
}

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

interface RowRecord {
    id: string;
    originalId?: string;
    caseId: string;
    title: string;
    path: string[];
    createdAt: string;
    centre?: string;
    centreId?: string;
    priority?: string;
    status: string;
    parentId: string | null;
    unreadComments?: boolean;
    categoryId?: string | number;
}

const DataGridWrapper = ({
    onRowClick,
    isTreeData = false,
    selectedStatus,
    selectedCategory,
    selectedStore,
    dateCreatedFrm,
    dateCreatedTo,
    dateModifiedFrm,
    dateModifiedTo,
    selectedProperty,
    newCaseCount,
    searchQuery,
}: DataGridWrapperProps) => {
    const { t } = useTranslation();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 15,
    });
    const [total, setTotal] = useState(0);
    const [records, setRecords] = useState<any>([]);
    const [sortCol, setSortCol] = useState('');
    const [sortDirection, setSortDirection] = useState<string | null | undefined>('asc');
    const [isLoading, setLoading] = useState(false);
    const rowCountRef = useRef(0);

    // Add component render counter for debugging
    const renderCountRef = useRef(0);
    const apiCallCountRef = useRef(0);
    const previousNewCaseCountRef = useRef(newCaseCount);
    const isInitialRenderRef = useRef(true);

    // Tracking previous props for debugging
    const prevPropsRef = useRef({
        newCaseCount,
        selectedStatus,
        selectedCategory,
        selectedStore,
        dateCreatedFrm,
        dateCreatedTo,
        dateModifiedFrm,
        dateModifiedTo,
        selectedProperty,
    });

    // Add a ref to track if we've already loaded data for current filters
    const hasLoadedInitialDataRef = useRef(false);
    const currentQueryStringRef = useRef<string | null>(null);

    // Log detailed changes for debugging
    useEffect(() => {
        renderCountRef.current += 1;

        // Update the ref for the next render
        prevPropsRef.current = {
            newCaseCount,
            selectedStatus,
            selectedCategory,
            selectedStore,
            dateCreatedFrm,
            dateCreatedTo,
            dateModifiedFrm,
            dateModifiedTo,
            selectedProperty,
        };
    });

    const setPaginationModelFunc = useCallback((newModel: DataGridProProps['paginationModel']) => {
        setPaginationModel(newModel as any);
    }, []);

    const rowCount = useMemo(() => {
        if (total) {
            rowCountRef.current = total;
        }
        return rowCountRef.current;
    }, [total]);

    // Apply search filter to records
    const filteredRecords = useMemo(() => {
        if (!searchQuery) return records;
        if (!Array.isArray(records)) {
            console.error('Records is not an array:', records);
            return [];
        }

        let filteredRecordCount = 0;
        const removedCaseIds: number[] = [];
        const finalRecord = records.filter((row: any) => {
            const status = Object.values(row).some((field) =>
                String(field).toLowerCase().includes(searchQuery.toLowerCase()),
            );
            // To count case records
            if (row.path.length === 1 && status) {
                filteredRecordCount++;
            }
            // To collect removed case IDs
            if (row.path.length === 1 && !status) {
                removedCaseIds.push(row.originalId);
            }
            // remove child work order if parent case is removed
            if (row.path.length > 1) {
                const hasRemovedParent = row.path.some((id: number) => removedCaseIds.includes(id));
                if (hasRemovedParent) {
                    return false;
                }
            }
            return status;
        });

        setTotal(filteredRecordCount);
        return finalRecord;
    }, [records, searchQuery]);

    // Fix for records object not being an array - provide a fallback
    const validFilteredRecords = Array.isArray(filteredRecords) ? filteredRecords : [];

    const slotProps = {
        loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
        },
    } as GridSlotProps;

    const CustomGridTreeDataGroupingCell = (props: GridRenderCellParams) => {
        const { id, field, rowNode, row } = props;
        const apiRef = useGridApiContext();
        const filteredDescendantCountLookup = useGridSelector(
            apiRef,
            gridFilteredDescendantCountLookupSelector,
        );
        const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

        const handleClick: ButtonProps['onClick'] = (event: any) => {
            if (rowNode.type !== 'group') {
                return;
            }

            apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
            apiRef.current.setCellFocus(id, field);
            event.stopPropagation();
        };

        return (
            <Box
                sx={{
                    ml: rowNode.depth * 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    height: '100%',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '30px',
                    }}
                >
                    {row.unreadComments && (
                        <img
                            alt=""
                            src="caseworkorder.png"
                            style={{ width: '30px', height: '30px' }}
                        />
                    )}
                </div>

                {row.hasAttachment && (
                    <IconButton
                        aria-label="attach file"
                        sx={{
                            backgroundColor: 'grey.300',
                            height: 30,
                            width: 30,
                            borderRadius: '50%',
                            padding: 0,
                            '&:hover': {
                                backgroundColor: 'grey.500',
                            },
                        }}
                    >
                        <AttachFileIcon />
                    </IconButton>
                )}

                {filteredDescendantCount > 0 && rowNode.type === 'group' && (
                    <IconButton onClick={handleClick} size="small" tabIndex={-1}>
                        {rowNode.childrenExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                )}
            </Box>
        );
    };

    const groupingColDef: DataGridProProps['groupingColDef'] = {
        headerName: '',
        width: 150,
        renderCell: (params) => {
            return <CustomGridTreeDataGroupingCell {...params} />;
        },
    };

    const getRecord = (record: any, centreData: any) => {
        try {
            // Handle case when record doesn't match expected structure
            if (!record || !record.attributes) {
                console.error('Invalid record structure:', record);
                return {
                    id: record?.id || 'unknown',
                    caseId: record?.id || 'unknown',
                    title: 'Unknown Title',
                    path: [record?.id || 'unknown'],
                    createdAt: new Date().toLocaleDateString(),
                    status: 'Unknown Status',
                    parentId: null,
                    hasAttachment: false,
                    unreadComments: false,
                    categoryId: null,
                };
            }

            const {
                id,
                attributes: { data, createdAt, status, unreadComments, priority, hasAttachment },
                relationships, // relationships don't exist for workOrder type
            } = record;

            const centre = relationships?.centre;
            const categoryId = relationships?.category?.data?.id;

            const priorityList: any = {
                4: 'urgent',
                3: 'high',
                2: 'medium',
                1: 'low',
            };

            const priorityInfo = priorityList[priority];
            const priorityImg = priority ? `/assets/images/${priorityInfo}.svg` : '';
            const createdDate = new Date(createdAt);

            // Ensure the ID is treated as a string to avoid comparison issues
            const recordId = String(id);

            return {
                id: recordId,
                originalId: recordId, // Keep original ID for API calls
                caseId: recordId,
                title: data?.title || 'No Title',
                path: [recordId], // Path for tree data - single node path for parent
                createdAt: format(createdDate, 'dd/MM/yyyy'),
                centre: centreData[centre?.data?.id] || 'Unknown Centre',
                centreId: centre?.data?.id,
                priority: priorityImg,
                priorityValue: priority,
                status: status?.label || 'Unknown Status',
                parentId: null, // This is a parent record
                unreadComments: unreadComments || false,
                parentCategoryId: null,
                categoryId,
                hasAttachment,
            };
        } catch (error) {
            console.error('Error in getRecord:', error, record);
            // Return fallback record to prevent UI from breaking
            return {
                id: String(record?.id || 'error-id'),
                caseId: String(record?.id || 'error-id'),
                title: 'Error Processing Record',
                path: [String(record?.id || 'error-id')],
                createdAt: new Date().toLocaleDateString(),
                status: 'Error',
                parentId: null,
            };
        }
    };

    const getCaseWorkOrderData = useCallback(async () => {
        // Add a safety timeout to reset loading state if something goes wrong
        const safetyTimer = setTimeout(() => {
            if (isLoading) {
                console.warn('Safety timeout: resetting loading state after timeout');
                setLoading(false);
            }
        }, 10000);

        if (searchQuery.length > 0) {
            currentQueryStringRef.current = '';
            // Avoid backend API call on search beacuse for now search filter only current page records
            return;
        }

        try {
            setLoading(true);
            const sortDir = sortDirection === 'asc' ? '' : '-';
            const sortValue = `${sortDir}${sortCol}`;

            // Format dates with proper ISO format
            const formattedDateCreatedFrm = dateCreatedFrm
                ? `${format(dateCreatedFrm, 'yyyy-MM-dd')}T00:00:00.000000Z`
                : '';
            const formattedDateCreatedTo = dateCreatedTo
                ? `${format(dateCreatedTo, 'yyyy-MM-dd')}T23:59:59.000000Z`
                : '';
            const formattedDateModifiedFrm = dateModifiedFrm
                ? `${format(dateModifiedFrm, 'yyyy-MM-dd')}T00:00:00.000000Z`
                : '';
            const formattedDateModifiedTo = dateModifiedTo
                ? `${format(dateModifiedTo, 'yyyy-MM-dd')}T23:59:59.000000Z`
                : '';

            const queryString = `page=${paginationModel.page + 1}&
                filter[status]=${selectedStatus?.id || ''}&
                filter[centreId]=${selectedProperty?.id || ''}&
                filter[localId]=${selectedStore?.id || ''}&
                filter[categoryId]=${selectedCategory?.id || ''}&
                filter[createdAfter]=${formattedDateCreatedFrm || ''}&
                filter[createdBefore]=${formattedDateCreatedTo || ''}&
                filter[lastTouchedAfter]=${formattedDateModifiedFrm || ''}&
                filter[lastTouchedBefore]=${formattedDateModifiedTo || ''}&
                sort=${sortValue}`.replace(/\s+/g, '');

            // Check if we're making an identical request to one we've just made
            if (queryString === currentQueryStringRef.current && hasLoadedInitialDataRef.current) {
                setLoading(false);
                clearTimeout(safetyTimer);
                return;
            }

            // Update the current query string ref
            currentQueryStringRef.current = queryString;

            apiCallCountRef.current += 1;

            // Fetch data from API
            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/tickets?filter[type]=cases&` +
                    `include=centre,children,category,parent,attachedMedia&${queryString}`,
            );

            // Extract data more safely (handling different response structures)
            let responseData, data, included, total;

            try {
                responseData = response.data;

                // Check if responseData is an array (direct data) or has a data property
                if (Array.isArray(responseData)) {
                    data = responseData;
                    included = []; // No included data in this format
                    total = data.length;
                } else if (responseData && typeof responseData === 'object') {
                    // Standard JSON:API format
                    data = responseData.data || [];
                    included = responseData.included || [];
                    total = responseData.meta?.total || data.length || 0;
                } else {
                    // Unexpected format
                    console.error('Unexpected API response format:', responseData);
                    data = [];
                    included = [];
                    total = 0;
                }
            } catch (parseError) {
                console.error('Error parsing API response:', parseError);
                data = [];
                included = [];
                total = 0;
            }

            const workOrderData: any = {};
            const workOrderRecords: any = [];
            const centreData: { [key: number]: string } = {};

            // eslint-disable-next-line no-unused-expressions
            if (included && included.length > 0) {
                included.forEach((data: any) => {
                    const priorityList: any = {
                        4: 'urgent',
                        3: 'high',
                        2: 'medium',
                        1: 'low',
                    };

                    const priority = priorityList[data.attributes.priority];
                    const priorityImg = priority ? `/assets/images/${priority}.svg` : '';

                    if (data.type === 'centres') {
                        centreData[data.id] = data.attributes.name;
                    }
                    if (data.type === 'tickets') {
                        const createdDate = new Date(data.attributes.createdAt);
                        workOrderData[data.id] = {
                            id: data.id,
                            caseId: data.id,
                            title: data.attributes.data.title,
                            createdAt: format(createdDate, 'dd/MM/yyyy'),
                            priority: priorityImg,
                            priorityValue: priority,
                            status: data.attributes.status.label,
                            unreadComments: data.attributes.unreadComments,
                            hasAttachment: data.attributes.hasAttachment,
                        };
                    }
                });
            }

            // Add fallback if data is empty or invalid
            if (!data || !Array.isArray(data) || data.length === 0) {
                // No need to log this as it's not an error condition
                setTotal(0);
                setRecords([]);
                setLoading(false);
                apiCallCountRef.current = Math.max(0, apiCallCountRef.current - 1);
                hasLoadedInitialDataRef.current = true;
                return;
            }

            try {
                const caseWorkOrderRecords = data.map((caseData: any) => {
                    try {
                        const centreInfo = caseData?.relationships?.centre?.data;
                        const childData = caseData?.relationships?.children?.data;
                        const parentCategoryId = caseData?.relationships?.category?.data?.id;

                        if (childData && Array.isArray(childData)) {
                            childData.forEach((record: any) => {
                                if (record && record.type === 'tickets' && record.id) {
                                    // Use a composite ID for work orders to ensure uniqueness in tree structures
                                    // This prevents duplicate ID errors in MUI X DataGrid
                                    const workOrderId = `${caseData.id}_child_${record.id}`;

                                    const workOrderRecord = workOrderData[record.id];

                                    // Skip if we don't have data for this work order
                                    if (!workOrderRecord) {
                                        // Don't need to log this as it's a normal case
                                        return;
                                    }

                                    workOrderRecords.push({
                                        ...workOrderRecord,
                                        // Use a unique ID for the work order in the grid
                                        id: workOrderId,
                                        // Keep original ID as a separate field for API calls
                                        originalId: record.id,
                                        caseId: record.id,
                                        centre: centreData[centreInfo?.id] || 'Unknown Centre',
                                        centreId: centreInfo?.id,
                                        parentId: caseData.id,
                                        // Keep a parent-child path for tree structure
                                        path: [caseData.id, workOrderId],
                                        parentCategoryId,
                                    });
                                }
                            });
                        }
                        return getRecord(caseData, centreData);
                    } catch (itemErr) {
                        console.error('Error processing case item:', itemErr, caseData);
                        // Return a minimal valid record to prevent the whole list from failing
                        return {
                            id: caseData.id || 'unknown-id',
                            caseId: caseData.id || 'unknown-id',
                            title: caseData.attributes?.data?.title || 'Error: Invalid Data',
                            path: [caseData.id || 'unknown-id'],
                            status: 'Error',
                            createdAt: new Date().toLocaleDateString(),
                        };
                    }
                });

                // Only include unique IDs in the final records
                const allRecords = [...caseWorkOrderRecords];

                // Check workOrderRecords for duplicates before adding them
                workOrderRecords.forEach((workOrder: RowRecord) => {
                    const exists = allRecords.some((record) => record.id === workOrder.id);
                    if (!exists) {
                        allRecords.push(workOrder);
                    }
                    // No need to log skipped duplicates
                });

                setTotal(total);
                setRecords(allRecords);
            } catch (mapError) {
                console.error('Error mapping case work order records:', mapError);
                setTotal(0);
                setRecords([]);
            } finally {
                setLoading(false);
                clearTimeout(safetyTimer);

                // Reset API call counter once completed
                apiCallCountRef.current = Math.max(0, apiCallCountRef.current - 1);

                // After successfully loading data, set the flag to true
                hasLoadedInitialDataRef.current = true;
            }
        } catch (err) {
            console.error('Error in case work order list API', err);
            setRecords([]);
            setLoading(false);
            clearTimeout(safetyTimer);

            // Reset API call counter on error
            apiCallCountRef.current = Math.max(0, apiCallCountRef.current - 1);
        }
    }, [
        paginationModel.page,
        paginationModel.pageSize,
        sortCol,
        sortDirection,
        selectedStatus,
        selectedCategory,
        selectedStore,
        dateCreatedFrm,
        dateCreatedTo,
        dateModifiedFrm,
        dateModifiedTo,
        selectedProperty,
        searchQuery,
        isLoading, // Add isLoading to dependencies to avoid concurrent calls
    ]);

    // First useEffect for initial load - this should only run once
    useEffect(() => {
        if (!hasLoadedInitialDataRef.current) {
            getCaseWorkOrderData();
        }
    }, [getCaseWorkOrderData]);

    // Add useEffect to trigger data fetch when pagination changes
    useEffect(() => {
        if (hasLoadedInitialDataRef.current) {
            getCaseWorkOrderData();
        }
    }, [paginationModel, getCaseWorkOrderData]);

    // Second useEffect: For newCaseCount changes - optimize to avoid unnecessary calls
    useEffect(() => {
        // Skip if it's just the initialization from 0->0 (which happens on mount)
        if (
            isInitialRenderRef.current &&
            newCaseCount === 0 &&
            previousNewCaseCountRef.current === 0
        ) {
            isInitialRenderRef.current = false;
            return;
        }

        // Skip if the newCaseCount hasn't actually changed (can happen due to dependency array)
        if (previousNewCaseCountRef.current === newCaseCount && !isInitialRenderRef.current) {
            return;
        }

        // Update the reference for next time
        previousNewCaseCountRef.current = newCaseCount;
        isInitialRenderRef.current = false;

        // Reset the query string to force a fresh request
        // This ensures that a new request is made after data changes (i.e., edits, new cases, etc.)
        if (newCaseCount > 0) {
            currentQueryStringRef.current = null;
        }

        // Add a flag to the ref to track current loading state
        // This prevents data requests while another is in progress
        if (apiCallCountRef.current > 0) {
            // Wait for the current API call to complete
        } else {
            // Make the API call
            getCaseWorkOrderData();
        }
    }, [newCaseCount, getCaseWorkOrderData]);

    const onSortChange = (model: GridSortModel) => {
        let sortField = model[0]?.field;

        if (sortField === 'status') {
            sortField = 'ticket_status.name';
        }
        setSortCol(sortField || '');
        setSortDirection(model[0]?.sort || 'asc');
    };

    const memoizedColumns = useMemo(() => {
        return columns({ t });
    }, []);

    return (
        <DataGridPro
            loading={isLoading}
            columns={memoizedColumns}
            rows={validFilteredRecords}
            rowCount={rowCount}
            pageSizeOptions={[15]}
            paginationModel={paginationModel}
            pagination={true}
            onPaginationModelChange={setPaginationModelFunc}
            paginationMode="server"
            slotProps={slotProps}
            onRowClick={onRowClick}
            treeData={isTreeData}
            getRowId={(row) => row.id}
            getTreeDataPath={(row) => {
                // Ensure we always use the path array if available, or generate one based on parentId
                if (Array.isArray(row.path) && row.path.length > 0) {
                    return row.path;
                }
                return row.parentId ? [row.parentId, row.id] : [row.id];
            }}
            groupingColDef={groupingColDef}
            onSortModelChange={onSortChange}
            sx={{
                '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer',
                },
            }}
        />
    );
};

export default DataGridWrapper;
