import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useTableSortingStore from './tableSortingStore';

export interface FilterActionButtonsProps {
    hasFilters: boolean;
    handleClearFilters: () => void;
    hasSorting?: boolean;
    handleClearSorting?: () => void;
}

const FilterActionButtons = ({
    hasFilters,
    handleClearFilters,
    hasSorting: propHasSorting = false,
    handleClearSorting,
}: FilterActionButtonsProps) => {
    const { t } = useTranslation();

    // Get global sorting state from store (with prop fallback)
    const globalHasSorting = useTableSortingStore((state: any) => state.hasSorting);
    const hasSorting = propHasSorting || globalHasSorting;

    // Handle clearing sort model with fallback to the global store action
    const handleClearSort = () => {
        if (handleClearSorting) {
            // Use provided handler if available
            handleClearSorting();
        } else {
            // Otherwise use the direct store method for immediate effect
            useTableSortingStore.getState().clearAllTableSorting();
        }
    };

    return (
        <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
                <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={handleClearFilters}
                    disabled={!hasFilters}
                    data-cy="clear-filters-button"
                >
                    {t('common.filter_header.clear_filters')}
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={handleClearSort}
                    disabled={!hasSorting}
                    data-cy="clear-sorting-button"
                    data-sorting-active={hasSorting}
                >
                    {t('common.filter_header.clear_sorting')}
                </Button>
            </Grid>
        </Grid>
    );
};

export default FilterActionButtons;
