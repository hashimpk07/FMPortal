import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
// import InventoryIcon from '@mui/icons-material/Inventory';
import { format } from 'date-fns';
import { useMemo } from 'react';

import AssetDetailField from './AssetDetailField';
import ChipGroup from './ChipGroup';
import AssetImageDisplay from './AssetImageDisplay';
import QrCodeDisplay from './QrCodeDisplay';
import AssetOperationalStats from './AssetOperationalStats';
import { AssetStatus } from './AssetStatusDisplay';
import AssetStatusAutocomplete from './AssetStatusAutocomplete';
import { AssetTag, AssetOperationalSummaryResponse, EnrichedAsset } from '../services/types';
import { CentreConfig } from '../../../services/centres';
import { useAssetManagementStore } from '../store/assetManagementStore';

interface AssetDetailsContentProps {
    asset: EnrichedAsset;
    operationalSummary: AssetOperationalSummaryResponse | null;
    onStatusChange: (
        newStatus: 'operational' | 'pending_repair' | 'missing' | 'out_of_service',
    ) => void;
    centreConfig?: CentreConfig | null;
}

function AssetDetailsContent({
    asset,
    operationalSummary,
    onStatusChange,
    centreConfig,
}: AssetDetailsContentProps) {
    const { t } = useTranslation();
    // Get assetGroupDetails from the store if not provided in the asset
    const storeAssetGroupDetails = useAssetManagementStore((state) => state.assetGroupDetails);

    const effectiveAssetGroupDetails = asset.assetGroupDetails || storeAssetGroupDetails;

    // Group locations by type for display - moved before conditional return
    const locationsByType = useMemo(() => {
        if (!asset?.attributes?.locations || !Array.isArray(asset?.attributes?.locations))
            return {};

        const result: Record<string, string[]> = {};
        asset.attributes.locations.forEach((location) => {
            if (location.locationType && location.locationValue) {
                if (!result[location.locationType]) {
                    result[location.locationType] = [];
                }
                result[location.locationType].push(location.locationValue);
            }
        });
        return result;
    }, [asset?.attributes?.locations]);

    if (!asset || !asset.attributes) {
        return <Typography>{t('asset.no-data')}</Typography>;
    }

    const { attributes } = asset;

    const formatDate = (date: string | null | undefined) => {
        if (!date) return '-';
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch {
            return '-';
        }
    };

    // Handle tags display
    const handleTagsDisplay = () => {
        // First try to use tags from asset.tags
        if (asset.tags && Array.isArray(asset.tags) && asset.tags.length > 0) {
            return asset.tags.map((tag: AssetTag) => tag.attributes?.name || '');
        }

        // Fallback to attributes.tags if available
        if (attributes.tags && Array.isArray(attributes.tags)) {
            return attributes.tags;
        }

        // If neither is available, return empty array
        return [];
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

    // Format currency values according to centre config
    const formatCurrency = (value: string | number | null | undefined): string => {
        if (value === null || value === undefined || value === '') return '-';

        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return '-';

        if (centreConfig) {
            const formatter = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: centreConfig.default_currency_code || 'USD',
                currencyDisplay: 'symbol',
            });
            return formatter.format(numValue);
        }

        // Fallback if no centre config
        return `${currencySymbol || ''}${numValue}`;
    };

    return (
        <Box sx={{ p: 5 }}>
            {/* Image and QR Code */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.image')}
                        value={
                            <AssetImageDisplay
                                imageUrl={attributes.imageUrl || null}
                                assetName={attributes.name}
                            />
                        }
                    />
                </Grid>

                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <QrCodeDisplay assetId={asset.id} assetName={attributes.name} />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField label={t('asset.name')} value={attributes.name} />
                </Grid>

                {/* Group */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.group')}
                        value={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        backgroundColor: '#f5f5f5',
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {/* <InventoryIcon /> */}
                                    {effectiveAssetGroupDetails?.data?.attributes.name || (
                                        <Typography variant="body2">
                                            {t('asset.no-group')}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        }
                    />
                </Grid>

                {/* Description - Full Width */}
                {attributes.description && (
                    <Grid size={{ xs: 12 }}>
                        <AssetDetailField
                            label={t('asset.description')}
                            value={attributes.description}
                            fullWidth
                        />
                    </Grid>
                )}

                {/* Status */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.status')}
                        fullWidth
                        value={
                            <AssetStatusAutocomplete
                                assetId={asset.id}
                                currentStatus={attributes.status as AssetStatus}
                                onStatusChange={onStatusChange}
                            />
                        }
                    />
                </Grid>

                {/* Asset Activity with progress bar */}
                {operationalSummary &&
                    operationalSummary.data &&
                    operationalSummary.data.attributes &&
                    operationalSummary.data.attributes.operational &&
                    operationalSummary.data.attributes.non_operational && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AssetOperationalStats
                                operationalDays={
                                    operationalSummary.data.attributes.operational.days
                                }
                                nonOperationalDays={
                                    operationalSummary.data.attributes.non_operational.days
                                }
                            />
                        </Grid>
                    )}

                {/* Asset Details Grid */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.serial-number')}
                        value={attributes.serialNumber || '-'}
                    />
                </Grid>

                {/* Locations - Full Width */}
                {Object.keys(locationsByType).length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            {t('asset.locations')}
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(locationsByType).map(([type, values]) => (
                                <Grid key={type} size={{ xs: 12, md: 6 }}>
                                    <AssetDetailField label={type} value={values.join(', ')} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                )}

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.contractor-responsible')}
                        value={attributes.contractor?.name || '-'}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.installation-date')}
                        value={formatDate(attributes.updatedAt)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.purchase-cost')}
                        value={formatCurrency(attributes.purchaseCost)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.depreciation-rate')}
                        value={
                            attributes.depreciationRate !== null
                                ? `${attributes.depreciationRate}%`
                                : '-'
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.estimated-value')}
                        value={formatCurrency(attributes.estimatedValue)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AssetDetailField
                        label={t('asset.estimated-lifetime')}
                        value={
                            attributes.estimatedLifetime !== null
                                ? `${attributes.estimatedLifetime} ${t('asset.years')}`
                                : '-'
                        }
                    />
                </Grid>

                {/* Warranty Expiration Date - Full Width */}
                <Grid size={{ xs: 12 }}>
                    <AssetDetailField
                        label={t('asset.warranty-expiration-date')}
                        value={formatDate(attributes.warrantyExpiresAt)}
                        fullWidth
                    />
                </Grid>

                {/* Tags */}
                <Grid size={{ xs: 12 }}>
                    <ChipGroup label={t('asset.tags')} items={handleTagsDisplay()} />
                </Grid>

                {/* Documents */}
                <Grid size={{ xs: 12 }}>
                    <ChipGroup label={t('asset.documents')} items={attributes.documents || []} />
                </Grid>

                {/* Invoices (if present) */}
                {attributes.invoices && (
                    <Grid size={{ xs: 12 }}>
                        <ChipGroup label={t('asset.invoices')} items={attributes.invoices} />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default AssetDetailsContent;
