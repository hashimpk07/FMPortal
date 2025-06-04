import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import GridOnIcon from '@mui/icons-material/GridOn';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
    LinePlot,
    MarkPlot,
    lineElementClasses,
    markElementClasses,
} from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { LineSeriesType } from '@mui/x-charts/models';
import { Duration } from 'luxon';
import { CircularProgress, Typography } from '@mui/material';
import { DataPoint } from '../types/dashboardTypes';

// Define metric types for better type safety and identification
export type MetricType =
    | 'casesCreated'
    | 'casesClosed'
    | 'workOrdersCreated'
    | 'workOrdersClosed'
    | 'averageCaseCompletionTime'
    | 'averageWorkOrderCompletionTime'
    | 'other';

// Time-based metric types for direct checking
const TIME_BASED_METRICS: MetricType[] = [
    'averageCaseCompletionTime',
    'averageWorkOrderCompletionTime',
];

interface DetailedChartModalProps {
    open: boolean;
    onClose: () => void;
    data: number[] | DataPoint[] | { date: string | Date; value: number }[];
    labels?: string[];
    title?: string;
    strokeColor?: string;
    isTimeData?: boolean; // Flag to indicate if the data represents time (seconds)
    valueLabel?: string; // Label for the Y-axis
    metricType?: MetricType; // New prop to identify the metric type directly
}

// Chart color constants
const CHART_COLORS = {
    green: '#4FBE86',
    red: '#E8575F',
    default: '#3F51B5',
};

// Seconds in a day for conversions
const SECONDS_PER_DAY = 86400;

/**
 * Convert seconds to days for chart display
 * @param seconds Number of seconds
 * @returns Number of days (as a float)
 */
function secondsToDays(seconds: number): number {
    if (seconds === 0) return 0;
    return seconds / SECONDS_PER_DAY;
}

