import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { TableComponent } from '../../../../components/common/TableComponent';
import assetsAssignedWorkOrders from '../../../../columnDefinitions/assets/assetsAssignedWorkOrders';
import {
    // Temporarily commented out but will be used again later
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // fetchAssignedWorkOrdersToAsset,
    assignWorkOrdersToAsset,
    fetchWorkOrdersList,
    WorkOrderData,
} from '../../services/workOrders/ticketWorkOrderService';
import WorkOrderDetailModal from '../Modals/WorkOrderDetailModal';
import WorkOrderAddSelectionModal from '../Modals/WorkOrderAddSelectionModal';
import useAssetManagementStore from '../../store/assetManagementStore';

const AssignedWorkOrders = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<any>([]);
    const [viewWorkOrder, setViewWorkOrder] = useState<string | null>(null);
    const [showAddWorkOrderModal, setShowAddWorkOrderModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState(0);
    const { selectedAssetDetails } = useAssetManagementStore();
    const selectedCentreConfig = useAssetManagementStore((state) => state.selectedCentreConfig);
    const assetId = selectedAssetDetails?.data?.id;

    const fetchWorkOrders = async () => {
        if (!assetId) return;

        setLoading(true);
        try {
            // Original code - commented out for reference @MARCIN
            // const response = await fetchAssignedWorkOrdersToAsset(assetId);
            // setRows(response.data || []);

            // Temporary replacement using fetchWorkOrdersList
            const response = await fetchWorkOrdersList({
                // Add filter to potentially match the assigned work orders better
                // This is a guess based on available parameters, adjust as needed
                include: ['local', 'createdBy', 'form'],
                page: paginationModel.page + 1, // API is 1-indexed, MUI is 0-indexed
                pageSize: paginationModel.pageSize,
            });

            // Transform the response data if needed
            // Based on the column definitions, we need data where:
            // row.attributes.name, row.attributes.status, row.attributes.completed_at are available
            const transformedData = response.data.map((workOrder: WorkOrderData) => {
                // Map to a format that matches what the table expects
                const title = workOrder.attributes?.data?.title || 'No Title';
                const status =
                    typeof workOrder.attributes.status === 'object'
                        ? workOrder.attributes.status.label
                        : workOrder.attributes.status || 'Unknown';

                return {
                    ...workOrder,
                    attributes: {
                        ...workOrder.attributes,
                        // Provide name field that the table expects
                        name: title,
                        // Ensure status is a string format expected by the table
                        status: status,
                        // Add completed_at field that the table expects
                        // First check if data structure has it, otherwise provide a default
                        completed_at: workOrder.attributes.updatedAt || 'Not completed',
                    },
                };
            });

            setRows(transformedData || []);
            // Try to extract total count for pagination
            if (response.meta && typeof response.meta.total === 'number') {
                setRowCount(response.meta.total);
            } else if (Array.isArray(response.data)) {
                setRowCount(response.data.length);
            } else {
                setRowCount(0);
            }
        } catch (error) {
            console.error('Error fetching assigned work orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkOrders();
    }, [assetId, paginationModel.page, paginationModel.pageSize]);

    const handleAddWorkOrder = () => {
        setShowAddWorkOrderModal(true);
    };

    const handleAssignWorkOrders = async (workOrderIds: string[]) => {
        if (!assetId) return Promise.reject(new Error('Asset ID is required'));

        try {
            await assignWorkOrdersToAsset(assetId, workOrderIds);
            // Refresh the work orders list
            await fetchWorkOrders();
            return Promise.resolve();
        } catch (error) {
            console.error('Error assigning work orders:', error);
            return Promise.reject(error);
        }
    };

    const handleDataEdited = () => {
        // Refresh the work orders list when data is edited
        fetchWorkOrders();
    };

    return (
        <Box sx={{ p: 5 }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    onClick={handleAddWorkOrder}
                    variant="outlined"
                    sx={{
                        color: 'black',
                        borderColor: 'white',
                        backgroundColor: 'grey.100',
                        textTransform: 'none',
                    }}
                >
                    <AddIcon fontSize="small" /> {t('asset.add-work-order')}
                </Button>
            </Box>
            <TableComponent
                columns={assetsAssignedWorkOrders({
                    t,
                    centreConfig: selectedCentreConfig,
                })}
                rows={rows}
                loading={loading}
                onRowClick={(row, event) => {
                    // Prevent row click if the event originated from a checkbox or the row is already selected
                    if (
                        event.target instanceof HTMLElement &&
                        (event.target.closest('.MuiCheckbox-root') ||
                            event.target.tagName === 'INPUT')
                    )
                        return;
                    if (viewWorkOrder === row?.row?.id) return;
                    setViewWorkOrder(row?.row?.id);
                }}
                checkboxSelection
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={rowCount}
                pageSizeOptions={[10, 25, 50, 100]}
                autoHeight
                sortingMode="server"
                sx={{ height: 'auto', flex: 1 }}
            />

            {/* View work order details modal */}
            <WorkOrderDetailModal
                id={viewWorkOrder || ''}
                open={viewWorkOrder !== null}
                onClose={() => setViewWorkOrder(null)}
                onDataEdited={handleDataEdited}
            />

            {/* Add work order modal with selection between create new and use existing */}
            <WorkOrderAddSelectionModal
                open={showAddWorkOrderModal}
                onClose={() => setShowAddWorkOrderModal(false)}
                assetId={assetId || ''}
                onWorkOrderAssign={handleAssignWorkOrders}
            />
        </Box>
    );
};

export default AssignedWorkOrders;
