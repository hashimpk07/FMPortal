import { useState, SyntheticEvent } from 'react';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';

import { AssetStatus, statusMap } from './AssetStatusDisplay';
import { updateAsset } from '../services/assets/assetService';
import snackbar from '../../../utils/ts/helper/snackbar';
import useAssetManagementStore from '../store/assetManagementStore';
import { Asset } from '../services/types';

interface AssetStatusAutocompleteProps {
    assetId: string;
    currentStatus: AssetStatus;
    onStatusChange?: (newStatus: AssetStatus) => void;
}

interface StatusOption {
    value: AssetStatus;
    label: string;
    color: string;
}

function AssetStatusAutocomplete({
    assetId,
    currentStatus,
    onStatusChange,
}: AssetStatusAutocompleteProps) {
    const { t } = useTranslation();
    const [isUpdating, setIsUpdating] = useState(false);
    const { setSelectedAssetDetails } = useAssetManagementStore();

    // Create options array from statusMap
    const options: StatusOption[] = Object.entries(statusMap).map(([value, info]) => ({
        value: value as AssetStatus,
        label: t(`asset.status.${value}`, info.label),
        color: info.color,
    }));

    // Find current option
    const currentOption = options.find((option) => option.value === currentStatus) || {
        value: currentStatus,
        label: t('asset.status.unknown', 'Unknown'),
        color: '#9e9e9e',
    };

    const handleStatusChange = async (
        _: SyntheticEvent,
        newOption: StatusOption | null,
        reason: AutocompleteChangeReason,
        _details?: AutocompleteChangeDetails<StatusOption>,
    ) => {
        if (!newOption || newOption.value === currentStatus || reason === 'clear') return;

        setIsUpdating(true);
        try {
            // Get the current asset data to preserve other fields
            const currentAsset = useAssetManagementStore.getState().selectedAssetDetails?.data;

            if (!currentAsset) throw new Error('No asset data found');

            // Create update payload preserving all other fields
            const assetData: Partial<Asset> = {
                type: currentAsset.type,
                id: currentAsset.id,
                attributes: {
                    ...currentAsset.attributes,
                    status: newOption.value,
                },
                relationships: currentAsset.relationships,
            };

            const response = await updateAsset(assetId, assetData);

            // Update the store with the response
            setSelectedAssetDetails(response);

            onStatusChange?.(newOption.value);
            snackbar(
                t('asset.status-update-success'),
                'success',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } catch (error) {
            console.error('Error updating asset status:', error);
            snackbar(
                t('asset.status-update-error'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Autocomplete<StatusOption, false, false, false>
            value={currentOption}
            options={options}
            disabled={isUpdating}
            onChange={handleStatusChange}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            disableClearable={false}
            renderInput={(params) => (
                <TextField {...params} disabled={isUpdating} required hiddenLabel />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    <Box
                        component="span"
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: option.color,
                            mr: 1,
                            display: 'inline-block',
                        }}
                    />
                    <Typography>{option.label}</Typography>
                </Box>
            )}
            renderTags={(tagValue) => {
                // Since we're using single selection, tagValue will be a single StatusOption
                const option = tagValue as unknown as StatusOption;
                return (
                    <Box
                        sx={{
                            display: 'inline-block',
                            bgcolor: option.color,
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {option.label}
                        </Typography>
                    </Box>
                );
            }}
        />
    );
}

export default AssetStatusAutocomplete;
