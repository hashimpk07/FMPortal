import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { TableComponent } from '../../../../components/common/TableComponent';
import assetsMaintenancePlans from '../../../../columnDefinitions/assets/assetsMaintanencePlans';
import { fetchAssignedMainteancePlansToAsset } from '../../services/assets/assetDetailsService';
import MaintenancePlanDetailModal from '../Modals/MaintenancePlanDetailModal';
import useAssetManagementStore from '../../store/assetManagementStore';

const MaintenancePlans = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<any>([]);
    const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState<string | null>(null);
    const { selectedAssetDetails } = useAssetManagementStore();
    const assetId = selectedAssetDetails?.data?.id;

    useEffect(() => {
        if (!assetId) return;

        fetchAssignedMainteancePlansToAsset(assetId)
            .then((response) => {
                setRows(response.data);
            })
            .catch((error) => {
                console.error('Error fetching maintenance plans:', error);
            });
    }, [assetId]);

    return (
        <Box sx={{ p: 5 }}>
            <TableComponent
                columns={assetsMaintenancePlans({ t })}
                rows={rows}
                loading={false}
                onRowClick={(row) => {
                    setSelectedMaintenancePlan(row?.row?.id);
                }}
                // paginationModel={{}}
                // onPaginationModelChange={() => {}}
                rowCount={0}
                pageSizeOptions={[10, 25, 50, 100]}
                autoHeight
                sortingMode="server"
                // sortModel={{  }}
                // onSortModelChange={() => {}}
                sx={{ height: 'auto', flex: 1 }}
            />

            <MaintenancePlanDetailModal
                id={selectedMaintenancePlan || ''}
                open={selectedMaintenancePlan !== null}
                onClose={() => setSelectedMaintenancePlan(null)}
            />
        </Box>
    );
};

export default MaintenancePlans;
