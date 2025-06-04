import React, { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Grid,
    SxProps,
    Theme,
    Box,
    IconButton,
    Select,
    MenuItem,
    SelectChangeEvent,
    FormControl,
    TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface CustomPaginationProps {
    pageSize: number;
    rowCount: number;
    page: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    sx?: SxProps<Theme>;
    hideRowsPerPage?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    pageSize,
    rowCount,
    page,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 25, 50],
    className,
    sx,
    hideRowsPerPage = false,
}) => {
    const { t } = useTranslation();
    const [localPage, setLocalPage] = useState<string>((page + 1).toString());
    const [isDebouncing, setIsDebouncing] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Update local page when external page changes
    useEffect(() => {
        setLocalPage((page + 1).toString());
    }, [page]);

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        onPageSizeChange(Number(event.target.value));
    };

    const totalPages = Math.ceil(rowCount / pageSize) || 1;

    // Calculate the range of items being displayed
    const startItem = page * pageSize + 1;
    const endItem = Math.min((page + 1) * pageSize, rowCount);

    const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLocalPage(value);

        // Clear any existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set debouncing flag
        setIsDebouncing(true);

        // Set a new timer
        debounceTimer.current = setTimeout(() => {
            // Only process if value is a valid number
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 1 && numValue <= totalPages) {
                onPageChange(numValue - 1);
            } else {
                // Reset to current page if invalid
                setLocalPage((page + 1).toString());
            }
            setIsDebouncing(false);
        }, 500);
    };

    const handleNavigate = (newPage: number) => {
        // Skip if currently debouncing
        if (isDebouncing) return;

        onPageChange(newPage);
    };

    return (
        <Grid
            container
            sx={{
                px: 3,
                py: 2,
                mt: 2,
                border: '1px solid #e0e0e0',
                ...sx,
            }}
            className={className}
        >
            {/* Left side - Showing entries text */}
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {`Showing ${startItem}-${endItem} of ${rowCount}`}
                </Typography>
            </Grid>

            {/* Center - Navigation controls */}
            <Grid
                item
                xs={4}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleNavigate(Math.max(0, page - 1))}
                        disabled={page === 0 || isDebouncing}
                        sx={{ p: 0.5 }}
                    >
                        <NavigateBeforeIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ mx: 1, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            value={localPage}
                            onChange={handlePageInputChange}
                            size="small"
                            variant="outlined"
                            inputProps={{
                                min: 1,
                                max: totalPages,
                                style: {
                                    padding: '2px 4px',
                                    textAlign: 'center',
                                    width: '30px',
                                    fontSize: '0.875rem',
                                },
                            }}
                            sx={{
                                width: '40px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    },
                                },
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                            {t('common.of', 'of')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {totalPages}
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => handleNavigate(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1 || isDebouncing}
                        sx={{ p: 0.5 }}
                    >
                        <NavigateNextIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Grid>

            {/* Right side - Rows per page selector */}
            {!hideRowsPerPage && (
                <Grid
                    item
                    xs={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mr: 1, fontSize: '0.8rem' }}
                        >
                            {t('common.rowsPerPage', 'Rows per page:')}
                        </Typography>

                        <FormControl size="small" sx={{ minWidth: 65 }}>
                            <Select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                size="small"
                                variant="standard"
                                disableUnderline
                                sx={{ fontSize: '0.8rem' }}
                            >
                                {pageSizeOptions.map((size) => (
                                    <MenuItem key={size} value={size} sx={{ fontSize: '0.8rem' }}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
            )}

            {/* Empty space to balance layout when rows per page is hidden */}
            {hideRowsPerPage && (
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}></Grid>
            )}
        </Grid>
    );
};

export default CustomPagination;
