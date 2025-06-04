import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useAssetManagementStore } from '../store/assetManagementStore';
import { createAsset } from '../services/assets/assetService';
import { uploadAssetMedia } from '../services/assets/assetMediaService';
import { Asset } from '../services/types';
import {
    fetchAndStoreAssetGroupsList,
    fetchAndStoreTagsList,
    fetchAndStoreDocumentsList,
} from '../services/assets/assetDetailsService';
import AssetDetailsEditContent from './AssetDetailsEditContent';
import snackbar from '../../../utils/ts/helper/snackbar';
import AppDrawer from '../../../components/common/AppDrawer';

interface AssetCreateDrawerProps {
    open: boolean;
    onClose: () => void;
}

interface RequiredAssetAttributes {
    name: string;
    description: string | null;
    serialNumber: string;
    purchaseCost: string | null;
    estimatedValue: string | null;
    depreciationRate: number | null;
    warrantyExpiresAt: string | null;
    estimatedLifetime: number | null;
    status: 'operational' | 'pending_repair' | 'missing' | 'out_of_service';
    updatedAt: string;
    contractor?: { id: string; name: string } | null;
}

function createDefaultAttributes(): RequiredAssetAttributes {
    return {
        name: '',
        description: null,
        serialNumber: '',
        purchaseCost: null,
        estimatedValue: null,
        depreciationRate: null,
        warrantyExpiresAt: null,
        estimatedLifetime: null,
        status: 'operational',
        updatedAt: new Date().toISOString(),
        contractor: null,
    };
}