/**
 * Format time value from seconds using Luxon Duration
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
function formatTimeFromSeconds(seconds: number): string {
    if (seconds === 0) return '0 sec';

    // Create a duration object from seconds
    const duration = Duration.fromObject({ seconds });

    // Format based on magnitude
    if (seconds < 60) {
        // Less than a minute: show seconds
        return `${seconds.toFixed(1)} sec`;
    }
    if (seconds < 3600) {
        // Less than an hour: show minutes and seconds
        return duration.toFormat("m'm' s's'");
    }
    if (seconds < SECONDS_PER_DAY) {
        // Less than a day: show hours and minutes
        return duration.toFormat("h'h' m'm'");
    }
    // More than a day: show days and hours
    return duration.toFormat("d'd' h'h'");
}

function DetailedChartModal({
    open,
    onClose,
    data,
    labels = [],
    title,
    strokeColor,
    isTimeData = false,
    valueLabel = 'Cases',
    metricType = 'other',
}: DetailedChartModalProps) {
    // State
    const [showGrid, setShowGrid] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [showChart, setShowChart] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine if this is time data from the metric type
    const isTimeMetric = TIME_BASED_METRICS.includes(metricType) || isTimeData;

    // Chart color
    const chartColor = strokeColor || CHART_COLORS.default;

    // Delay chart rendering until after modal animation
    useEffect(() => {
        if (open) {
            // Modal transition typically takes about 300ms
            const timer = setTimeout(() => {
                setShowChart(true);
            }, 350);

            return () => clearTimeout(timer);
        }
        setShowChart(false);
    }, [open]);

    // Format functions
    const formatDate = (date: Date | string) => {
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            return isNaN(parsedDate.getTime()) ? date : parsedDate.toLocaleDateString();
        }
        return date instanceof Date ? date.toLocaleDateString() : date;
    };

    const formatValue = (value: number | null) => {
        if (value === null) return 'N/A';

        if (isTimeMetric) {
            // For tooltip display - convert days back to seconds for human-readable time
            const seconds = value * SECONDS_PER_DAY;
            return formatTimeFromSeconds(seconds);
        }

        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    // Process chart data
    const processedData = React.useMemo(() => {
        // Empty data check
        if (!data || data.length === 0)
            return {
                xAxis: [],
                values: [],
                dates: [],
                minValue: 0,
                maxValue: 0,
            };

        let values: number[] = [];
        let dates: (Date | string)[] = [];

        // Convert data to a standardized format
        if (typeof data[0] === 'number') {
            // For time data, convert seconds to days for Y-axis
            values = isTimeMetric
                ? (data as number[]).map((seconds) => secondsToDays(seconds))
                : (data as number[]);

            // Create dates from labels or use default index dates
            dates = labels.map((label) => {
                try {
                    const parsedDate = new Date(label);
                    return isNaN(parsedDate.getTime()) ? label : parsedDate;
                } catch {
                    return label;
                }
            });

            // If labels are not provided or insufficient, use sequential dates
            if (dates.length < values.length) {
                const startDate = new Date();
                dates = values.map((_, i) => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() - (values.length - i - 1));
                    return date;
                });
            }
        } else {
            // Data is an array of objects with date and value
            const dataPoints = data as Array<DataPoint | { date: string | Date; value: number }>;

            // For time data, convert seconds to days for Y-axis
            values = isTimeMetric
                ? dataPoints.map((point) => secondsToDays(point.value))
                : dataPoints.map((point) => point.value);

            dates = dataPoints.map((point) => {
                if (typeof point.date === 'string') {
                    try {
                        const parsedDate = new Date(point.date);
                        return isNaN(parsedDate.getTime()) ? point.date : parsedDate;
                    } catch {
                        return point.date;
                    }
                }
                return point.date;
            });
        }

        // Ensure values and dates arrays have the same length
        const length = Math.min(values.length, dates.length);
        values = values.slice(0, length);
        dates = dates.slice(0, length);

        // Convert all dates to Date objects if possible for sorting
        const dataPoints = dates.map((date, i) => {
            let dateObj: Date | string;
            if (typeof date === 'string') {
                try {
                    const parsedDate = new Date(date);
                    dateObj = isNaN(parsedDate.getTime()) ? date : parsedDate;
                } catch {
                    dateObj = date;
                }
            } else {
                dateObj = date;
            }
            return { date: dateObj, value: values[i] };
        });

        // Sort data points by date if possible
        dataPoints.sort((a, b) => {
            if (a.date instanceof Date && b.date instanceof Date) {
                return a.date.getTime() - b.date.getTime();
            }
            // If not dates, try to compare as strings
            return a.date.toString().localeCompare(b.date.toString());
        });

        // Extract sorted values and dates
        const sortedValues = dataPoints.map((point) => point.value);
        const sortedDates = dataPoints.map((point) => point.date);

        // Calculate min/max values for Y-axis scaling
        const minValue = Math.min(...sortedValues);
        const maxValue = Math.max(...sortedValues);

        // Format dates for x-axis
        const xAxis = sortedDates.map((date) => formatDate(date));

        return {
            xAxis,
            values: sortedValues,
            dates: sortedDates,
            minValue,
            maxValue,
        };
    }, [data, labels, isTimeMetric]);

    // Handle resize and chart dimensions
    useEffect(() => {
        if (!open) return;

        const handleResize = () => {
            if (containerRef.current) {
                const contentElement = containerRef.current;
                if (contentElement) {
                    setDimensions({
                        width: contentElement.clientWidth - 32, // Account for padding
                        height: Math.max(400, Math.min(600, window.innerHeight * 0.6)),
                    });
                }
            }
        };

        // Initial size calculation
        handleResize();

        // Setup resize observer
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Setup window resize listener as backup
        window.addEventListener('resize', handleResize);

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [open]);

    // Prepare chart series
    const series: LineSeriesType[] = [
        {
            type: 'line',
            data: processedData.values,
            label: valueLabel,
            showMark: true,
            curve: 'monotoneX',
            valueFormatter: formatValue,
        },
    ];

    // Handle grid toggle
    const handleGridToggle = (_event: React.MouseEvent<HTMLElement>, newOptions: string[]) => {
        setShowGrid(newOptions.includes('grid'));
    };

    // If modal is closed, don't render
    if (!open) return null;

    // After processedData is calculated, determine the appropriate time unit label
    // Y-axis label should reflect the appropriate time unit for time data
    let yAxisLabel = valueLabel;

    if (isTimeMetric) {
        // Find the maximum time value to determine the appropriate unit
        const maxSeconds = Math.max(...processedData.values) * SECONDS_PER_DAY;

        if (maxSeconds === 0) {
            yAxisLabel = 'Time (seconds)';
        } else if (maxSeconds < 60) {
            yAxisLabel = 'Time (seconds)';
        } else if (maxSeconds < 3600) {
            yAxisLabel = 'Time (minutes)';
        } else if (maxSeconds < SECONDS_PER_DAY) {
            yAxisLabel = 'Time (hours)';
        } else {
            yAxisLabel = 'Time (days)';
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    padding: 3,
                }}
            >
                <span style={{ fontSize: '1.3rem', fontWeight: 500 }}>
                    {title || 'Detailed Chart'}
                </span>
                <IconButton aria-label="close" onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Box
                sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <ToggleButtonGroup
                    size="small"
                    value={showGrid ? ['grid'] : []}
                    onChange={handleGridToggle}
                    aria-label="chart options"
                >
                    <ToggleButton value="grid" aria-label="show grid">
                        <Tooltip title="Toggle Grid Lines">
                            <GridOnIcon fontSize="small" />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <DialogContent sx={{ p: 2, height: dimensions.height }} ref={containerRef}>
                {processedData.values.length > 0 ? (
                    showChart ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <ChartContainer
                                width={dimensions.width}
                                height={dimensions.height}
                                series={series}
                                xAxis={[
                                    {
                                        scaleType: 'point',
                                        data: processedData.xAxis,
                                        tickLabelStyle: {
                                            fontSize: 12,
                                            angle: 45,
                                            textAnchor: 'start',
                                        },
                                        valueFormatter: (value) => value.toString(),
                                    },
                                ]}
                                yAxis={[
                                    {
                                        min: processedData.minValue < 0 ? undefined : 0,
                                        tickNumber: 5,
                                        valueFormatter: isTimeMetric
                                            ? (value) => {
                                                  const seconds = Number(value) * SECONDS_PER_DAY;
                                                  if (seconds === 0) return '0';

                                                  // Match the formatter units with the y-axis label
                                                  if (yAxisLabel === 'Time (seconds)') {
                                                      return `${seconds.toFixed(1)}s`;
                                                  }
                                                  if (yAxisLabel === 'Time (minutes)') {
                                                      return `${(seconds / 60).toFixed(1)}m`;
                                                  }
                                                  if (yAxisLabel === 'Time (hours)') {
                                                      return `${(seconds / 3600).toFixed(1)}h`;
                                                  }
                                                  return `${value.toFixed(1)}d`;
                                              }
                                            : (value) => value.toFixed(1),
                                    },
                                ]}
                                margin={{
                                    left: 70,
                                    right: 50,
                                    top: 30,
                                    bottom: 100, // Increased from 90 to 100 to fix the date cutoff issue
                                }}
                                sx={{
                                    [`& .${lineElementClasses.root}`]: {
                                        stroke: chartColor,
                                        strokeWidth: 2,
                                    },
                                    [`& .${markElementClasses.root}`]: {
                                        stroke: chartColor,
                                        fill: '#fff',
                                        strokeWidth: 2,
                                    },
                                    [`& .${axisClasses.left} .${axisClasses.label}`]: {
                                        transform: 'translateX(-20px)',
                                    },
                                    [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                                        transform: 'translateY(20px)',
                                    },
                                }}
                            >
                                {showGrid && <ChartsGrid vertical horizontal />}
                                <LinePlot />
                                <MarkPlot />
                                <ChartsTooltip trigger="item" />
                                <ChartsXAxis label="Date" position="bottom" />
                                <ChartsYAxis label={yAxisLabel} position="left" />
                            </ChartContainer>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666',
                            }}
                        >
                            <CircularProgress size={40} sx={{ mb: 2, color: chartColor }} />
                            <Typography variant="body2">Preparing chart...</Typography>
                        </Box>
                    )
                ) : (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                        }}
                    >
                        No data available
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default DetailedChartModal;
