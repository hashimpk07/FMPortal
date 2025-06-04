import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    Checkbox,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import Pagination from '@mui/material/Pagination';
import WorkOrderDetailView from '../WorkOrderDetailView';
import {
    fetchWorkOrderComments,
    addWorkOrderComment,
} from '../../services/workOrders/workOrderCommentsService';
import AssetDetailsSkeleton from '../Closet/AssetDetailsSkeleton';

// Import services
import {
    categoryService,
    statusService,
    fetchWorkOrdersList,
    fetchWorkOrderDetail,
    type WorkOrderData,
} from '../../services/workOrders';
import { Status } from '../../services/workOrders/statusService';
import type { FormattedComment } from '../../services/workOrders/workOrderCommentsService';
import { useAssetManagementStore } from '../../store/assetManagementStore';
import { fetchAssetDetails } from '../../services/assets/assetService';
import type { AssetDetailResponse } from '../../services/types';

// Empty state SVG component
const EmptyStateIcon = () => (
    <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="100" cy="100" r="100" fill="#F5F5F5" />
        <rect
            x="60"
            y="50"
            width="80"
            height="100"
            rx="4"
            fill="white"
            stroke="#E0E0E0"
            strokeWidth="2"
        />
        <line x1="70" y1="70" x2="130" y2="70" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="110" x2="130" y2="110" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="130" x2="100" y2="130" stroke="#E0E0E0" strokeWidth="2" />
    </svg>
);

// Use WorkOrderData from the service directly
type WorkOrder = WorkOrderData;

interface WorkOrderSelectionModalProps {
    open: boolean;
    onClose: () => void;
    assetId: string;
    onWorkOrderAssign: (workOrders: string[]) => Promise<void>;
}

interface WorkOrderFilters {
    status: string;
    category: string;
    dueDate: string;
    search: string;
}

