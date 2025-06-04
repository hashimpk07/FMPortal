import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import InventoryIcon from '@mui/icons-material/Inventory';
import CellTowerIcon from '@mui/icons-material/CellTower';

import ActionButton from './ActionButton';

interface TabContentProps {
    activeTab: number;
}

function TabContent({ activeTab }: TabContentProps) {
    const { t } = useTranslation();

    if (activeTab === 0) {
        return null; // AssetDetailsContent is rendered outside
    }

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {activeTab === 1
                        ? t('asset.assigned-work-orders')
                        : t('asset.maintenance-plans')}
                </Typography>
            </Grid>
            <Grid size={12}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body1" color="textSecondary">
                        {activeTab === 1
                            ? t('asset.no-assigned-work-orders')
                            : t('asset.no-maintenance-plans')}
                    </Typography>
                    <ActionButton
                        icon={activeTab === 1 ? <InventoryIcon /> : <CellTowerIcon />}
                        label={
                            activeTab === 1
                                ? t('asset.create-work-order')
                                : t('asset.create-maintenance-plan')
                        }
                        color="primary"
                        sx={{ mt: 2 }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default TabContent;
