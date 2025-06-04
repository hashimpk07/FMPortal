import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CellTowerIcon from '@mui/icons-material/CellTower';

import { useAssetManagementStore } from '../store/assetManagementStore';
import {
    fetchAllAssetData,
    resetSelectedAssetData,
    fetchAndStoreAssetGroupDetails,
} from '../services/assets/assetDetailsService';
import {
    updateAsset,
    deleteAsset,
    fetchAssetsList,
    enrichAssetsWithIncluded,
} from '../services/assets/assetService';
import { AssetStatus } from './AssetStatusDisplay';
import { Asset, EnrichedAsset } from '../services/types';

import AssetDetailsContent from './AssetDetailsContent';
import AssetDetailsEditContent from './AssetDetailsEditContent';
import TabContent from './TabContent';
import snackbar from '../../../utils/ts/helper/snackbar';
import AssignedWorkOrders from './AssetDetailsDrawerTabs/AssignedWorkOrders';
import MaintenancePlans from './AssetDetailsDrawerTabs/MaintenancePlans';
import AssetDetailsSkeleton from './Closet/AssetDetailsSkeleton';
import ActionButton from './ActionButton';
import AppDrawer from '../../../components/common/AppDrawer';

interface AssetDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    assetId?: string;
}

function AssetDetailsDrawer({ open, onClose, assetId }: AssetDetailsDrawerProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedAsset, setEditedAsset] = useState<EnrichedAsset | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        selectedAssetDetails,
        selectedAssetError,
        selectedAssetLoading,
        assetOperationalSummary,
        operationalSummaryError,
        operationalSummaryLoading,
        assetGroupDetails,
        assetGroupError,
        assetGroupLoading,
        selectedCentreId,
        selectedCentreConfig,
        selectedAssetGroupId,
        setAssetsResponse,
        setAssets,
        setIncluded,
        setMeta,
        setEnrichedAssets,
    } = useAssetManagementStore();

    // Create an enriched asset from the selected asset details and asset group details using useMemo
    const enrichedAsset = useMemo<EnrichedAsset | null>(() => {
        if (!selectedAssetDetails?.data) return null;

        return {
            ...selectedAssetDetails.data,
            assetGroupDetails,
            qrCodeUrl: selectedAssetDetails.data.attributes.qrCode || null,
            tags: selectedAssetDetails.included
                ? selectedAssetDetails.included
                      .filter((item) => item.type === 'simple-tag')
                      .map((tag) => ({ ...tag }))
                : [],
            type: selectedAssetDetails.data.type,
            id: selectedAssetDetails.data.id,
            attributes: selectedAssetDetails.data.attributes,
        };
    }, [selectedAssetDetails, assetGroupDetails]);

    const isLoading = selectedAssetLoading || operationalSummaryLoading;
    const hasError = Boolean(selectedAssetError || operationalSummaryError || assetGroupError);

    useEffect(() => {
        if (!assetId) return;

        // Use the imported fetchAllAssetData function
        fetchAllAssetData(assetId).catch((err: Error) => {
            console.error('Failed to fetch asset data:', err);
        });

        // We no longer need to fetch contractors here - it will be done when the autocomplete field is clicked

        return () => {
            // Clean up when the drawer closes
            resetSelectedAssetData();
        };
    }, [assetId]);

    // Initialize editedAsset when enrichedAsset is available
    useEffect(() => {
        if (enrichedAsset && !editedAsset) {
            setEditedAsset({ ...enrichedAsset });
        }
    }, [enrichedAsset, editedAsset]);

    // When the selected asset changes, fetch its group details (if available)
    useEffect(() => {
        if (selectedAssetDetails?.data?.relationships?.assetGroup?.data?.id) {
            fetchAndStoreAssetGroupDetails(
                selectedAssetDetails.data.relationships.assetGroup.data.id,
            );
        }
    }, [selectedAssetDetails]);

    useEffect(() => {
        if (open && assetId && !selectedAssetDetails?.data && !selectedAssetLoading) {
            fetchAllAssetData(assetId).catch((err: Error) => {
                console.error('Failed to fetch asset data:', err);
            });
        }
    }, [open, assetId, selectedAssetDetails, selectedAssetLoading]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleEditClick = () => {
        // Ensure we're on the details tab before entering edit mode
        setActiveTab(0);
        setIsEditMode(true);
        if (enrichedAsset) {
            setEditedAsset(enrichedAsset);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (enrichedAsset) {
            setEditedAsset(enrichedAsset);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setEditedAsset((prev: any) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        if (!assetId || !editedAsset) return;

        setIsSaving(true);
        try {
            await updateAsset(assetId, editedAsset);
            await fetchAllAssetData(assetId);
            setIsEditMode(false);
            snackbar(
                t('asset.update-success'),
                'success',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } catch (error) {
            console.error('Error updating asset:', error);
            snackbar(
                t('asset.update-error'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!assetId) return;

        setIsDeleting(true);
        try {
            await deleteAsset(assetId);

            // After successful deletion, refresh the assets list
            if (selectedCentreId) {
                const response = await fetchAssetsList({
                    centreId: selectedCentreId.toString(),
                    assetGroupId:
                        selectedAssetGroupId && selectedAssetGroupId !== 'all-assets'
                            ? selectedAssetGroupId
                            : undefined,
                    page: 1,
                    pageSize: 10,
                });

                // Update store with fresh data
                setAssetsResponse(response);
                setAssets(response.data);
                setIncluded(response.included);
                setMeta(response.meta);

                // Update enriched assets
                const enrichedAssets = enrichAssetsWithIncluded(response.data, response.included);
                setEnrichedAssets(enrichedAssets);
            }

            setDeleteConfirmOpen(false);
            onClose();
            snackbar(
                t('asset.delete-success'),
                'success',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } catch (error) {
            console.error('Error deleting asset:', error);
            snackbar(
                t('asset.delete-error'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                5000,
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (newStatus: AssetStatus) => {
        if (!enrichedAsset) return;

        // Update the local state
        setEditedAsset((prev: any) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                status: newStatus,
            },
        }));
    };

    // 2. When closing the drawer, always reset to view mode and store
    const handleDrawerClose = () => {
        setIsEditMode(false);
        onClose();
        resetSelectedAssetData();
    };

    // Create header content with tabs and action buttons
    const drawerHeaderContent = (
        <>
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={t('asset.details')} />
                <Tab label={t('asset.assigned-work-orders')} />
                <Tab label={t('asset.maintenanceplans')} />
            </Tabs>
            {!isEditMode && !isLoading && !hasError && enrichedAsset && activeTab === 0 && (
                <Box sx={{ display: 'flex', gap: 3, mb: -2, mt: 2 }}>
                    <ActionButton
                        icon={<CellTowerIcon sx={{ fontSize: 28 }} />}
                        label={t('buttons.broadcast')}
                        onClick={() => {
                            /* TODO: open broadcast modal */
                        }}
                    />
                    <ActionButton
                        icon={<ModeEditOutlineIcon sx={{ fontSize: 28 }} />}
                        label={t('buttons.edit')}
                        onClick={handleEditClick}
                    />
                    <ActionButton
                        icon={<DeleteOutlineIcon sx={{ fontSize: 28 }} />}
                        label={t('buttons.delete')}
                        onClick={handleDeleteClick}
                    />
                </Box>
            )}
        </>
    );

    // Create footer content for edit mode
    const drawerFooter =
        isEditMode && activeTab === 0 ? (
            <Grid container spacing={1} justifyContent="flex-end">
                <Grid size={{ xs: 'auto' }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        color="inherit"
                    >
                        {t('buttons.cancel')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 'auto' }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        color="primary"
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSaving ? t('asset.saving') : t('buttons.save')}
                    </Button>
                </Grid>
            </Grid>
        ) : undefined;

    // Determine the drawer content based on loading state, errors, and active tab
    const renderDrawerContent = () => {
        if (isLoading) {
            return <AssetDetailsSkeleton />;
        }

        if (hasError) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    {selectedAssetError || operationalSummaryError || assetGroupError}
                </Alert>
            );
        }

        if (activeTab === 0) {
            if (isEditMode) {
                return (
                    <AssetDetailsEditContent
                        enrichedAsset={editedAsset as Asset}
                        assetGroupLoading={assetGroupLoading}
                        onFieldChange={handleFieldChange}
                        centreConfig={selectedCentreConfig}
                        disabled={isSaving}
                    />
                );
            }

            return (
                enrichedAsset && (
                    <AssetDetailsContent
                        asset={enrichedAsset}
                        operationalSummary={assetOperationalSummary || null}
                        onStatusChange={handleStatusChange}
                        centreConfig={selectedCentreConfig}
                    />
                )
            );
        }

        if (activeTab === 1) {
            return <AssignedWorkOrders />;
        }

        if (activeTab === 2) {
            return <MaintenancePlans />;
        }

        return <TabContent activeTab={activeTab} />;
    };

    return (
        <>
            <AppDrawer
                open={open}
                onClose={handleDrawerClose}
                title={
                    isLoading
                        ? t('asset.details')
                        : selectedAssetDetails?.data?.attributes?.name || t('asset.details')
                }
                headerContent={drawerHeaderContent}
                footerContent={drawerFooter}
                disabled={isSaving || isDeleting}
            >
                {renderDrawerContent()}
            </AppDrawer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
                {isDeleting ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>{t('asset.deleting')}</Typography>
                    </Box>
                ) : (
                    <>
                        <DialogTitle>{t('asset.delete-confirmation-title')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {t('asset.delete-confirmation-message', {
                                    name: enrichedAsset?.attributes.name,
                                })}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button
                                onClick={handleDeleteCancel}
                                disabled={isDeleting}
                                variant="outlined"
                                sx={{ mr: 1 }}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                variant="contained"
                                color="primary"
                                disabled={isDeleting}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >
                                {t('buttons.confirm')}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

export default AssetDetailsDrawer;
