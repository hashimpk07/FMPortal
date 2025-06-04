import React, { useEffect, useState, useId } from 'react';
import { styled } from '@mui/material/styles';
import {
    DataGridPro,
    DataGridProProps,
    GridSlotProps,
    GridLoadingOverlayVariant,
    GridFilterModel,
    GridLogicOperator,
    GridPaginationModel,
    GridSortModel,
    GridCallbackDetails,
} from '@mui/x-data-grid-pro';
import { Box, SxProps } from '@mui/material';
import CustomPagination from './CustomPagination';
import FilterActionButtons from './FilterActionButtons';
import useTableSortingStore from './tableSortingStore';

export interface TableComponentProps extends DataGridProProps {
    // Extend this interface with any extra custom props if needed
    filterModel?: GridFilterModel;
    onFilterModelChange?: (model: GridFilterModel) => void;
    filterMode?: 'client' | 'server';
    resetOnUnmount?: boolean;
    // Custom sort model clearing function (optional)
    clearSortModel?: () => void;
    // Detached pagination props
    useDetachedPagination?: boolean;
    detachedPaginationOptions?: number[];
    containerSx?: SxProps;
    paginationSx?: SxProps;
    // Show filter action buttons
    showFilterActionButtons?: boolean;
    hasFilters?: boolean;
    handleClearFilters?: () => void;
    // Optional table ID for sorting state tracking
    tableId?: string;
    // Hide rows per page selector in pagination
    hideRowsPerPage?: boolean;
    // Backward compatibility for older components
    hidePagination?: boolean;
}

const defaultSlotProps: Partial<GridSlotProps> = {
    loadingOverlay: {
        variant: 'skeleton' as GridLoadingOverlayVariant,
        noRowsVariant: 'skeleton' as GridLoadingOverlayVariant,
    },
};

