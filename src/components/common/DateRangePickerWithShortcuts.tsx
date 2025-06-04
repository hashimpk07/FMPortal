import { useMemo, useEffect, useCallback } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
    endOfDay,
    startOfDay,
    subDays,
    startOfMonth,
    endOfMonth,
    subMonths,
    isAfter,
} from 'date-fns';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Box } from '@mui/material';

export interface DateRangePickerWithShortcutsProps {
    startDate: Date | null;
    endDate: Date | null;
    format?: string;
    onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
    handleClear?: () => void;
    onAccept?: () => void;
    width?: string;
    clearable?: boolean;
    maxPastMonths?: number;
    skipAutoInit?: boolean;
    label?: string;
    resetToLastSevenDaysOnClear?: boolean;
    /**
     * If true, disables the minDate restriction (allows any date to be selected)
     */
    disableMinDateRestriction?: boolean;
}

// Helper function to get last 7 days date range
const getLast7DaysRange = (): [Date, Date] => {
    const today = new Date();
    const last7Days = subDays(today, 6);
    return [formatStartDate(startOfDay(last7Days)), formatEndDate(endOfDay(today))];
};

// Get last 6 months date range
const getLast6MonthsRange = (): [Date, Date] => {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 6);
    return [formatStartDate(startOfDay(sixMonthsAgo)), formatEndDate(endOfDay(today))];
};

// Helper to format start date with midnight time
const formatStartDate = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Ensure the date is formatted with T00:00:00.000000Z
    const isoString = d.toISOString().replace(/\.(\d{3})Z$/, '.000000Z');
    return new Date(isoString);
};

// Helper to format end date with end of day time
const formatEndDate = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 0);
    // Ensure the date is formatted with T23:59:59.000000Z
    const isoString = d.toISOString().replace(/\.(\d{3})Z$/, '.000000Z');
    return new Date(isoString);
};

