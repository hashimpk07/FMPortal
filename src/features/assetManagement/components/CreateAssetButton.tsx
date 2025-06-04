import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import AssetCreateDrawer from './AssetCreateDrawer';

function CreateAssetButton() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDrawer}>
                {t('asset.create-new')}
            </Button>

            <AssetCreateDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
        </>
    );
}

export default CreateAssetButton;
