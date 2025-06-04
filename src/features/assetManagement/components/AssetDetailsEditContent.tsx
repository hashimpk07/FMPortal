import {
    Box,
    TextField,
    Autocomplete,
    Chip,
    IconButton,
    Typography,
    createFilterOptions,
    Button,
    InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import AssetDetailField from './AssetDetailField';
import AssetImageUpload from './AssetImageUpload';
import { Asset, AssetStatus } from '../services/types';
import { useAssetManagementStore } from '../store/assetManagementStore';
import {
    fetchAndStoreTagsList,
    fetchAndStoreDocumentsList,
    fetchAndStoreAssetGroupsList,
} from '../services/assets/assetDetailsService';
import { fetchAllLocations } from '../services/assets/assetService';
import DocumentSelectionModal, { Document as ModalDocument } from './Modals/DocumentSelectionModal';
import { CentreConfig } from '../../../services/centres';
import STATUS_MAP from '../statusMap';
import ContractorAutocomplete from './ContractorAutocomplete';

interface AssetDetailsEditContentProps {
    enrichedAsset: Asset;
    onFieldChange: (field: string, value: any) => void;
    assetGroupLoading: boolean;
    centreConfig?: CentreConfig | null;
    disabled?: boolean;
}

const ASSET_STATUSES: AssetStatus[] = [
    'operational',
    'pending_repair',
    'missing',
    'out_of_service',
];

interface LocationType {
    locationType: string;
    locationValue: string;
}

interface LocationInputOption {
    inputValue?: string;
    value: string;
}

function AssetDetailsEditContent({
    enrichedAsset,
    onFieldChange,
    assetGroupLoading,
    centreConfig,
    disabled = false,
}: AssetDetailsEditContentProps) {
    const { t } = useTranslation();
    const {
        tags,
        documents,
        assetGroups,
        assetGroupsError,
        selectedCentreId,
        locations,
        setLocations,
        setLocationsLoading,
        setLocationsError,
    } = useAssetManagementStore();
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [selectedDocumentName, setSelectedDocumentName] = useState<string | null>(null);

    useEffect(() => {
        // Fetch tags and documents from the service layer
        fetchAndStoreTagsList();
        fetchAndStoreDocumentsList();

        // Fetch asset groups if we have a center ID
        if (selectedCentreId) {
            fetchAndStoreAssetGroupsList(selectedCentreId);

            // Fetch locations
            const loadLocations = async () => {
                setLocationsLoading(true);
                try {
                    const allLocations = await fetchAllLocations({
                        centreId: selectedCentreId.toString(),
                    });
                    setLocations(allLocations);
                } catch (error) {
                    console.error('Error fetching locations:', error);
                    setLocationsError(
                        error instanceof Error ? error.message : 'Failed to fetch locations',
                    );
                } finally {
                    setLocationsLoading(false);
                }
            };
            loadLocations();
        }
    }, [selectedCentreId]);

    if (!enrichedAsset) return null;

    const { attributes } = enrichedAsset;

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(field, event.target.value);
    };

    const handleDateChange = (field: string) => (date: Date | null) => {
        if (date) {
            onFieldChange(field, format(date, 'yyyy-MM-dd'));
        }
    };

    // Helper function to safely create Date objects
    const safeDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    };

    // Get initial values for tags and documents
    const initialTags = (() => {
        // First check if tags are in attributes
        if (attributes.tags && Array.isArray(attributes.tags)) {
            return attributes.tags;
        }

        // Then check if tags are in the enrichedAsset.tags array
        if (enrichedAsset.tags && Array.isArray(enrichedAsset.tags)) {
            return enrichedAsset.tags.map((tag) => tag.attributes?.name || '');
        }

        // Finally check if tags are in relationships (API format)
        if (enrichedAsset.relationships?.tags?.data) {
            return enrichedAsset.relationships.tags.data.map((tag) => tag.id || '');
        }

        return [];
    })();
    const initialDocuments = attributes.documents || [];

    // Get the current group from the asset's relationships
    const currentGroupId = enrichedAsset.relationships.assetGroup?.data?.id;
    const currentGroup = currentGroupId
        ? assetGroups.find((group) => group.id === currentGroupId)
        : null;

    // Get unique location types from available locations
    const locationTypes = Array.from(new Set(locations.map((loc) => loc.attributes.locationType)));

    // Handle adding a new location
    const handleAddLocation = () => {
        const currentLocations = attributes.locations || [];
        onFieldChange('locations', [...currentLocations, { locationType: '', locationValue: '' }]);
    };

    // Handle removing a location
    const handleRemoveLocation = (index: number) => {
        const currentLocations = attributes.locations || [];
        onFieldChange(
            'locations',
            currentLocations.filter((_, i) => i !== index),
        );
    };

    // Handle location type change
    const handleLocationTypeChange = (index: number, newValue: string) => {
        const currentLocations = attributes.locations || [];
        const updatedLocations = [...currentLocations];
        updatedLocations[index] = {
            ...updatedLocations[index],
            locationType: newValue,
            locationValue: '', // Reset value when type changes
        };
        onFieldChange('locations', updatedLocations);
    };

    // Get available location values based on type
    const getLocationValuesByType = (type: string): LocationInputOption[] => {
        return locations
            .filter((loc) => loc.attributes.locationType === type)
            .map((loc) => ({ value: loc.attributes.locationLabel }));
    };

    // Handle location value change with support for new values
    const handleLocationValueChange = (index: number, newValue: LocationInputOption | null) => {
        if (!newValue) {
            const currentLocations = (attributes.locations || []) as LocationType[];
            const updatedLocations = [...currentLocations];
            updatedLocations[index] = {
                ...updatedLocations[index],
                locationValue: '',
            };
            onFieldChange('locations', updatedLocations);
            return;
        }

        const currentLocations = (attributes.locations || []) as LocationType[];
        const updatedLocations = [...currentLocations];
        updatedLocations[index] = {
            ...updatedLocations[index],
            locationValue: newValue.inputValue || newValue.value,
        };
        onFieldChange('locations', updatedLocations);
    };

    // Define a properly typed filter function for the LocationInputOption
    const filterOptions = createFilterOptions<LocationInputOption | string>({
        stringify: (option) => {
            if (typeof option === 'string') return option;
            return option.inputValue || option.value;
        },
    });

    // Function to open document modal with specific document pre-selected
    const handleOpenDocumentModal = (documentName?: string) => {
        if (documentName) {
            setSelectedDocumentName(documentName);
        } else {
            setSelectedDocumentName(null);
        }
        setIsDocumentModalOpen(true);
    };

    // Helper function to decode Unicode currency symbol from the API
    const decodeCurrencySymbol = (symbol?: string): string => {
        if (!symbol) return '';

        try {
            // The API returns Unicode symbols like "\u00A3" (£)
            // We need to convert this to the actual symbol
            return JSON.parse(`"${symbol}"`);
        } catch (e) {
            console.error('Error decoding currency symbol:', e);
            return symbol;
        }
    };

    // Get currency symbol from centre config
    const currencySymbol = centreConfig
        ? decodeCurrencySymbol(centreConfig.default_currency_symbol)
        : '';

    return (
        <Box sx={{ p: 5 }}>
            {/* Image Upload */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                    <AssetDetailField
                        label={t('asset.image')}
                        value={
                            <AssetImageUpload
                                currentImageUrl={attributes.imageUrl || undefined}
                                disabled={disabled}
                                onImageChange={(file) => {
                                    if (file) {
                                        // Just store the file and create local preview
                                        onFieldChange('imageFile', file);
                                        onFieldChange('imageUrl', URL.createObjectURL(file));
                                    } else {
                                        // Clear both file and URL
                                        onFieldChange('imageFile', null);
                                        onFieldChange('imageUrl', null);
                                        onFieldChange('mediaId', null);
                                    }
                                }}
                            />
                        }
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        required
                        name="name"
                        label={t('asset.name')}
                        value={attributes.name || ''}
                        onChange={handleChange('name')}
                        disabled={disabled}
                    />
                </Grid>

                {/* Group - Enhanced with loading state and better typing */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Autocomplete
                        fullWidth
                        loading={assetGroupLoading}
                        options={assetGroups}
                        value={currentGroup}
                        getOptionLabel={(option) => option.attributes.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(_, newValue) => {
                            onFieldChange(
                                'assetGroup',
                                newValue
                                    ? {
                                          type: 'asset-group',
                                          id: newValue.id,
                                          attributes: newValue.attributes,
                                      }
                                    : null,
                            );
                        }}
                        disabled={disabled}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('asset.group')}
                                error={!!assetGroupsError}
                                helperText={assetGroupsError}
                                disabled={disabled}
                            />
                        )}
                    />
                </Grid>

                {/* Status */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Autocomplete<AssetStatus>
                        fullWidth
                        options={ASSET_STATUSES}
                        value={(attributes.status as AssetStatus) || 'operational'}
                        onChange={(_, newValue) => onFieldChange('status', newValue)}
                        disabled={disabled}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('asset.status')}
                                required
                                disabled={disabled}
                            />
                        )}
                        getOptionLabel={(option) => STATUS_MAP[option] || option}
                    />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        name="description"
                        label={t('asset.description')}
                        multiline
                        rows={3}
                        value={attributes.description || ''}
                        onChange={handleChange('description')}
                        disabled={disabled}
                    />
                </Grid>

                {/* Serial Number */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label={t('asset.serial-number')}
                        value={attributes.serialNumber || ''}
                        onChange={handleChange('serialNumber')}
                        disabled={disabled}
                    />
                </Grid>

                {/* Purchase Cost */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label={t('asset.purchase-cost')}
                        type="number"
                        value={attributes.purchaseCost || ''}
                        onChange={handleChange('purchaseCost')}
                        disabled={disabled}
                        InputProps={{
                            startAdornment: currencySymbol ? (
                                <InputAdornment position="start">{currencySymbol}</InputAdornment>
                            ) : undefined,
                        }}
                    />
                </Grid>

                {/* Depreciation Rate */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label={t('asset.depreciation-rate')}
                        value={attributes.depreciationRate ?? ''}
                        onChange={handleChange('depreciationRate')}
                        disabled={disabled}
                        InputProps={{
                            endAdornment: '%',
                        }}
                    />
                </Grid>

                {/* Estimated Value */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label={t('asset.estimated-value')}
                        type="number"
                        value={attributes.estimatedValue || ''}
                        onChange={handleChange('estimatedValue')}
                        disabled={disabled}
                        InputProps={{
                            startAdornment: currencySymbol ? (
                                <InputAdornment position="start">{currencySymbol}</InputAdornment>
                            ) : undefined,
                        }}
                    />
                </Grid>

                {/* Estimated Lifetime */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label={t('asset.estimated-lifetime')}
                        value={attributes.estimatedLifetime ?? ''}
                        onChange={handleChange('estimatedLifetime')}
                        disabled={disabled}
                        InputProps={{
                            endAdornment: 'years',
                        }}
                    />
                </Grid>

                {/* Installation Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label={t('asset.installation-date')}
                        value={safeDate(attributes.updatedAt)}
                        onChange={handleDateChange('installationDate')}
                        disabled={disabled}
                        slotProps={{ textField: { fullWidth: true, disabled } }}
                    />
                </Grid>

                {/* Contractor Responsible */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <ContractorAutocomplete
                        value={attributes.contractor || null}
                        disabled={disabled}
                        onChange={(newContractor) => {
                            // Update attributes for UI display purposes only
                            onFieldChange('contractor', newContractor);

                            // Also update the relationships directly for the API
                            if (newContractor && newContractor.id) {
                                // Add to relationships
                                onFieldChange('relationships', {
                                    ...enrichedAsset.relationships,
                                    contractor: {
                                        data: {
                                            type: 'contractor',
                                            id: newContractor.id,
                                        },
                                    },
                                });
                            } else {
                                // Remove from relationships if null
                                const updatedRelationships = {
                                    ...enrichedAsset.relationships,
                                } as Record<string, any>;

                                if ('contractor' in updatedRelationships) {
                                    delete updatedRelationships.contractor;
                                    onFieldChange('relationships', updatedRelationships);
                                }
                            }
                        }}
                    />
                </Grid>

                {/* Warranty Expiration Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                        label={t('asset.warranty-expiration-date')}
                        value={safeDate(attributes.warrantyExpiresAt)}
                        onChange={handleDateChange('warrantyExpiresAt')}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Grid>

                {/* Locations */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{t('asset.locations')}</Typography>
                    </Box>
                    {((attributes.locations || []) as LocationType[]).map((location, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Autocomplete<string>
                                fullWidth
                                options={locationTypes}
                                value={location.locationType}
                                onChange={(_, newValue) =>
                                    handleLocationTypeChange(index, newValue || '')
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label={t('asset.location-type')} />
                                )}
                                sx={{ flex: 1 }}
                            />
                            <Autocomplete<LocationInputOption | string, false, true, true>
                                fullWidth
                                options={getLocationValuesByType(location.locationType)}
                                value={{ value: location.locationValue }}
                                onChange={(_, newValue) => {
                                    if (typeof newValue === 'string') {
                                        handleLocationValueChange(index, {
                                            value: newValue,
                                        });
                                    } else {
                                        handleLocationValueChange(index, newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filterOptions(options, params);
                                    const { inputValue } = params;

                                    // Suggest creating a new value
                                    const isExisting = options.some((option) => {
                                        const optionValue =
                                            typeof option === 'string' ? option : option.value;
                                        return (
                                            inputValue.toLowerCase() === optionValue.toLowerCase()
                                        );
                                    });

                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            value: t('asset.new-location-indicator', {
                                                value: inputValue,
                                            }),
                                        });
                                    }

                                    return filtered;
                                }}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    return option.value;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                freeSolo
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        {typeof option === 'string' ? option : option.value}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('asset.location-value')}
                                        placeholder={t('asset.new-location-value')}
                                    />
                                )}
                                disabled={!location.locationType}
                                sx={{ flex: 1 }}
                            />
                            <IconButton
                                onClick={() => handleRemoveLocation(index)}
                                sx={{
                                    alignSelf: 'stretch',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    px: 2,
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        borderColor: 'text.primary',
                                    },
                                }}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddLocation}
                        variant="outlined"
                        sx={{ mt: 1 }}
                    >
                        {t('buttons.add-location')}
                    </Button>
                </Grid>

                {/* Tags */}
                <Grid size={{ xs: 12 }}>
                    <Autocomplete
                        multiple
                        options={tags.map((tag) => tag.attributes.name)}
                        value={initialTags}
                        onChange={(_, newValue) => onFieldChange('tags', newValue)}
                        renderInput={(params) => <TextField {...params} label={t('asset.tags')} />}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...chipProps } = getTagProps({ index });
                                return <Chip key={key} label={option} {...chipProps} />;
                            })
                        }
                    />
                </Grid>

                {/* Documents */}
                <Grid size={{ xs: 12 }}>
                    <Autocomplete
                        multiple
                        id="documents-autocomplete"
                        options={[]} // No options needed as we're using the modal
                        value={initialDocuments}
                        onChange={(_, newValue) => onFieldChange('documents', newValue)}
                        disableClearable
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('asset.documents')}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {params.InputProps.endAdornment}
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDocumentModal();
                                                }}
                                                sx={{
                                                    ml: 1,
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                    },
                                                }}
                                                size="small"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ),
                                }}
                                onClick={() => handleOpenDocumentModal()}
                                sx={{ cursor: 'pointer' }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...chipProps } = getTagProps({ index });
                                return <Chip key={key} label={option} {...chipProps} />;
                            })
                        }
                    />

                    <DocumentSelectionModal
                        open={isDocumentModalOpen}
                        onClose={() => {
                            setIsDocumentModalOpen(false);
                            setSelectedDocumentName(null);
                        }}
                        documents={documents as unknown as ModalDocument[]}
                        selectedDocuments={initialDocuments}
                        onDocumentsSelect={(newDocuments) =>
                            onFieldChange('documents', newDocuments)
                        }
                        initialSelectedDocumentName={selectedDocumentName}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default AssetDetailsEditContent;
