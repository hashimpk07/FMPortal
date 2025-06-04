import { Box, TextField, InputAdornment, Button, Autocomplete } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import Grid from '@mui/material/Grid2';
import type { DocumentTypeData } from '../../../types/pageTypes';
// import { AssetStatus } from '../../../services/assetManagement';
import { useAssetManagementStore } from '../store/assetManagementStore';
import CreateAssetButton from '../components/CreateAssetButton';
import STATUS_MAP from '../statusMap';

// This data represents contractors responsible for assets
// Note: we use contractor selection state for this dropdown
const contractors = [
    { id: 1, name: 'Michael Brown' },
    { id: 2, name: 'Sophia Williams' },
    { id: 3, name: 'Daniel Lee' },
    { id: 4, name: 'DOlivia Harris' },
    { id: 5, name: 'James Taylor' },
    { id: 6, name: 'Charlotte King' },
    { id: 7, name: 'Ethan Scott' },
];

// Status options for the Autocomplete component
const statusOptions = [
    { value: 'operational', label: STATUS_MAP.operational },
    { value: 'pending_repair', label: STATUS_MAP.pending_repair },
    { value: 'missing', label: STATUS_MAP.missing },
    { value: 'out_of_service', label: STATUS_MAP.out_of_service },
];

function Controls() {
    const [documentTypes] = useState<DocumentTypeData[]>(contractors);
    const { t } = useTranslation();

    // Local state for debounced search input
    const [searchInput, setSearchInput] = useState('');

    // Use individual selectors to prevent unnecessary re-renders
    const search = useAssetManagementStore((state) => state.search);
    const setSearch = useAssetManagementStore((state) => state.setSearch);
    const selectedStatus = useAssetManagementStore((state) => state.selectedStatus);
    const setSelectedStatus = useAssetManagementStore((state) => state.setSelectedStatus);
    // Use contractor selection state
    const selectedContractor = useAssetManagementStore((state) => state.selectedContractorId);
    const setSelectedContractor = useAssetManagementStore((state) => state.setSelectedContractorId);
    const resetFilters = useAssetManagementStore((state) => state.resetFilters);
    const setPaginationModel = useAssetManagementStore((state) => state.setPaginationModel);
    const resetTableOptions = useAssetManagementStore((state) => state.resetTableOptions);

    // Set up debounced search
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 500),
        [setSearch],
    );

    // Initialize local search input with store value
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    // Handle search input changes with debouncing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSetSearch(value);
    };

    // Clear debounced search on unmount
    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    // Handle reset filters to reset the pagination as well to make sure we fetch from the first page
    const handleResetFilters = () => {
        resetFilters();
        setPaginationModel({ page: 0, pageSize: 10 });
    };

    const handleResetSorting = () => {
        resetTableOptions();
    };

    // Get the currently selected status option
    const getSelectedStatusOption = () => {
        if (!selectedStatus) return null;
        return statusOptions.find((option) => option.value === selectedStatus) || null;
    };

    // Get the currently selected contractor
    const getSelectedContractorOption = () => {
        if (!selectedContractor) return null;
        return documentTypes.find((option) => option.id === selectedContractor) || null;
    };

    // Handle status change
    const handleStatusChange = (
        _event: React.SyntheticEvent,
        newValue: { value: string; label: string } | null,
    ) => {
        setSelectedStatus(newValue?.value || '');
        // Reset to first page when changing filters
        setPaginationModel({ page: 0, pageSize: 10 });
    };

    // Handle contractor change
    const handleContractorChange = (
        _event: React.SyntheticEvent,
        newValue: DocumentTypeData | null,
    ) => {
        setSelectedContractor(newValue?.id?.toString() || '');
        // Reset to first page when changing filters
        setPaginationModel({ page: 0, pageSize: 10 });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                        id="input-with-icon-textfield"
                        label={t('asset.search')}
                        value={searchInput}
                        onChange={handleSearchChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '10px' },
                            },
                        }}
                        sx={{ width: '60%', height: '90%' }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CreateAssetButton />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        id="status-select"
                        options={statusOptions}
                        getOptionLabel={(option) => option.label}
                        value={getSelectedStatusOption()}
                        onChange={handleStatusChange}
                        renderInput={(params) => (
                            <TextField {...params} label={t('asset.status')} variant="outlined" />
                        )}
                        sx={{ width: '80%' }}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        clearIcon={null}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        id="contractor-select"
                        options={documentTypes}
                        getOptionLabel={(option) => option.name.toString()}
                        value={getSelectedContractorOption()}
                        onChange={handleContractorChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('asset.contractor-responsible')}
                                variant="outlined"
                            />
                        )}
                        sx={{
                            width: '80%',
                            marginLeft: '-15px',
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        clearIcon={null}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetFilters}
                        sx={{
                            fontSize: '14px',
                            // fontWeight: 'bold',
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '90%',
                        }}
                    >
                        {t('buttons.clear-filter')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        onClick={handleResetSorting}
                        sx={{
                            fontSize: '14px',
                            // fontWeight: 'bold',
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '90%',
                        }}
                    >
                        {t('buttons.clear-sorting')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Controls;