function AssetCreateDrawer({ open, onClose }: AssetCreateDrawerProps) {
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);
    const [newAsset, setNewAsset] = useState<Partial<Asset>>({
        type: 'asset',
        attributes: createDefaultAttributes(),
        relationships: {
            tags: {
                data: [],
            },
            centre: {
                data: { type: 'centre', id: '1' },
            },
            assetGroup: {
                data: null,
            },
        },
    });

    // Track tags and documents for the UI
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

    // Get the required store state
    const assetGroupsLoading = useAssetManagementStore((state) => state.assetGroupsLoading);
    const selectedCentreId = useAssetManagementStore((state) => state.selectedCentreId);
    const selectedCentreConfig = useAssetManagementStore((state) => state.selectedCentreConfig);

    // Load data when the drawer opens
    useEffect(() => {
        if (open) {
            // Reset form data
            setNewAsset({
                type: 'asset',
                attributes: createDefaultAttributes(),
                relationships: {
                    tags: {
                        data: [],
                    },
                    centre: {
                        data: {
                            type: 'centre',
                            id: selectedCentreId?.toString() || '1',
                        },
                    },
                    assetGroup: {
                        data: null,
                    },
                },
            });

            setSelectedTags([]);
            setSelectedDocuments([]);

            // Fetch necessary data
            fetchAndStoreTagsList();
            fetchAndStoreDocumentsList();
            // We no longer fetch contractors here - it will be done when the autocomplete field is clicked

            // Fetch asset groups if we have a center ID
            if (selectedCentreId) {
                fetchAndStoreAssetGroupsList(selectedCentreId.toString());
            }

            // Centre config can be used here to format currency fields, date fields, etc.
            // For example, you could pass it to the AssetDetailsEditContent component
            // console.log('Centre config for formatting:', selectedCentreConfig);
        }
    }, [open, selectedCentreId, selectedCentreConfig]);

    // Handle field changes
    const handleFieldChange = (field: string, value: any) => {
        // Handle special case for assetGroup relationships
        if (field === 'assetGroup') {
            setNewAsset((prev) => {
                const updated: Partial<Asset> = {
                    ...prev,
                    relationships: {
                        ...prev.relationships!,
                        assetGroup: {
                            data: value
                                ? {
                                      type: 'asset-group',
                                      id: value.id,
                                  }
                                : null,
                        },
                    },
                };
                return updated;
            });
            return;
        }

        // Handle case for tags
        if (field === 'tags') {
            setSelectedTags(value || []);

            const tagRelationships = value
                ? value.map((tagName: string) => ({
                      type: 'simple-tag',
                      id: tagName,
                  }))
                : [];

            setNewAsset((prev) => {
                const updated: Partial<Asset> = {
                    ...prev,
                    relationships: {
                        ...prev.relationships!,
                        tags: {
                            data: tagRelationships,
                        },
                    },
                };
                return updated;
            });
            return;
        }

        // Handle case for documents
        if (field === 'documents') {
            setSelectedDocuments(value || []);
            const documentsList = value || [];

            setNewAsset((prev) => {
                if (!prev.attributes) return prev;

                const updated: Partial<Asset> = {
                    ...prev,
                    attributes: {
                        ...prev.attributes,
                        documents: documentsList,
                    },
                };
                return updated;
            });
            return;
        }

        // For cost fields, we could use the centre config for formatting
        // For example, if field is 'purchaseCost' or 'estimatedValue'
        // This could use selectedCentreConfig.default_currency_symbol, etc.

        // For most fields, update the attributes directly
        setNewAsset((prev) => {
            if (!prev.attributes) return prev;

            const updated: Partial<Asset> = {
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [field]: value,
                },
            };
            return updated;
        });
    };

    // Check if form is valid
    const isFormValid = () => {
        return !!(newAsset.attributes?.name && newAsset.attributes.name.trim() !== '');
    };

    // Handle save
    const handleSave = async () => {
        if (!isFormValid()) {
            snackbar(
                t('asset.validation.name-required'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
            return;
        }

        setIsSaving(true);

        try {
            // First, check if there's an image file to upload
            if (newAsset.attributes?.imageFile) {
                try {
                    // Upload the image first
                    const mediaResponse = await uploadAssetMedia({
                        file: newAsset.attributes.imageFile,
                        name: newAsset.attributes.imageFile.name,
                    });

                    // Set the mediaId from the response
                    setNewAsset((prev) => ({
                        ...prev,
                        attributes: {
                            ...prev.attributes!,
                            mediaId: mediaResponse.data.id,
                        },
                    }));
                } catch (error) {
                    console.error('Error uploading asset image:', error);
                    // Continue with asset creation even if image upload fails
                    snackbar(
                        t('asset.image-upload-error'),
                        'warning',
                        { horizontal: 'center', vertical: 'bottom' },
                        5000,
                    );
                }
            }

            // Create a suitable asset object with proper relationships structure, excluding imageFile
            const { attributes } = newAsset;
            const assetToCreate = {
                ...newAsset,
                attributes: {
                    ...attributes,
                    // Remove imageFile and imageUrl as they shouldn't be sent to API
                    imageFile: undefined,
                    imageUrl: undefined,
                },
                relationships: {
                    ...newAsset.relationships,
                    centre: {
                        data: {
                            type: 'centre',
                            id: selectedCentreId?.toString() || '1',
                        },
                    },
                },
            };

            // Remove contractor from attributes since it should only be in relationships
            if (assetToCreate.attributes.contractor) {
                delete assetToCreate.attributes.contractor;
            }

            // Create the asset using the service
            await createAsset(assetToCreate as Omit<Asset, 'id'>);

            // Show success message
            snackbar(
                t('asset.create-success'),
                'success',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );

            // Close the drawer
            onClose();
        } catch (error) {
            console.error('Error creating asset:', error);

            const errorMessage = error instanceof Error ? error.message : t('asset.create-error');

            snackbar(errorMessage, 'error', { horizontal: 'center', vertical: 'bottom' }, 5000);
        } finally {
            setIsSaving(false);
        }
    };

    // Create footer buttons for the drawer
    const drawerFooter = (
        <Grid container spacing={1} justifyContent="flex-end">
            <Grid size={{ xs: 'auto' }}>
                <Button variant="outlined" onClick={onClose} disabled={isSaving} color="inherit">
                    {t('buttons.cancel')}
                </Button>
            </Grid>
            <Grid size={{ xs: 'auto' }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving || !isFormValid()}
                    color="primary"
                >
                    {isSaving ? t('asset.saving') : t('buttons.save')}
                </Button>
            </Grid>
        </Grid>
    );

    // Create a modified asset for the EditContent component
    const getModifiedAssetForUI = () => {
        const modifiedAsset = {
            ...newAsset,
            id: 'new-asset', // Temporary ID for the UI
            attributes: {
                ...newAsset.attributes,
                tags: selectedTags,
                documents: selectedDocuments,
            },
        };

        return modifiedAsset as Asset;
    };

    return (
        <AppDrawer
            open={open}
            onClose={onClose}
            title={t('asset.create-new')}
            disabled={isSaving}
            footerContent={drawerFooter}
        >
            {isSaving ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <AssetDetailsEditContent
                    enrichedAsset={getModifiedAssetForUI()}
                    onFieldChange={handleFieldChange}
                    assetGroupLoading={assetGroupsLoading}
                    centreConfig={selectedCentreConfig}
                />
            )}
        </AppDrawer>
    );
}

export default AssetCreateDrawer;