const StyledDataGridPro = styled(DataGridPro)(() => ({
    '& > *': {
        borderBottom: 'unset',
    },
    maxWidth: '100%',
    // Use a smaller default min-height
    minHeight: '200px',
    height: 'auto',
    '& .MuiDataGrid-row:hover': {
        cursor: 'pointer',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        whiteSpace: 'normal',
        lineHeight: 'normal',
        fontWeight: '700',
        textAlign: 'inherit',
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: 'rgb(251, 252, 254)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'inherit',
    },
    '& .MuiDataGrid-columnHeaders': {
        maxHeight: '168px !important',
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        flex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    '& .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer': {
        marginLeft: 'auto',
    },
    // Header styling for consistent look
    '& .MuiDataGrid-container--top [role=row]': {
        backgroundColor: '#FBFCFE',
        fontWeight: '700',
    },
    '& .MuiDataGrid-row': {
        fontWeight: 400,
    },
    '& .MuiDataGrid-cell': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontWeight: 400,
    },
    // For cell content wrapper
    '& .MuiDataGrid-cellContent': {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    // Hide the built-in pagination toolbar
    '& .MuiDataGrid-footerContainer': {
        display: 'none',
    },
    // Detail panel styling
    '& .MuiDataGrid-detailPanel': {
        paddingLeft: '50px', // Width of the expand column
    },
    '& .MuiDataGrid-detailPanelWrapper': {
        paddingLeft: '50px', // Width of the expand column
    },
}));

const TableComponent: React.FC<TableComponentProps> = React.memo((props) => {
    const {
        sx,
        slotProps,
        sortModel: externalSortModel,
        onSortModelChange: externalOnSortModelChange,
        filterModel,
        onFilterModelChange,
        filterMode = 'server',
        resetOnUnmount = true,
        clearSortModel: externalClearSortModel,
        paginationMode = 'server',
        useDetachedPagination = true, // Default to using detached pagination
        detachedPaginationOptions,
        containerSx,
        paginationSx,
        paginationModel: externalPaginationModel,
        onPaginationModelChange,
        showFilterActionButtons = false,
        hasFilters = false,
        handleClearFilters,
        tableId: externalTableId,
        hideRowsPerPage = false,
        hidePagination = false, // For backward compatibility
        ...otherProps
    } = props;

    // Generate a unique ID for this table instance if one isn't provided
    const internalTableId = useId();
    const tableId = externalTableId || internalTableId;

    // Track internal sort model if no external one is provided
    const [internalSortModel, setInternalSortModel] = useState<GridSortModel>([]);

    // Use provided sort model or internal one
    const sortModel = externalSortModel || internalSortModel;
    const hasSorting = sortModel && sortModel.length > 0;

    // Connect to global store for sorting state and clear commands
    const tableSortingStateValue = useTableSortingStore(
        (state: any) => state.tableSortingState[tableId],
    );
    const clearSortingFlag = useTableSortingStore((state: any) => state.clearSortingFlag);

    // State for controlled pagination
    const [internalPaginationModel, setInternalPaginationModel] =
        React.useState<GridPaginationModel>({
            page: 0,
            pageSize: otherProps.initialState?.pagination?.paginationModel?.pageSize || 10,
        });

    // Use external or internal pagination model
    const paginationModel = externalPaginationModel || internalPaginationModel;

    // Merge slot props with defaults
    const mergedSlotProps = (
        slotProps ? { ...defaultSlotProps, ...slotProps } : defaultSlotProps
    ) as GridSlotProps;

    // Create a default clearSortModel function if none is provided
    const defaultClearSortModel = React.useCallback(() => {
        setInternalSortModel([]);
        if (externalOnSortModelChange) {
            externalOnSortModelChange([], {
                reason: 'api',
                api: {} as any,
            });
        }
    }, [externalOnSortModelChange]);

    // Use provided clearSortModel or our default implementation
    const effectiveClearSortModel = externalClearSortModel || defaultClearSortModel;

    // If tableSortingState for this table was reset externally (e.g., by clear button)
    // then we need to clear our local sorting state too
    useEffect(() => {
        if (tableSortingStateValue === undefined && hasSorting) {
            // This should happen when the table ID was removed from the store
            // which happens when resetSortingForTable or resetAllSorting are called
            effectiveClearSortModel();
        }
    }, [tableSortingStateValue, hasSorting, effectiveClearSortModel]);

    // Effect to clear sorting immediately when global flag is set
    useEffect(() => {
        if (clearSortingFlag) {
            effectiveClearSortModel();
        }
    }, [clearSortingFlag, effectiveClearSortModel]);

    // Notify parent components when sorting state changes
    useEffect(() => {
        if (tableId) {
            useTableSortingStore.getState().setTableSortingState(tableId, hasSorting);
        }
    }, [hasSorting, tableId]);

    // Reset sort model and filters when component unmounts if resetOnUnmount is true
    // Using a ref to store clearSortModel to avoid it being in the dependency array
    const clearSortModelRef = React.useRef(effectiveClearSortModel);
    clearSortModelRef.current = effectiveClearSortModel;

    const onFilterModelChangeRef = React.useRef(onFilterModelChange);
    onFilterModelChangeRef.current = onFilterModelChange;

    useEffect(() => {
        return () => {
            if (resetOnUnmount) {
                if (clearSortModelRef.current) {
                    clearSortModelRef.current();
                }
                if (onFilterModelChangeRef.current) {
                    onFilterModelChangeRef.current({
                        items: [],
                        logicOperator: GridLogicOperator.And,
                    });
                }
                // Clean up sorting state in the store
                if (tableId) {
                    useTableSortingStore.getState().resetSortingForTable(tableId);
                }
            }
        };
    }, [resetOnUnmount, tableId]); // Only depend on resetOnUnmount and tableId

    // Determine if there are rows to display
    // const hasRows = otherProps.rows && otherProps.rows.length > 0;
    // Hide pagination when there are no rows, when loading, when pagination is disabled, or when there's only one row
    const rowCount = otherProps.rows?.length || 0;
    const shouldShowPagination = !otherProps.loading && otherProps.pagination !== false;
    // hasRows && !otherProps.loading && otherProps.pagination !== false && rowCount > 1;

    // Calculate dynamic height based on rows
    const autoHeightSx = {
        ...sx,
        // Set a reasonable height based on number of rows (minimum 200px)
        minHeight: rowCount > 0 ? `${Math.min(rowCount * 52 + 60, 400)}px` : '200px',
    };

    // Handler for sort model changes
    const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        setInternalSortModel(model);
        if (externalOnSortModelChange) {
            externalOnSortModelChange(model, details);
        }
    };

    // Handler for clearing sort model - just calls the effectiveClearSortModel
    const handleClearSorting = () => {
        effectiveClearSortModel();
    };

    // Handler for custom pagination changes
    const handlePageChange = (newPage: number) => {
        const newModel = { ...paginationModel, page: newPage };
        setInternalPaginationModel(newModel);

        // If using external pagination model, update it
        if (onPaginationModelChange) {
            // Call without details - MUI will handle the event
            onPaginationModelChange(newModel, {} as any);
        }
    };

    const handlePageSizeChange = (newPageSize: number) => {
        const newModel = { page: 0, pageSize: newPageSize };
        setInternalPaginationModel(newModel);

        // If using external pagination model, update it
        if (onPaginationModelChange) {
            // Call without details - MUI will handle the event
            onPaginationModelChange(newModel, {} as any);
        }
    };

    // Only show filter buttons when explicitly requested via prop
    // No auto-show behavior - this ensures we don't get duplicate buttons

    // If not using detached pagination, use the standard DataGrid
    if (useDetachedPagination === false) {
        return (
            <Box>
                {showFilterActionButtons && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mb: 2,
                        }}
                    >
                        <FilterActionButtons
                            hasFilters={hasFilters}
                            handleClearFilters={handleClearFilters || (() => {})}
                            hasSorting={hasSorting}
                            handleClearSorting={handleClearSorting}
                        />
                    </Box>
                )}
                <StyledDataGridPro
                    {...otherProps}
                    sx={autoHeightSx}
                    slotProps={mergedSlotProps}
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    sortModel={sortModel}
                    onSortModelChange={externalOnSortModelChange || handleSortModelChange}
                    filterModel={filterModel}
                    onFilterModelChange={onFilterModelChange}
                    filterMode={filterMode}
                    paginationMode={paginationMode}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                    pagination // Ensure pagination is enabled
                    rowCount={otherProps.rowCount || (otherProps.rows ? otherProps.rows.length : 0)}
                    data-table-id={tableId}
                />
            </Box>
        );
    }

    // DataGrid with detached pagination (default)
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                ...containerSx,
            }}
        >
            {showFilterActionButtons && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FilterActionButtons
                        hasFilters={hasFilters}
                        handleClearFilters={handleClearFilters || (() => {})}
                        hasSorting={hasSorting}
                        handleClearSorting={handleClearSorting}
                    />
                </Box>
            )}
            <StyledDataGridPro
                {...otherProps}
                sx={autoHeightSx}
                slotProps={mergedSlotProps}
                showCellVerticalBorder
                showColumnVerticalBorder
                sortModel={sortModel}
                onSortModelChange={externalOnSortModelChange || handleSortModelChange}
                filterModel={filterModel}
                onFilterModelChange={onFilterModelChange}
                filterMode={filterMode}
                paginationMode={paginationMode}
                pagination // Ensure pagination is enabled
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                rowCount={otherProps.rowCount || (otherProps.rows ? otherProps.rows.length : 0)}
                data-table-id={tableId}
            />

            {shouldShowPagination && (
                <CustomPagination
                    pageSize={paginationModel.pageSize}
                    rowCount={otherProps.rowCount || (otherProps.rows ? otherProps.rows.length : 0)}
                    page={paginationModel.page}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={
                        detachedPaginationOptions ||
                        (otherProps.pageSizeOptions && Array.isArray(otherProps.pageSizeOptions)
                            ? otherProps.pageSizeOptions.map((option) =>
                                  typeof option === 'object' ? option.value : option,
                              )
                            : [5, 10, 25, 50])
                    }
                    className="detached-pagination"
                    sx={paginationSx}
                    hideRowsPerPage={hideRowsPerPage || hidePagination}
                />
            )}
        </Box>
    );
});

export default TableComponent;
