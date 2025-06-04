import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import { Typography, Breadcrumbs, Link } from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { TableComponent } from '../../../components/common/TableComponent';
import columnsDefinition from '../../../columnDefinitions/allAssetManagement';
import Control from './Controls';
import snackbar from '../../../utils/ts/helper/snackbar';
import { useAssetManagementStore } from '../store/assetManagementStore';
import { fetchAssetsList, enrichAssetsWithIncluded } from '../services/assets/assetService';
import AssetDetailsDrawer from '../components/AssetDetailsDrawer';
import type { Asset, AssetTag } from '../services/types';
import STATUS_MAP from '../statusMap';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2em;
`;

interface AllAssetManagementDataType {
    id: string;
    name: string;
    serialNumber?: string;
    status: string;
    lastModified?: string;
    updatedAt?: string;
    type: string;
    centre?: string;
    tags?: string[];
}

const AllAssetsList = ({
    assetGroupId = 'all-assets',
    centreId = null,
    parentHierarchy,
    onBreadcrumbClick,
}: {
    assetGroupId?: string;
    centreId?: number | null;
    parentHierarchy: any[]; // @TODO FIX THIS
    onBreadcrumbClick: (id: string) => void;
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { assetId: urlAssetId } = useParams();

    // Create columns array by calling the function with translation
    const columns = columnsDefinition({ t });

    // Use individual selectors to prevent unnecessary re-renders
    const search = useAssetManagementStore((state) => state.search);
    const selectedStatus = useAssetManagementStore((state) => state.selectedStatus);
    const paginationModel = useAssetManagementStore((state) => state.paginationModel);
    const sortModel = useAssetManagementStore((state) => state.sortModel);
    const setPaginationModel = useAssetManagementStore((state) => state.setPaginationModel);
    const setSortModel = useAssetManagementStore((state) => state.setSortModel);
    const setSelectedRowId = useAssetManagementStore((state) => state.setSelectedRowId);
    const getSortFields = useAssetManagementStore((state) => state.getSortFields);

    // Use the store values for selectedCentreId and selectedAssetGroupId
    const selectedCentreId = useAssetManagementStore((state) => state.selectedCentreId);
    const selectedAssetGroupId = useAssetManagementStore((state) => state.selectedAssetGroupId);

    // Use the new store features
    const assetsLoading = useAssetManagementStore((state) => state.assetsLoading);
    const setAssets = useAssetManagementStore((state) => state.setAssets);
    const setEnrichedAssets = useAssetManagementStore((state) => state.setEnrichedAssets);
    const setAssetsLoading = useAssetManagementStore((state) => state.setAssetsLoading);
    const setAssetsError = useAssetManagementStore((state) => state.setAssetsError);
    const setAssetsResponse = useAssetManagementStore((state) => state.setAssetsResponse);
    const setIncluded = useAssetManagementStore((state) => state.setIncluded);
    const setMeta = useAssetManagementStore((state) => state.setMeta);

    // Subscribe to selectedAssetDetails changes to update table when asset is updated
    const selectedAssetDetails = useAssetManagementStore((state) => state.selectedAssetDetails);
    const previousSelectedAssetDetailsRef = useRef(selectedAssetDetails);

    const [rows, setRows] = useState<AllAssetManagementDataType[]>([]);
    const [currentHierarchy, setCurrentHierarchy] = useState(parentHierarchy);
    const [shouldSearch, setShouldSearch] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    // Add a ref to track if a fetch is in progress
    const isFetchInProgressRef = useRef(false);
    const previousParamsRef = useRef<string>('');

    // Get the effective values to use (store values take precedence over props)
    const effectiveCentreId = selectedCentreId ?? centreId;
    const effectiveAssetGroupId = selectedAssetGroupId ?? assetGroupId;

    // Create a string representation of current params to compare with previous params
    const currentParams = JSON.stringify({
        centreId: effectiveCentreId,
        assetGroupId: effectiveAssetGroupId,
        search,
        status: selectedStatus,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sort: getSortFields(),
    });

    // Function to fetch assets using the new service
    const fetchAssets = useCallback(async () => {
        // Skip if no centre ID or if a fetch is already in progress
        if (!effectiveCentreId || isFetchInProgressRef.current) return;

        // Skip if parameters haven't changed
        if (currentParams === previousParamsRef.current) return;

        // Update references
        isFetchInProgressRef.current = true;
        previousParamsRef.current = currentParams;

        setAssetsLoading(true);

        try {
            const response = await fetchAssetsList({
                centreId: effectiveCentreId.toString(),
                assetGroupId:
                    effectiveAssetGroupId !== 'all-assets' ? effectiveAssetGroupId : undefined,
                search,
                status: selectedStatus || undefined,
                page: paginationModel.page + 1, // API is 1-indexed, MUI is 0-indexed
                pageSize: paginationModel.pageSize,
                sort: getSortFields(),
            });

            // Store raw data
            setAssetsResponse(response);
            setAssets(response.data || []);
            setIncluded(response.included || []);
            setMeta(response.meta);

            // Update rowCount for pagination
            if (response.meta?.page?.total) {
                setRowCount(response.meta.page.total);
            }

            // Enrich assets with included data
            const enrichedAssets = enrichAssetsWithIncluded(response.data, response.included);
            setEnrichedAssets(enrichedAssets);

            // Map the enriched response to the table format
            const mappedAssets = enrichedAssets.map((asset: Asset) => ({
                id: asset.id,
                name: asset.attributes.name,
                serialNumber: asset.attributes.serialNumber,
                status: STATUS_MAP[asset.attributes.status] || asset.attributes.status,
                lastModified: formatDateWithLocale(asset.attributes.updatedAt),
                updatedAt: asset.attributes.updatedAt,
                centre: asset.centre?.attributes.name,
                tags: asset.tags?.map((tag: AssetTag) => tag.attributes.name),
                type: 'asset',
            }));

            setRows(mappedAssets);
            setAssetsError(null);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : error instanceof Response
                      ? `Server error: ${error.status}`
                      : 'An unexpected error occurred';
            setAssetsError(errorMessage);
            snackbar(
                errorMessage,
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                3000, // Use default 3 second duration
            );
            setRows([]);
        } finally {
            setAssetsLoading(false);
            isFetchInProgressRef.current = false;
        }
    }, [
        effectiveCentreId,
        effectiveAssetGroupId,
        search,
        selectedStatus,
        paginationModel.page,
        paginationModel.pageSize,
        getSortFields,
        setAssets,
        setEnrichedAssets,
        setAssetsLoading,
        setAssetsError,
        setAssetsResponse,
        setIncluded,
        setMeta,
        currentParams,
    ]);

    // Don't make debouncedSearch depend on search to avoid infinite loop
    const debouncedSearch = useCallback(
        debounce(() => {
            if (!assetsLoading) {
                fetchAssets();
            }
            // Clear the flag after search is executed
            setShouldSearch(false);
        }, 500),
        [assetsLoading, fetchAssets], // Removed search dependency
    );

    // When search text changes, set shouldSearch flag but don't trigger search directly
    useEffect(() => {
        setShouldSearch(true);
    }, [search]);

    // Only trigger search when shouldSearch flag is true
    useEffect(() => {
        if (shouldSearch) {
            debouncedSearch();
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [shouldSearch, debouncedSearch]);

    // Fetch data when any of the dependencies change
    useEffect(() => {
        if (effectiveCentreId && !shouldSearch) {
            // Don't fetch if search is pending
            fetchAssets();
        }
    }, [currentParams, fetchAssets, shouldSearch]);

    // Effect to handle direct URL navigation
    useEffect(() => {
        if (urlAssetId) {
            setSelectedAssetId(urlAssetId);
            setDetailsDrawerOpen(true);
        }
    }, [urlAssetId]);

    // Function to update a single row in the table when an asset is modified
    const updateRowInTable = useCallback((updatedAsset: Asset) => {
        if (!updatedAsset) return;

        // Check if this asset exists in our current table rows
        setRows((currentRows) => {
            const rowIndex = currentRows.findIndex((row) => row.id === updatedAsset.id);

            // If asset not found in current rows, no update needed
            if (rowIndex === -1) return currentRows;

            // Create a copy of the rows
            const updatedRows = [...currentRows];

            // Update the specific row with new asset data
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                name: updatedAsset.attributes.name,
                serialNumber: updatedAsset.attributes.serialNumber,
                status:
                    STATUS_MAP[updatedAsset.attributes.status] || updatedAsset.attributes.status,
                lastModified: formatDateWithLocale(updatedAsset.attributes.updatedAt),
                updatedAt: updatedAsset.attributes.updatedAt,
                // Only update these if they exist in the updated asset data:
                ...(updatedAsset.centre && { centre: updatedAsset.centre.attributes.name }),
                ...(updatedAsset.tags && {
                    tags: updatedAsset.tags.map((tag: AssetTag) => tag.attributes.name),
                }),
            };

            return updatedRows;
        });
    }, []);

    // Listen for changes to selectedAssetDetails (which happens after a PATCH update)
    useEffect(() => {
        // Only proceed if selectedAssetDetails has changed and contains data
        if (
            selectedAssetDetails?.data &&
            JSON.stringify(selectedAssetDetails) !==
                JSON.stringify(previousSelectedAssetDetailsRef.current)
        ) {
            // Create enriched asset from the selected asset details
            const enrichedAsset = selectedAssetDetails.included
                ? enrichAssetsWithIncluded(
                      [selectedAssetDetails.data],
                      selectedAssetDetails.included,
                  )[0]
                : selectedAssetDetails.data;

            // Update the row in the table
            updateRowInTable(enrichedAsset);

            // Update the previous ref to avoid duplicate processing
            previousSelectedAssetDetailsRef.current = selectedAssetDetails;
        }
    }, [selectedAssetDetails, updateRowInTable]);

    const handleRowClick = (params: any) => {
        if (params?.row?.type === 'asset') {
            setSelectedRowId(params?.row?.id);
            setSelectedAssetId(params?.row?.id);
            setDetailsDrawerOpen(true);
            navigate(`/asset-management/asset/${params.row.id}`);
        }
    };

    const handleCloseDetailsDrawer = () => {
        setDetailsDrawerOpen(false);
        navigate('/asset-management');
    };

    const handleBreadcrumbClick = (id: string, type = 'asset-group') => {
        if (type === 'asset-group') {
            onBreadcrumbClick(id);
        }
    };

    const handleSortModelChange = (newModel: any) => {
        setSortModel(newModel);
    };

    useEffect(() => {
        setCurrentHierarchy(parentHierarchy);
    }, [parentHierarchy]);

    function formatDateWithLocale(dateString: string) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, 'P, p');
        } catch {
            return dateString;
        }
    }

    return (
        <StyledPage>
            <Typography variant="h5" sx={{ fontWeight: 'bold', padding: '0px', fontSize: '30px' }}>
                {t('navigation.asset-management')}
            </Typography>

            {/* Breadcrumbs with clickable hierarchy */}
            <Breadcrumbs
                separator=">"
                aria-label="breadcrumb"
                sx={{ padding: '0px', marginTop: '-20px', marginBottom: '-5px' }}
            >
                {currentHierarchy.map((item, index) => (
                    <Link
                        key={index}
                        color="inherit"
                        onClick={() => handleBreadcrumbClick(item.id)}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <Typography color="textPrimary">{item.label}</Typography>
                    </Link>
                ))}
            </Breadcrumbs>

            {/* Search and Controls */}
            <Control />

            {/* Assets Table */}
            <TableComponent
                columns={columns}
                rows={rows}
                loading={assetsLoading}
                onRowClick={handleRowClick}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowCount={rowCount}
                pageSizeOptions={[10, 25, 50, 100]}
                autoHeight
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                sx={{ height: 'auto', flex: 1 }}
            />

            {/* Asset Details Drawer */}
            <AssetDetailsDrawer
                open={detailsDrawerOpen}
                onClose={handleCloseDetailsDrawer}
                assetId={selectedAssetId || undefined}
            />
        </StyledPage>
    );
};

export default AllAssetsList;
