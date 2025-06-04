import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Add } from '@mui/icons-material';
import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    FormControl,
    InputLabel,
    Select,
    Stack,
    FormControlLabel,
    styled,
    Switch,
    Tooltip,
    tooltipClasses,
    TooltipProps,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import DateRangePickerWithShortcuts from '../../components/common/DateRangePickerWithShortcuts';
import fetchCentresList, { CentreData } from '../../services/centres';

interface ControlsProps {
    onCreate?: () => void;
    selectedStatus: StatusListProps | null;
    setSelectedStatus: React.Dispatch<React.SetStateAction<StatusListProps | null>>;
    selectedCategory: CategoryListProps | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryListProps | null>>;
    selectedStore: StoreListProps | null;
    setSelectedStore: React.Dispatch<React.SetStateAction<StoreListProps | null>>;
    dateCreatedFrm: Date | null;
    setDateCreatedFrm: React.Dispatch<React.SetStateAction<Date | null>>;
    dateCreatedTo: Date | null;
    setDateCreatedTo: React.Dispatch<React.SetStateAction<Date | null>>;
    dateModifiedFrm: Date | null;
    setDateModifiedFrm: React.Dispatch<React.SetStateAction<Date | null>>;
    dateModifiedTo: Date | null;
    setDateModifiedTo: React.Dispatch<React.SetStateAction<Date | null>>;
    propertyList: PropertyListProps[];
    setPropertyList: React.Dispatch<React.SetStateAction<PropertyListProps[]>>;
    selectedProperty: PropertyListProps | null;
    setSelectedProperty: React.Dispatch<React.SetStateAction<PropertyListProps | null>>;
    onDateRangeChange?: () => void;
    onSearchChange?: (value: string) => void;
}

interface StatusListProps {
    id: string;
    name: string;
}

interface CategoryListProps {
    id: number;
    name: string;
}

interface StoreListProps {
    id: number;
    name: string;
}

interface PropertyListProps {
    id: number;
    name: string;
}

interface Category {
    id: string;
    attributes: {
        name: string;
    };
    relationships: {
        forms: {
            data: any[];
        };
    };
}

interface TransformedCategory {
    id: number;
    name: string;
}

interface Store {
    id: string;
    attributes: {
        name: string;
    };
}

interface TransformedStore {
    id: number;
    name: string;
}

interface TransformedCentres {
    id: number;
    name: string;
}

// Add a static cache for statuses at module level since they rarely change
let staticStatusList: StatusListProps[] | null = null;

