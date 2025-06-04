import React, { useEffect, useState, useMemo, useRef, forwardRef } from 'react';
import { Autocomplete, TextField, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { fetchAllContractorsManually } from '../services/contractorService';
import type { Contractor } from '../services/types';

interface ContractorOption {
    id: string;
    label: string;
    businessName: string;
    contractor: Contractor;
}

interface ContractorAutocompleteProps {
    value: { id: string; name: string } | null;
    onChange: (value: { id: string; name: string } | null) => void;
    required?: boolean;
    disabled?: boolean;
}

// Global cache for contractors requests
type ContractorCache = {
    [searchKey: string]: {
        data: ContractorOption[];
        timestamp: number;
    };
};
// Cache contractors data for 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;
const contractorsCache: ContractorCache = {};

// Virtualization components - based on MUI's example for virtualization
const LISTBOX_PADDING = 8; // px

const OuterElementContext = React.createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

// Improved renderRow function with proper key handling
function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;

    // Get the current item from data
    const item = data[index];

    // Apply padding to style
    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
    };

    // Just render the item directly with proper key
    return item
        ? React.cloneElement(item, {
              style: inlineStyle,
          })
        : null;
}

// Adapter for react-window with improved performance
const ListboxVirtualization = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxVirtualization(props, ref) {
        const { children, ...other } = props;
        const itemData: React.ReactElement[] = [];

        // Map children to item data
        React.Children.forEach(children, (child: React.ReactNode) => {
            if (React.isValidElement(child)) {
                itemData.push(child);
            }
        });

        const theme = useTheme();
        const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
        const itemSize = smUp ? 36 : 48;

        const height = Math.min(8 * itemSize, itemData.length * itemSize + 2 * LISTBOX_PADDING);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={height || 250} // Ensure a minimum height
                        width="100%"
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={() => itemSize}
                        overscanCount={5}
                        itemCount={itemData.length}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    },
);

// Helper function to sort contractors alphabetically by label
const sortContractorsByName = (contractors: ContractorOption[]): ContractorOption[] => {
    return [...contractors].sort((a, b) => {
        const labelA = a.label.toLowerCase();
        const labelB = b.label.toLowerCase();
        return labelA.localeCompare(labelB);
    });
};

function ContractorAutocomplete({
    value,
    onChange,
    required = false,
    disabled = false,
}: ContractorAutocompleteProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [options, setOptions] = useState<ContractorOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchComplete, setFetchComplete] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ContractorOption | null>(null);
    const [lastSearch, setLastSearch] = useState('');
    const abortControllerRef = useRef<AbortController | null>(null);

    // Check if data exists in cache
    const getFromCache = (searchValue: string): ContractorOption[] | null => {
        const cacheKey = searchValue.toLowerCase().trim();
        const cachedData = contractorsCache[cacheKey];

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return cachedData.data;
        }

        return null;
    };

    // Add data to cache
    const addToCache = (searchValue: string, data: ContractorOption[]) => {
        const cacheKey = searchValue.toLowerCase().trim();
        contractorsCache[cacheKey] = {
            data,
            timestamp: Date.now(),
        };
    };

    const fetchContractors = useMemo(
        () =>
            debounce(async (searchValue: string) => {
                // Don't fetch again if we just fetched this same search
                if (searchValue === lastSearch && fetchComplete && options.length > 0) {
                    return;
                }

                setLastSearch(searchValue);

                // Check cache first
                const cachedData = getFromCache(searchValue);
                if (cachedData) {
                    setOptions(cachedData);
                    setFetchComplete(true);
                    setLoading(false);
                    return;
                }

                // Cancel any in-flight request
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                // Create a new abort controller for this request
                abortControllerRef.current = new AbortController();

                // Start loading & reset fetch status
                setLoading(true);
                setFetchComplete(false);
                setOptions([]); // Clear options immediately when loading starts

                try {
                    // Use fetchAllContractorsManually to get all pages
                    const contractorsData = await fetchAllContractorsManually({
                        search: searchValue,
                        pageSize: 50,
                        signal: abortControllerRef.current.signal,
                    });

                    if (contractorsData && Array.isArray(contractorsData)) {
                        const formattedOptions = contractorsData.map((contractor) => {
                            // Handle API format
                            const businessName = contractor.attributes?.companyName || '';
                            const contactName = contractor.attributes?.name || '';

                            const label =
                                businessName && contactName
                                    ? `${businessName} (${contactName})`
                                    : businessName || contactName || contractor.id;

                            return {
                                id: contractor.id,
                                label,
                                businessName,
                                contractor,
                            };
                        });

                        // Sort the contractors alphabetically by label
                        const sortedOptions = sortContractorsByName(formattedOptions);

                        // Update options, mark fetch as complete, and cache the results
                        setOptions(sortedOptions);
                        addToCache(searchValue, sortedOptions);
                    }
                } catch (error: unknown) {
                    // Don't log error if it's just an abort
                    if (error instanceof Error && error.name !== 'AbortError') {
                        console.error('Error fetching contractors:', error);
                    }
                } finally {
                    // Always set fetch complete and turn off loading in finally block
                    setFetchComplete(true);
                    setLoading(false);
                }
            }, 300),
        [lastSearch, fetchComplete, options.length],
    );

    // Clean up abort controller on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Only fetch contractors when the dropdown is opened
    useEffect(() => {
        if (open) {
            fetchContractors(searchText);
        }

        return () => {
            fetchContractors.cancel();
        };
    }, [open, searchText, fetchContractors]);

    // Set selected option when value changes externally
    useEffect(() => {
        if (value && !selectedOption) {
            // If we have a value but no selected option, try to find it in options
            const matchingOption = options.find((option) => option.id === value.id);
            if (matchingOption) {
                setSelectedOption(matchingOption);
            } else if (value.id && value.name) {
                // If we can't find it in options but have id and name, create a temporary option
                setSelectedOption({
                    id: value.id,
                    label: value.name,
                    businessName: value.name,
                    contractor: {} as Contractor, // Empty contractor as placeholder
                });
            }
        } else if (!value) {
            setSelectedOption(null);
        }
    }, [value, options, selectedOption]);

    return (
        <Autocomplete
            id="contractor-autocomplete"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={(_, newValue) => {
                setSelectedOption(newValue);
                onChange(newValue ? { id: newValue.id, name: newValue.label } : null);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label || ''}
            options={fetchComplete ? options : []} // Only show options when fetch is complete
            loading={loading}
            value={selectedOption}
            onInputChange={(_, newInputValue) => {
                setSearchText(newInputValue);
            }}
            disabled={disabled}
            ListboxComponent={
                ListboxVirtualization as React.ComponentType<React.HTMLAttributes<HTMLElement>>
            }
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.label || 'Unnamed Contractor'}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('asset.contractor-responsible')}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            noOptionsText={
                loading
                    ? t('global.loading')
                    : searchText.length < 2
                      ? t('global.type_to_search')
                      : t('global.no_options')
            }
        />
    );
}

export default ContractorAutocomplete;