interface PaginationState {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

function WorkOrderSelectionModal({
    open,
    onClose,
    // @ts-expect-error - Required by interface but not used in this component
    assetId,
    onWorkOrderAssign,
}: WorkOrderSelectionModalProps) {
    const { t } = useTranslation();
    // Get the selected center ID from the store
    const selectedCentreId = useAssetManagementStore((state) => state.selectedCentreId);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<WorkOrderFilters>({
        status: '',
        category: '',
        dueDate: '',
        search: '',
    });
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
    const [selectedWorkOrders, setSelectedWorkOrders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedWorkOrderComments, setSelectedWorkOrderComments] = useState<FormattedComment[]>(
        [],
    );
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalItems: 0,
    });

    // Add state for asset details
    const [assetDetails, setAssetDetails] = useState<AssetDetailResponse | null>(null);
    const [assetLoading, setAssetLoading] = useState(false);
    const [assetError, setAssetError] = useState<Error | null>(null);

    // Add state for work order details
    const [workOrderLoading, setWorkOrderLoading] = useState(false);
    const [workOrderError, setWorkOrderError] = useState<Error | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    // Fetch categories and statuses when the modal opens
    useEffect(() => {
        if (open) {
            fetchCategoriesAndStatuses();
        }
    }, [open]);

    // Fetch work orders when filters or pagination changes
    useEffect(() => {
        if (open) fetchWorkOrders();
    }, [filters, pagination.currentPage, open]);

    // Fetch comments when a work order is selected
    useEffect(() => {
        if (selectedWorkOrder) {
            setCommentsLoading(true);
            setCommentsError(null);
            fetchWorkOrderComments(selectedWorkOrder.id)
                .then((comments) => {
                    setSelectedWorkOrderComments(comments);
                })
                .catch((err) =>
                    setCommentsError(
                        err instanceof Error ? err : new Error('Failed to fetch comments'),
                    ),
                )
                .finally(() => setCommentsLoading(false));
        } else {
            setSelectedWorkOrderComments([]);
        }
    }, [selectedWorkOrder]);

    const fetchCategoriesAndStatuses = async () => {
        try {
            // Fetch categories using the categories API endpoint with the correct filter
            if (!selectedCentreId) {
                throw new Error(t('errors.no-centre-selected', 'No centre selected'));
            }

            const categoriesResponse = await categoryService.fetchWorkOrderCategories(
                String(selectedCentreId),
            );

            // Map categories to the format needed for the dropdown
            const formattedCategories = categoriesResponse.data.map((category: any) => ({
                id: category.id,
                name: category.attributes.name,
            }));

            setCategories(formattedCategories);

            // Fetch statuses from the tickets/statuses endpoint
            const statusesResponse = await statusService.fetchWorkOrderStatuses();
            setStatuses(statusesResponse);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Failed to fetch categories and statuses'),
            );
        }
    };

    // Fetch work orders with server-side pagination
    const fetchWorkOrders = async () => {
        try {
            // Cancel any ongoing requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create a new abort controller for this request
            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            // Build the parameters for the API call
            const params: {
                page?: number;
                pageSize?: number;
                status?: string;
                search?: string;
                include?: string[];
                categoryId?: string;
                dueDate?: string;
            } = {
                page: pagination.currentPage,
                pageSize: pagination.pageSize,
                include: ['centre', 'category'],
            };

            // Apply status filter
            if (filters.status) {
                params.status = filters.status;
            }

            // Apply search filter
            if (filters.search) {
                params.search = filters.search;
            }

            // Apply category filter
            if (filters.category) {
                params.categoryId = filters.category;
            }

            // Apply due date filter
            if (filters.dueDate) {
                params.dueDate = filters.dueDate;
            }

            // Fetch the work orders from the API
            const result = await fetchWorkOrdersList(params);

            // Update work orders with the data from the API
            setWorkOrders(result.data);

            // Update pagination state based on the API response
            setPagination({
                currentPage: result.meta.current_page,
                totalPages: result.meta.last_page,
                pageSize: result.meta.per_page,
                totalItems: result.meta.total,
            });
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(
                              `Failed to fetch work orders: ${typeof err === 'object' ? JSON.stringify(err) : String(err)}`,
                          ),
                );
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            category: '',
            dueDate: '',
            search: '',
        });
        setSearchQuery('');
        setPagination({
            ...pagination,
            currentPage: 1,
        });
        // No fetchWorkOrders here
    };

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            search: searchQuery,
        }));
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        // No fetchWorkOrders here
    };

    const handleFilterChange = (filterType: keyof WorkOrderFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        // No fetchWorkOrders here
    };

    const handleWorkOrderSelect = async (workOrder: WorkOrder) => {
        // Set the initially selected work order from the list
        setSelectedWorkOrder(workOrder);

        // Reset asset details when selecting a new work order
        setAssetDetails(null);
        setAssetError(null);

        // Reset work order error
        setWorkOrderError(null);

        try {
            // Fetch detailed work order information
            setWorkOrderLoading(true);
            const workOrderDetailResponse = await fetchWorkOrderDetail({
                id: workOrder.id,
                // include: ['category', 'centre', 'form', 'media'],
                include: ['category', 'centre', 'form'],
            });

            // Update the selected work order with complete details
            setSelectedWorkOrder(workOrderDetailResponse.data);

            // Check if the work order has an asset relationship
            const workOrderWithDetails = workOrderDetailResponse.data;
            if (workOrderWithDetails.relationships?.asset?.data?.id) {
                try {
                    setAssetLoading(true);

                    // Fetch asset details with the specified includes
                    const assetId = workOrderWithDetails.relationships.asset.data.id;
                    const assetResponse = await fetchAssetDetails(assetId, [
                        'assetGroup',
                        'tags',
                        'centre',
                    ]);
                    setAssetDetails(assetResponse);
                } catch (err) {
                    console.error('Error fetching asset details:', err);
                    setAssetError(
                        err instanceof Error ? err : new Error('Failed to fetch asset details'),
                    );
                } finally {
                    setAssetLoading(false);
                }
            }
        } catch (err) {
            console.error('Error fetching work order details:', err);
            setWorkOrderError(
                err instanceof Error ? err : new Error('Failed to fetch work order details'),
            );
        } finally {
            setWorkOrderLoading(false);
        }
    };

    // Toggle selection for a work order
    const toggleWorkOrderSelection = (workOrder: WorkOrder) => {
        setSelectedWorkOrders((prev) => {
            if (prev.includes(workOrder.id)) {
                return prev.filter((id) => id !== workOrder.id);
            }
            return [...prev, workOrder.id];
        });
    };

    // Handle assigning selected work orders
    const handleAssignWorkOrders = async () => {
        try {
            setLoading(true);
            await onWorkOrderAssign(selectedWorkOrders);
            onClose();
        } catch (err) {
            console.error('Error assigning work orders:', err);
            setError(err instanceof Error ? err : new Error('Failed to assign work orders'));
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (comment: string, isInternal: boolean) => {
        if (!selectedWorkOrder) throw new Error('No work order selected');
        await addWorkOrderComment(selectedWorkOrder.id, comment, isInternal);
        // Explicitly refresh comments after adding
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            const comments = await fetchWorkOrderComments(selectedWorkOrder.id);
            setSelectedWorkOrderComments(comments);
        } catch (err) {
            setCommentsError(err instanceof Error ? err : new Error('Failed to fetch comments'));
        } finally {
            setCommentsLoading(false);
        }
    };

    if (error) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {t('asset.error')}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error">{error.message}</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{t('asset.close')}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Format the work order details for display
    const getWorkOrderTitle = (workOrder: WorkOrder) => {
        return workOrder.attributes.data?.title || t('asset.no-value');
    };

    const getWorkOrderDescription = (workOrder: WorkOrder) => {
        return workOrder.attributes.data?.description || t('asset.no-description');
    };

    const getWorkOrderStatus = (workOrder: WorkOrder): string => {
        if (workOrder.attributes.status.label) {
            return workOrder.attributes.status.label;
        }
        return t('asset.no-value');
    };

    const getWorkOrderDueDate = (workOrder: WorkOrder) => {
        const dueDate = workOrder.attributes.data?.reserved_due_date;
        if (!dueDate) return t('asset.no-value');

        try {
            return format(new Date(dueDate), 'dd/MM/yyyy');
        } catch {
            return t('asset.no-value');
        }
    };

    // Restore dueDates array for due date filter dropdown
    const dueDates = [
        { id: 'today', name: t('work-order.due-today') },
        { id: 'this_week', name: t('work-order.due-this-week') },
        { id: 'this_month', name: t('work-order.due-this-month') },
        { id: 'past_due', name: t('work-order.past-due') },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    maxHeight: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {t('asset.add-work-order')}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    }}
                >
                    {/* Left Column - Search and Work Order List */}
                    <Box
                        sx={{
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {/* Search Field */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                placeholder={t('asset.search')}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                                disabled={loading}
                            />
                            <Button variant="contained" onClick={handleSearch} disabled={loading}>
                                {t('buttons.search')}
                            </Button>
                        </Box>

                        {/* Filter Dropdowns */}
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <FormControl fullWidth size="small" disabled={loading}>
                                    <InputLabel id="status-select-label">
                                        {t('asset.status')}
                                    </InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        value={filters.status}
                                        onChange={(e) =>
                                            handleFilterChange('status', e.target.value)
                                        }
                                        label={t('asset.status')}
                                    >
                                        <MenuItem value="">
                                            <em>{t('asset.all')}</em>
                                        </MenuItem>
                                        {statuses.map((status) => (
                                            <MenuItem key={status.id} value={status.id}>
                                                {status.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth size="small" disabled={loading}>
                                    <InputLabel id="category-select-label">
                                        {t('asset.category')}
                                    </InputLabel>
                                    <Select
                                        labelId="category-select-label"
                                        value={filters.category}
                                        onChange={(e) =>
                                            handleFilterChange('category', e.target.value)
                                        }
                                        label={t('asset.category')}
                                    >
                                        <MenuItem value="">
                                            <em>{t('asset.all')}</em>
                                        </MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <FormControl fullWidth size="small" disabled={loading}>
                                    <InputLabel id="due-date-select-label">
                                        {t('work-order.due-date')}
                                    </InputLabel>
                                    <Select
                                        labelId="due-date-select-label"
                                        value={filters.dueDate}
                                        onChange={(e) =>
                                            handleFilterChange('dueDate', e.target.value)
                                        }
                                        label={t('work-order.due-date')}
                                    >
                                        <MenuItem value="">
                                            <em>{t('asset.all')}</em>
                                        </MenuItem>
                                        {dueDates.map((dueDate: { id: string; name: string }) => (
                                            <MenuItem key={dueDate.id} value={dueDate.id}>
                                                {dueDate.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="text"
                                    onClick={handleClearFilters}
                                    disabled={
                                        loading ||
                                        (!filters.status &&
                                            !filters.category &&
                                            !filters.dueDate &&
                                            !searchQuery)
                                    }
                                    sx={{ ml: 2, whiteSpace: 'nowrap' }}
                                >
                                    {t('buttons.clear-filter')}
                                </Button>
                            </Box>
                        </Box>

                        {/* Work Orders List and Loading State */}
                        <Paper
                            sx={{
                                flex: 1,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                position: 'relative',
                            }}
                            variant="outlined"
                        >
                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        minHeight: 300,
                                    }}
                                >
                                    <CircularProgress />
                                    <Typography sx={{ mt: 2 }}>
                                        {t('asset.loading-data')}
                                    </Typography>
                                </Box>
                            ) : workOrders.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        p: 3,
                                    }}
                                >
                                    <EmptyStateIcon />
                                    <Typography
                                        color="text.secondary"
                                        sx={{ mt: 2 }}
                                        component="div"
                                    >
                                        {t('work-order.no-work-orders-found')}
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                                    {workOrders.map((workOrder) => {
                                        const isSelected = selectedWorkOrders.includes(
                                            workOrder.id,
                                        );
                                        return (
                                            <ListItem key={workOrder.id} disablePadding divider>
                                                <ListItemButton
                                                    selected={
                                                        selectedWorkOrder?.id === workOrder.id
                                                    }
                                                    onClick={() => {
                                                        if (selectedWorkOrder?.id !== workOrder.id)
                                                            handleWorkOrderSelect(workOrder);
                                                    }}
                                                    sx={{
                                                        py: 1.5,
                                                        '&.Mui-selected': {
                                                            backgroundColor:
                                                                'rgba(25, 118, 210, 0.08)',
                                                        },
                                                    }}
                                                >
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isSelected}
                                                        onClick={(event) => event.stopPropagation()}
                                                        onChange={() =>
                                                            toggleWorkOrderSelection(workOrder)
                                                        }
                                                        tabIndex={-1}
                                                        disableRipple
                                                        sx={{ mr: 1 }}
                                                        disabled={loading}
                                                    />
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="medium"
                                                                component="div"
                                                            >
                                                                {getWorkOrderTitle(workOrder)}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Box sx={{ mt: 0.5 }}>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    component="div"
                                                                    sx={{
                                                                        mb: 0.5,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                    }}
                                                                >
                                                                    {getWorkOrderDescription(
                                                                        workOrder,
                                                                    ).substring(0, 100)}
                                                                    {getWorkOrderDescription(
                                                                        workOrder,
                                                                    ).length > 100
                                                                        ? '...'
                                                                        : ''}
                                                                </Typography>
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        component="div"
                                                                    >
                                                                        {getWorkOrderStatus(
                                                                            workOrder,
                                                                        )}
                                                                    </Typography>
                                                                    <Box
                                                                        sx={{
                                                                            width: 4,
                                                                            height: 4,
                                                                            borderRadius: '50%',
                                                                            backgroundColor:
                                                                                'text.disabled',
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        component="div"
                                                                    >
                                                                        {t('work-order.due')}:{' '}
                                                                        {getWorkOrderDueDate(
                                                                            workOrder,
                                                                        )}
                                                                    </Typography>
                                                                </Stack>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Paper>

                        {/* Add pagination below the list */}
                        {!loading && workOrders.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.currentPage}
                                    onChange={(_, page) =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            currentPage: page,
                                        }))
                                    }
                                    color="primary"
                                    size="small"
                                    showFirstButton
                                    showLastButton
                                    disabled={loading}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Right Column - Work Order Details or Loading State */}
                    <Box
                        sx={{
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'background.paper',
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'auto',
                            position: 'relative',
                        }}
                    >
                        {selectedWorkOrder ? (
                            <Box sx={{ p: 3 }}>
                                {workOrderLoading ? (
                                    <AssetDetailsSkeleton />
                                ) : workOrderError ? (
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        {workOrderError.message}
                                    </Alert>
                                ) : (
                                    <>
                                        <WorkOrderDetailView
                                            workOrderData={selectedWorkOrder as any}
                                            readOnly={false}
                                            linkedDocuments={
                                                selectedWorkOrder?.attributes.data?.document
                                                    ? [selectedWorkOrder.attributes.data.document]
                                                    : []
                                            }
                                            comments={selectedWorkOrderComments}
                                            commentsLoading={commentsLoading}
                                            commentsError={commentsError}
                                            titleOverride={getWorkOrderTitle(selectedWorkOrder)}
                                            onCommentSubmit={handleCommentSubmit}
                                        />

                                        {/* Asset Details Section */}
                                        {selectedWorkOrder.relationships?.asset?.data?.id && (
                                            <Box
                                                sx={{
                                                    mt: 4,
                                                    pt: 2,
                                                    borderTop: '1px solid #e0e0e0',
                                                }}
                                            >
                                                <Typography variant="h6" gutterBottom>
                                                    {t('asset.details')}
                                                </Typography>

                                                {assetLoading ? (
                                                    <AssetDetailsSkeleton />
                                                ) : assetError ? (
                                                    <Alert severity="error" sx={{ mt: 1 }}>
                                                        {assetError.message}
                                                    </Alert>
                                                ) : assetDetails ? (
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {assetDetails.data.attributes.name}
                                                        </Typography>
                                                        {assetDetails.data.attributes
                                                            .description && (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    assetDetails.data.attributes
                                                                        .description
                                                                }
                                                            </Typography>
                                                        )}
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography
                                                                variant="caption"
                                                                component="span"
                                                                sx={{
                                                                    backgroundColor:
                                                                        'primary.light',
                                                                    color: 'primary.contrastText',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                {
                                                                    assetDetails.data.attributes
                                                                        .status
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ) : null}
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    p: 3,
                                }}
                            >
                                <EmptyStateIcon />
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 3 }}
                                    component="div"
                                >
                                    {t('work-order.no-work-order-selected')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={onClose} variant="outlined">
                    {t('asset.cancel')}
                </Button>
                <Button
                    onClick={handleAssignWorkOrders}
                    variant="contained"
                    disabled={selectedWorkOrders.length === 0 || loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('work-order.assign-selected-work-orders', {
                            count: selectedWorkOrders.length,
                        })
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WorkOrderSelectionModal;