function DateRangePickerWithShortcuts({
    startDate,
    endDate,
    format = 'dd/MM/yyyy',
    onDateRangeChange,
    handleClear,
    t,
    onAccept,
    width = '300px',
    clearable = false,
    maxPastMonths = 6,
    skipAutoInit = false,
    label,
    resetToLastSevenDaysOnClear = true,
    disableMinDateRestriction = false,
}: DateRangePickerWithShortcutsProps & WithTranslation) {
    // Calculate the minimum allowed date
    // If disableMinDateRestriction is true, allow any date
    const minDate = useMemo(() => {
        if (disableMinDateRestriction) return undefined;
        const date = subMonths(new Date(), maxPastMonths);
        return startOfDay(date); // Use startOfDay for rolling 6 months
    }, [maxPastMonths, disableMinDateRestriction]);

    // Calculate the maximum allowed date (today)
    const maxDate = useMemo(() => {
        return endOfDay(new Date());
    }, []);

    // Always initialize with last 7 days if no dates are provided,
    // but only trigger onDateRangeChange if skipAutoInit is false
    useEffect(() => {
        // Only auto-initialize if both startDate and endDate have never been set
        // This prevents overriding deliberately set null values
        if (!startDate && !endDate && !skipAutoInit) {
            const [newStartDate, newEndDate] = getLast7DaysRange();

            // Trigger the callback
            onDateRangeChange(newStartDate, newEndDate);

            // Also trigger onAccept to ensure data loads on initial mount
            if (onAccept) {
                onAccept();
            }
        }
    }, [startDate, endDate, onDateRangeChange, skipAutoInit, onAccept]);

    // Default handler for clear action if none provided
    const handleClearAction = useMemo(() => {
        if (handleClear) {
            return handleClear;
        }
        // When clear button is clicked, either reset to last 7 days or clear completely
        return () => {
            if (resetToLastSevenDaysOnClear) {
                const [newStartDate, newEndDate] = getLast7DaysRange();
                onDateRangeChange(newStartDate, newEndDate);
            } else {
                // Set both dates to null when cleared
                onDateRangeChange(null, null);
            }

            // Also trigger onAccept to ensure data is refreshed immediately
            if (onAccept) {
                onAccept();
            }
        };
    }, [handleClear, onDateRangeChange, onAccept, resetToLastSevenDaysOnClear]);

    // Handler specifically for the onClear event from the field
    const handleFieldClear = useCallback(() => {
        if (resetToLastSevenDaysOnClear) {
            // Reset to last 7 days when field is cleared
            const [newStartDate, newEndDate] = getLast7DaysRange();
            onDateRangeChange(newStartDate, newEndDate);
        } else {
            // Set both dates to null when field is cleared
            onDateRangeChange(null, null);
        }

        // Also trigger onAccept to ensure data is refreshed immediately
        if (onAccept) {
            onAccept();
        }
    }, [onDateRangeChange, onAccept, resetToLastSevenDaysOnClear]);

    // Function to handle date changes with proper formatting
    const handleDateChange = useCallback(
        (newValue: [Date | null, Date | null] | null) => {
            // Check if the input has been cleared
            if (
                !newValue ||
                (Array.isArray(newValue) && newValue[0] === null && newValue[1] === null)
            ) {
                if (resetToLastSevenDaysOnClear) {
                    // Input has been manually cleared - reset to last 7 days
                    const [newStartDate, newEndDate] = getLast7DaysRange();
                    onDateRangeChange(newStartDate, newEndDate);
                } else {
                    // Input has been manually cleared - set to null
                    onDateRangeChange(null, null);
                }

                if (onAccept) {
                    onAccept();
                }
                return;
            }

            // For shortcuts and when both dates are selected, we update immediately
            if (newValue[0] && newValue[1]) {
                // Format dates with proper time
                const formattedStart = formatStartDate(newValue[0]);
                const formattedEnd = formatEndDate(newValue[1]);

                onDateRangeChange(formattedStart, formattedEnd);

                // Also trigger onAccept so that data loads immediately
                if (onAccept) {
                    onAccept();
                }
            } else if (newValue[0]) {
                // Only start date is selected
                const formattedStart = formatStartDate(newValue[0]);
                // If end date exists, make sure start isn't after it
                if (endDate && isAfter(formattedStart, endDate)) {
                    // If start date is after end date, use start date for both
                    const formattedEnd = formatEndDate(newValue[0]);
                    onDateRangeChange(formattedStart, formattedEnd);
                } else {
                    onDateRangeChange(formattedStart, endDate);
                }
            } else if (newValue[1]) {
                // Only end date is selected
                const formattedEnd = formatEndDate(newValue[1]);
                // If start date exists, make sure end isn't before it
                if (startDate && isAfter(startDate, formattedEnd)) {
                    // If end date is before start date, use end date for both
                    const formattedStart = formatStartDate(newValue[1]);
                    onDateRangeChange(formattedStart, formattedEnd);
                } else {
                    onDateRangeChange(startDate, formattedEnd);
                }
            }
        },
        [onDateRangeChange, onAccept, resetToLastSevenDaysOnClear, startDate, endDate],
    );

    const dateRangePicker = useMemo(
        () => (
            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['DateRangePicker']}>
                        <DateRangePicker
                            value={[startDate, endDate]}
                            label={label}
                            onChange={handleDateChange}
                            onAccept={(newValue) => {
                                // Only trigger onAccept if both dates are selected
                                if (newValue && newValue[0] && newValue[1]) {
                                    const formattedStart = formatStartDate(newValue[0]);
                                    const formattedEnd = formatEndDate(newValue[1]);
                                    onDateRangeChange(formattedStart, formattedEnd);
                                    if (onAccept) {
                                        onAccept();
                                    }
                                }
                            }}
                            format={format}
                            minDate={minDate}
                            maxDate={maxDate}
                            slots={{ field: SingleInputDateRangeField }}
                            slotProps={{
                                field: {
                                    clearable: clearable,
                                    readOnly: false,
                                    onClear: handleFieldClear,
                                    sx: {
                                        width: width,
                                        '& .MuiInputBase-root': {
                                            width: '100%',
                                        },
                                    },
                                },
                                shortcuts: {
                                    items: [
                                        {
                                            label: t('common.date-range.shortcuts.today', 'Today'),
                                            getValue: () => {
                                                const today = new Date();
                                                return [
                                                    formatStartDate(startOfDay(today)),
                                                    formatEndDate(endOfDay(today)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.yesterday',
                                                'Yesterday',
                                            ),
                                            getValue: () => {
                                                const yesterday = subDays(new Date(), 1);
                                                return [
                                                    formatStartDate(startOfDay(yesterday)),
                                                    formatEndDate(endOfDay(yesterday)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.last-7-days',
                                                'Last 7 days',
                                            ),
                                            getValue: getLast7DaysRange,
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.last-30-days',
                                                'Last 30 days',
                                            ),
                                            getValue: () => {
                                                const today = new Date();
                                                const last30Days = subDays(today, 29);
                                                return [
                                                    formatStartDate(startOfDay(last30Days)),
                                                    formatEndDate(endOfDay(today)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.this-month',
                                                'This month',
                                            ),
                                            getValue: () => {
                                                const today = new Date();
                                                return [
                                                    formatStartDate(startOfMonth(today)),
                                                    formatEndDate(endOfDay(today)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.last-month',
                                                'Last month',
                                            ),
                                            getValue: () => {
                                                const lastMonth = subMonths(new Date(), 1);
                                                return [
                                                    formatStartDate(startOfMonth(lastMonth)),
                                                    formatEndDate(endOfMonth(lastMonth)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.last-3-months',
                                                'Last 3 months',
                                            ),
                                            getValue: () => {
                                                const today = new Date();
                                                const threeMonthsAgo = subMonths(today, 3);
                                                return [
                                                    formatStartDate(startOfMonth(threeMonthsAgo)),
                                                    formatEndDate(endOfDay(today)),
                                                ];
                                            },
                                        },
                                        {
                                            label: t(
                                                'common.date-range.shortcuts.last-6-months',
                                                'Last 6 months',
                                            ),
                                            getValue: getLast6MonthsRange,
                                        },
                                    ],
                                },
                                actionBar: {
                                    actions: ['clear', 'accept'],
                                    onClear: handleClearAction,
                                },
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </Box>
        ),
        [
            startDate,
            endDate,
            format,
            handleDateChange,
            handleClearAction,
            t,
            onAccept,
            minDate,
            maxDate,
            clearable,
            width,
            label,
            handleFieldClear,
            onDateRangeChange,
        ],
    );

    return dateRangePicker;
}

// Export with proper type annotation
const EnhancedDateRangePickerWithShortcuts = withTranslation()(
    DateRangePickerWithShortcuts,
) as React.ComponentType<DateRangePickerWithShortcutsProps>;

export default EnhancedDateRangePickerWithShortcuts;
