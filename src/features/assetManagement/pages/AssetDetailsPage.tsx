import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Container, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

import AssetDetailsContent from '../components/AssetDetailsContent';
import AssetService from '../services/assets/assetService';
import snackbar from '../../../utils/ts/helper/snackbar';
import { AssetOperationalSummaryResponse, EnrichedAsset } from '../services/types';

function AssetDetailsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { assetId } = useParams<{ assetId: string }>();

    const [enrichedAsset, setEnrichedAsset] = useState<EnrichedAsset | null>(null);
    const [assetOperationalSummary, setAssetOperationalSummary] =
        useState<AssetOperationalSummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssetDetails = async () => {
            if (!assetId) return;

            setLoading(true);
            try {
                // Fetch asset details
                const response = await AssetService.fetchAssetDetails(assetId);

                // Enrich asset data with included data
                const enriched = AssetService.enrichAssetsWithIncluded(
                    [response.data],
                    response.included,
                )[0] as EnrichedAsset;

                // Fetch operational summary
                const operationalSummary = await AssetService.fetchAssetOperationalSummary(assetId);
                setAssetOperationalSummary(operationalSummary);

                // Fetch asset group details if available
                if (enriched.relationships?.assetGroup?.data?.id) {
                    const groupDetails = await AssetService.fetchAssetGroupDetails(
                        enriched.relationships.assetGroup.data.id,
                    );

                    // Update enriched asset with asset group details
                    enriched.assetGroupDetails = groupDetails;
                    setEnrichedAsset(enriched);
                } else {
                    setEnrichedAsset(enriched);
                }
            } catch (error) {
                console.error('Error fetching asset details:', error);
                snackbar(
                    t('errors.failed-to-fetch-asset'),
                    'error',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchAssetDetails();
    }, [assetId, navigate, t]);

    const handleBack = () => {
        navigate(-1); // Go back in history instead of hardcoded path
    };

    // Dummy status change handler - not needed in read-only view but required by component
    const handleStatusChange = () => {};

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handleBack} size="large">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    {enrichedAsset?.attributes?.name || t('asset.details')}
                </Typography>
            </Box>

            {enrichedAsset && (
                <AssetDetailsContent
                    asset={enrichedAsset}
                    operationalSummary={assetOperationalSummary}
                    onStatusChange={handleStatusChange}
                />
            )}
        </Container>
    );
}

export default AssetDetailsPage;