const Controls = ({
    onCreate,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    selectedStore,
    setSelectedStore,
    dateCreatedFrm,
    setDateCreatedFrm,
    dateCreatedTo,
    setDateCreatedTo,
    dateModifiedFrm,
    setDateModifiedFrm,
    dateModifiedTo,
    setDateModifiedTo,
    propertyList,
    setPropertyList,
    selectedProperty,
    setSelectedProperty,
    onDateRangeChange,
    onSearchChange,
}: ControlsProps) => {
    const { t } = useTranslation();
    const [statusList, setStatusList] = useState<StatusListProps[]>([]);
    const [categoryList, setCategoryList] = useState<CategoryListProps[]>([]);
    const [storeList, setStoresList] = useState<StoreListProps[]>([]);

    // For debugging
    const componentRendersRef = useRef(0);
    const apiCallsRef = useRef({
        status: 0,
        store: 0,
        properties: 0,
        category: 0,
    });

    // To prevent duplicate API calls
    const loadedRef = useRef({
        status: false,
        store: false,
        properties: false,
    });

    // Log renders (but only when in development, and limited frequency)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            componentRendersRef.current += 1;
        }
    });

    const handleResetFilters = () => {
        setSelectedProperty(null);
        setSelectedStore(null);
        setSelectedCategory(null);
        setSelectedStatus(null);

        // Explicitly set date values to null to ensure proper clearing
        setDateCreatedFrm(null);
        setDateCreatedTo(null);
        setDateModifiedFrm(null);
        setDateModifiedTo(null);

        // Notify parent component that date range has changed
        if (onDateRangeChange) {
            onDateRangeChange();
        }
    };

    // Combine all initial data loading into a single useEffect to prevent duplicate calls
    useEffect(() => {
        // Only load each resource once
        if (!loadedRef.current.status) {
            getStatus();
            loadedRef.current.status = true;
        }

        if (!loadedRef.current.store) {
            getStore();
            loadedRef.current.store = true;
        }

        if (!loadedRef.current.properties) {
            getProperties();
            loadedRef.current.properties = true;
        }
    }, []);

    // This useEffect should only run when selectedProperty changes
    useEffect(() => {
        if (selectedProperty?.id !== undefined) {
            getCategory(selectedProperty?.id);
            setSelectedCategory(null);
        }
    }, [selectedProperty?.id]);

    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} arrow classes={{ popper: className }} placement="right" />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: 'white',
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'white',
            color: 'grey',
            boxShadow: theme.shadows[3],
            fontSize: 11,
        },
    }));
    const [typeChecked, setTypeChecked] = useState(false);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTypeChecked(event.target.checked);
    };

    const getStatus = useCallback(async () => {
        try {
            // If we already have a cached status list, use it
            if (staticStatusList && staticStatusList.length > 0) {
                setStatusList(staticStatusList);
                return;
            }

            apiCallsRef.current.status += 1;

            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/tickets/statuses`);
            const statusData = response.data.data;
            if (Array.isArray(statusData)) {
                const transformedData: StatusListProps[] = statusData.map((item: any) => ({
                    id: item.attributes.slug,
                    name: item.attributes.label,
                }));
                // Cache the status list for future use
                staticStatusList = transformedData;
                setStatusList(transformedData);
            } else {
                setStatusList([]);
                console.error("Response data 'data' is not an array", statusData);
            }
        } catch (error) {
            setStatusList([]);
            console.error('Statuses not fetched', error);
        }
    }, []);

    const getCategory = useCallback(async (propertyId: number | undefined) => {
        if (propertyId === undefined) return;

        try {
            apiCallsRef.current.category += 1;

            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/categories` +
                    `?filter[centreId]=${propertyId || ''}&include=forms`,
            );
            const categoriesData = response.data.data;
            if (Array.isArray(categoriesData)) {
                const transformedData: TransformedCategory[] = [];
                categoriesData.forEach((item: Category) => {
                    if (item?.relationships?.forms?.data.length) {
                        transformedData.push({
                            id: Number(item.id),
                            name: item.attributes.name,
                        });
                    }
                });
                setCategoryList(transformedData);
            } else {
                console.error("Response data 'data' is not an array", categoriesData);
            }
        } catch (error) {
            console.error('Categories not fetch ', error);
        }
    }, []);

    const getStore = useCallback(async () => {
        try {
            apiCallsRef.current.store += 1;

            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/locals`);
            const storeData = response.data.data;
            if (Array.isArray(storeData)) {
                const transformedData: TransformedStore[] = storeData.map((item: Store) => ({
                    id: Number(item.id),
                    name: item.attributes.name,
                }));
                setStoresList(transformedData);
            } else {
                console.error("Response data 'data' is not an array", storeData);
            }
        } catch (error) {
            console.error('Categories not fetch ', error);
        }
    }, []);

    const getProperties = useCallback(async () => {
        try {
            apiCallsRef.current.properties += 1;

            const response = await fetchCentresList();
            const centresData = response.data;
            if (Array.isArray(centresData)) {
                const transformedData: TransformedCentres[] = centresData.map(
                    (item: CentreData) => ({
                        id: Number(item.id),
                        name: item.attributes.name,
                    }),
                );
                setPropertyList(transformedData);
            } else {
                console.error("Response data 'data' is not an array", centresData);
            }
        } catch (error) {
            console.error('Categories not fetch ', error);
        }
    }, []);

    // Function to handle date range changes
    const handleCreatedDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
        // Set the start and end dates in state
        // The DateRangePickerWithShortcuts component now handles the proper formatting
        // with T00:00:00.000000Z for start dates and T23:59:59.000000Z for end dates
        setDateCreatedFrm(startDate);
        setDateCreatedTo(endDate);

        // Notify parent component that date range has changed
        if (onDateRangeChange) {
            onDateRangeChange();
        }
    };

    // Function to handle date range changes
    const handleModifieldDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
        // Set the start and end dates in state
        // The DateRangePickerWithShortcuts component now handles the proper formatting
        // with T00:00:00.000000Z for start dates and T23:59:59.000000Z for end dates
        setDateModifiedFrm(startDate);
        setDateModifiedTo(endDate);

        // Notify parent component that date range has changed
        if (onDateRangeChange) {
            onDateRangeChange();
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: '1em',
                    justifyContent: 'space-between',
                }}
            >
                <TextField
                    id="input-with-icon-textfield"
                    label={t('common.search')}
                    onChange={(e) => onSearchChange?.(e.currentTarget.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        height: '80%',
                        width: '40%',
                    }}
                    variant="outlined"
                />

                <Box sx={{ display: 'flex', gap: '1em' }}>
                    <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Add />}
                        onClick={onCreate}
                        sx={{
                            height: '80%',
                        }}
                    >
                        {t('buttons.add-case-works')}
                    </Button>
                </Box>
            </Box>

            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ flexGrow: 1, pt: 4, maxWidth: '80%' }}
            >
                <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="status-name-label">
                            {t('select.case-work-status')}
                        </InputLabel>
                        <Select
                            labelId="company-name-select"
                            value={selectedStatus?.id || ''}
                            label={t('select.case-work-status')}
                            onChange={(e) => {
                                setSelectedStatus(
                                    statusList.find((status) => status.id === e.target.value) ||
                                        null,
                                );
                            }}
                        >
                            {statusList.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="case-work-property'">
                            {t('select.case-work-property')}
                        </InputLabel>
                        <Select
                            labelId="property-name-select"
                            value={selectedProperty?.id || ''}
                            label={t('select.case-work-property')}
                            onChange={(e) => {
                                setSelectedProperty(
                                    propertyList.find(
                                        (property) => property.id === e.target.value,
                                    ) || null,
                                );
                            }}
                        >
                            {propertyList.map((priority) => (
                                <MenuItem key={priority.id} value={priority.id}>
                                    {priority.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="case-work-store'">{t('select.case-work-store')}</InputLabel>
                        <Select
                            labelId="category-name-select"
                            value={selectedStore?.id || ''}
                            label={t('select.case-work-store')}
                            onChange={(e) => {
                                setSelectedStore(
                                    storeList.find((store) => store.id === e.target.value) || null,
                                );
                            }}
                        >
                            {storeList.map((store) => (
                                <MenuItem key={store.id} value={store.id}>
                                    {store.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select.case-work-category'">
                            {t('select.case-work-category')}
                        </InputLabel>
                        <Select
                            labelId="category-name-select"
                            value={selectedCategory?.id || ''}
                            label={t('select.case-work-category')}
                            onChange={(e) => {
                                setSelectedCategory(
                                    categoryList.find(
                                        (category) => category.id === e.target.value,
                                    ) || null,
                                );
                            }}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ pt: 4 }}
            >
                <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                    <DateRangePickerWithShortcuts
                        startDate={dateCreatedFrm}
                        endDate={dateCreatedTo}
                        onDateRangeChange={handleCreatedDateRangeChange}
                        // width="240px"
                        label={t('common.date-created')}
                        clearable={true}
                        skipAutoInit={true}
                        resetToLastSevenDaysOnClear={false}
                        disableMinDateRestriction={true}
                    />
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                    <DateRangePickerWithShortcuts
                        startDate={dateModifiedFrm}
                        endDate={dateModifiedTo}
                        onDateRangeChange={handleModifieldDateRangeChange}
                        // width="240px"
                        label={t('common.date-modified')}
                        clearable={true}
                        skipAutoInit={true}
                        resetToLastSevenDaysOnClear={false}
                        disableMinDateRestriction={true}
                    />
                </Grid>
            </Grid>

            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ flexGrow: 1, pt: 4 }}
            >
                <Grid size={{ xs: 1, sm: 4, md: 7 }}>
                    <Stack display="flex" alignItems="center" direction="row" spacing={2}>
                        <FormControlLabel
                            value="start"
                            control={
                                <Switch
                                    color="primary"
                                    checked={typeChecked}
                                    onChange={handleTypeChange}
                                />
                            }
                            label={t('cases.include_all_work_orders')}
                            labelPlacement="start"
                        />

                        <LightTooltip
                            title={
                                <>
                                    {t('cases.toggle_msg_part1')}
                                    <br />
                                    {t('cases.toggle_msg_part2')}
                                    <br />
                                    {t('cases.toggle_msg_part3')}
                                </>
                            }
                        >
                            <HelpOutlineIcon
                                sx={{
                                    color: '#222222',
                                }}
                            />
                        </LightTooltip>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 2, sm: 4, md: 5 }}>
                    <Stack direction="row" spacing={2} justifyContent="end">
                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            onClick={handleResetFilters}
                        >
                            {t('buttons.clear-filter')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            onClick={handleResetFilters}
                        >
                            {t('common.filter_header.clear_sorting')}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Controls;
