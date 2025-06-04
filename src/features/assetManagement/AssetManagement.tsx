import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, TextField, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import AllAssetsList from './assetmanagementList/AllAssetsList';
import fetchCentresList, { CentreData } from '../../services/centres';
import { PropertyData } from '../../types/pageTypes';
import { getAllAssetGroups } from '../../services/assetManagement';
import AssetManagementList from './assetmanagementList/AssetGroupTree/AssetGroupTreeComponent';
import { useAssetManagementStore } from './store/assetManagementStore';
import { CentreSkeleton, AssetGroupsSkeleton } from './components/Closet/AssetManagementSkeleton';

const AssetManagement: React.FC = () => {
    const { t } = useTranslation();

    // Get store selectors and actions
    const selectedAssetGroupId = useAssetManagementStore((state) => state.selectedAssetGroupId);
    const setSelectedAssetGroupId = useAssetManagementStore(
        (state) => state.setSelectedAssetGroupId,
    );
    const setSelectedCentreId = useAssetManagementStore((state) => state.setSelectedCentreId);
    const setSelectedCentreConfig = useAssetManagementStore(
        (state) => state.setSelectedCentreConfig,
    );

    const [activeItem, setActiveItem] = useState<string>(selectedAssetGroupId || 'all-assets');
    const [loadingCentres, setLoadingCentres] = useState(false);
    const [loadingAssetGroups, setLoadingAssetGroups] = useState(false);

    const [flatAssetGroups, setFlatAssetGroups] = useState<PropertyData[]>([]);
    const [assetGroups, setAssetGroups] = useState<PropertyData[]>([]);
    const [centres, setCentres] = useState<CentreData[]>([]);
    const [selectedCentre, setSelectedCentre] = useState<CentreData | undefined>(undefined);

    const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

    const [expandedSections, setExpandedSections] = useState<string[]>(['all-assets']);

    useEffect(() => {
        setLoadingCentres(true);
        fetchCentresList().then((r) => {
            setCentres(r?.data || []);
            const firstCentre = r?.data?.[0];
            setSelectedCentre(firstCentre);
            if (firstCentre?.id) {
                setSelectedCentreId(firstCentre.id);
                // Store the centre config in the store
                if (firstCentre.attributes?.config) {
                    setSelectedCentreConfig(firstCentre.attributes.config);
                }
            }
            setActiveItem('all-assets');
            setSelectedAssetGroupId('all-assets');
            setLoadingCentres(false);
        });
    }, [setSelectedCentreId, setSelectedAssetGroupId, setSelectedCentreConfig]);

    const getAssetGroupsForCentre = () => {
        if (selectedCentre?.id) {
            getAllAssetGroups(Number(selectedCentre?.id)).then((r: any) => {
                const buildTree = (data: any) => {
                    // Create a map to store nodes by their IDs
                    const nodeMap = new Map<string, any>();
                    const rootNodes: any[] = [];

                    // First pass: create all nodes and store them in the map
                    data.forEach((item: any) => {
                        const node = { ...item, children: [] };
                        nodeMap.set(item.id, node);
                    });

                    // Second pass: establish parent-child relationships
                    data.forEach((item: any) => {
                        const node = nodeMap.get(item.id)!;
                        const parentId = item.attributes.parentId;

                        if (parentId && nodeMap.has(parentId)) {
                            // Add node to parent's children array
                            const parent = nodeMap.get(parentId)!;
                            if (!parent.children) {
                                parent.children = [];
                            }
                            parent.children.push(node);
                        } else {
                            // If no parent or parent not found, it's a root node
                            rootNodes.push(node);
                        }
                    });

                    return rootNodes;
                };

                setAssetGroups(buildTree(r?.aggData) || []);
                setFlatAssetGroups(r?.aggData);
                setLoadingAssetGroups(false);
            });
        }
    };

    useEffect(() => {
        setAssetGroups([]);
        setFlatAssetGroups([]);

        setLoadingAssetGroups(true);
        getAssetGroupsForCentre();
    }, [selectedCentre]);

    useEffect(() => {
        if (activeItem === 'all-assets') {
            setBreadcrumbs([
                {
                    label: selectedCentre?.attributes?.name ?? '',
                    id: 'all-assets',
                },
            ]);
        } else {
            const buildBreadcrumbs = (data: any[], id: string): any[] => {
                const findGroupById = (groupId: string) =>
                    data.find((group) => group.id === groupId);

                const breadcrumbs: any[] = [];
                let currentGroup = findGroupById(id);

                while (currentGroup) {
                    breadcrumbs.unshift({
                        id: currentGroup.id,
                        label: currentGroup.attributes.name,
                    });
                    if (!currentGroup.attributes.parentId) break;
                    currentGroup = findGroupById(currentGroup.attributes.parentId);
                }

                return breadcrumbs;
            };

            setBreadcrumbs([
                {
                    label: selectedCentre?.attributes?.name ?? '',
                    id: 'all-assets',
                },
                ...buildBreadcrumbs(flatAssetGroups, activeItem),
            ]);
        }
    }, [selectedCentre, activeItem]);

    const handleItemClick = (label: string) => {
        setActiveItem(label);
        setSelectedAssetGroupId(label);
    };

    const handleBreadcrumbClick = (fullPath: string) => {
        if (!fullPath) return;

        const pathSegments = fullPath.split(' > ');
        let relevantPath: string;

        if (pathSegments.length >= 2) {
            relevantPath = `${pathSegments[pathSegments.length - 2]} > ${pathSegments[pathSegments.length - 1]}`;
        } else {
            relevantPath = pathSegments[pathSegments.length - 1];
        }

        setActiveItem(relevantPath);
        setSelectedAssetGroupId(relevantPath);
    };

    const handleSectionToggle = (section: string) => {
        setExpandedSections((prev) => {
            if (prev.includes(section)) {
                return prev.filter((item) => item !== section);
            }
            return [...prev, section];
        });
    };

    return (
        <Grid container spacing={2} size={{ lg: 12 }} sx={{ width: '100%' }}>
            <Grid size={{ xs: 12, md: 5, lg: 3 }}>
                <Paper
                    sx={{
                        height: 'auto',
                        border: '1px solid #E0E0E0',
                        boxShadow: 'none',
                    }}
                >
                    {loadingCentres && <CentreSkeleton />}
                    {!loadingCentres && (
                        <Autocomplete<CentreData, false, true, false>
                            key={`centre-autocomplete-${selectedCentre?.id || 'init'}`}
                            value={selectedCentre}
                            options={centres}
                            getOptionLabel={(option) => option?.attributes?.name ?? ''}
                            onChange={(_, value) => {
                                setSelectedCentre(value || undefined);
                                if (value?.id) {
                                    setSelectedCentreId(value.id);
                                    // Store the centre config in the store when centre changes
                                    if (value.attributes?.config) {
                                        setSelectedCentreConfig(value.attributes.config);
                                    }
                                }
                            }}
                            disableClearable
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label=""
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            '&:hover fieldset': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            width: '75%',
                                            color: '#333333',
                                        },
                                    }}
                                />
                            )}
                            sx={{
                                width: 'auto',
                                minWidth: '12.5rem',
                                height: '2.5rem',
                                '& .MuiAutocomplete-endAdornment': {
                                    right: '0.5rem',
                                },
                            }}
                        />
                    )}

                    {loadingAssetGroups && <AssetGroupsSkeleton />}

                    {!loadingAssetGroups && (
                        <MenuList>
                            <Box>
                                <Typography variant="h6">
                                    <AssetManagementList
                                        id={'all-assets'}
                                        label={t('asset.all-assets')}
                                        onItemClick={handleItemClick}
                                        activeItem={activeItem}
                                        expandedSections={expandedSections}
                                        handleSectionToggle={handleSectionToggle}
                                        nestedItems={assetGroups}
                                        flatAssetGroups={flatAssetGroups}
                                        selectedCentre={
                                            selectedCentre?.id ? Number(selectedCentre.id) : null
                                        }
                                        getAssetGroupsForCentre={getAssetGroupsForCentre}
                                    />
                                </Typography>
                            </Box>
                        </MenuList>
                    )}
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 7, lg: 9 }}>
                <Box sx={{ flex: 1, padding: 2, borderRadius: '8px' }}>
                    {selectedCentre?.id && (
                        <AllAssetsList
                            centreId={Number(selectedCentre?.id) || null}
                            assetGroupId={activeItem}
                            parentHierarchy={breadcrumbs}
                            onBreadcrumbClick={handleBreadcrumbClick}
                        />
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default AssetManagement;
