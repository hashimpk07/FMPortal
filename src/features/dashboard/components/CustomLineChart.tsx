import React, { useRef, useState, useEffect } from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
    LinePlot,
    MarkPlot,
    lineElementClasses,
    markElementClasses,
} from '@mui/x-charts/LineChart';
import { DataPoint } from '../types/dashboardTypes';

type CurveType = 'linear' | 'monotoneX' | 'natural' | 'step' | 'stepBefore' | 'stepAfter';

interface CustomLineChartProps {
    data: number[] | DataPoint[];
    labels?: string[];
    width?: number;
    height?: number;
    strokeColor?: string;
    markColor?: string;
    showTooltip?: boolean;
    curve?: CurveType;
    title?: string;
    onClick?: () => void;
}

function CustomLineChart({
    data,
    labels = [],
    width = 0,
    height = 110,
    strokeColor = '#8884d8',
    markColor = '#8884d8',
    showTooltip = true,
    curve = 'monotoneX',
    title,
    onClick,
}: CustomLineChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState<number>(width);
    const [chartReady, setChartReady] = useState<boolean>(false);

    // Custom tooltip state
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState({ date: '', value: '' });
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Process the data based on its type
    const processedData = React.useMemo(() => {
        // If data is an array of numbers
        if (Array.isArray(data) && typeof data[0] === 'number') {
            const result = {
                values: data as number[],
                xLabels: labels,
                tooltipData: labels.map((label, index) => ({
                    date: label,
                    value: (data as number[])[index],
                })),
            };
            return result;
        }

        // If data is an array of DataPoint objects
        if (Array.isArray(data) && typeof data[0] === 'object') {
            const dataPoints = data as DataPoint[];
            const values = dataPoints.map((point) => point.value);
            const dateLabels = dataPoints.map((point) => {
                // Try to format the date if it's a valid date string
                try {
                    const date = new Date(point.date);
                    // Use locale-specific date format with numbers only (MM/DD/YYYY or DD/MM/YYYY)
                    return date.toLocaleDateString();
                } catch {
                    return point.date;
                }
            });

            const result = {
                values,
                xLabels: dateLabels,
                tooltipData: dataPoints,
            };
            return result;
        }

        // Default fallback for empty data
        return { values: [], xLabels: [], tooltipData: [] };
    }, [data, labels]);

    // Function to calculate and update chart width
    const updateWidth = () => {
        if (containerRef.current) {
            // Subtract padding to ensure it fits within container bounds
            const containerWidth = containerRef.current.clientWidth;
            setChartWidth(Math.max(containerWidth - 10, 50));
        }
    };

    // Initial setup and resize handling
    useEffect(() => {
        // Update width immediately and when window resizes
        updateWidth();
        setChartReady(true);

        const resizeObserver = new ResizeObserver(() => {
            updateWidth();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', updateWidth);

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    // Set up event handlers for custom tooltip
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !showTooltip) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Get container position
            const rect = container.getBoundingClientRect();

            // Calculate relative position within the chart
            const x = e.clientX - rect.left;

            // Determine which data point is closest
            const pointWidth = chartWidth / (processedData.values.length || 1);
            const index = Math.min(Math.floor(x / pointWidth), processedData.values.length - 1);

            if (index >= 0 && index < processedData.tooltipData.length) {
                const dataPoint = processedData.tooltipData[index];

                // Format the date
                let formattedDate = dataPoint.date;
                try {
                    const date = new Date(dataPoint.date);
                    if (!isNaN(date.getTime())) {
                        // Use locale-specific date format (numbers only)
                        formattedDate = date.toLocaleDateString();
                    }
                } catch {
                    // Keep original format
                }

                // Format the value
                let formattedValue: string | number = dataPoint.value;
                if (typeof formattedValue === 'number') {
                    formattedValue = formattedValue.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                    });
                }

                setTooltipContent({
                    date: formattedDate,
                    value: String(formattedValue),
                });
                setTooltipPosition({ x: e.clientX, y: e.clientY });
                setTooltipVisible(true);
            }
        };

        const handleMouseLeave = () => {
            setTooltipVisible(false);
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [processedData, chartWidth, showTooltip]);

    // Simplified valueFormatter that only shows the value
    const valueFormatter = (value: any) => {
        if (typeof value === 'number') {
            return value.toLocaleString('en-US', {
                maximumFractionDigits: 2,
            });
        }
        return value;
    };

    // Handle click
    const handleClick = () => {
        if (onClick) onClick();
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: `${height}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'hidden',
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default',
            }}
            onClick={handleClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `Open detailed ${title || 'chart'}` : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick();
                }
            }}
        >
            {chartReady && processedData.values.length > 0 && (
                <ChartContainer
                    width={chartWidth}
                    height={height}
                    series={[
                        {
                            type: 'line',
                            data: processedData.values,
                            label: 'Value',
                            showMark: true,
                            valueFormatter,
                            curve,
                        },
                    ]}
                    xAxis={[
                        {
                            scaleType: 'point',
                            data: processedData.xLabels,
                            id: 'x-axis-id',
                            tickLabelStyle: {
                                fontSize: 10,
                            },
                        },
                    ]}
                    margin={{
                        left: 5,
                        right: 5,
                        top: 5,
                        bottom: 20,
                    }}
                    sx={{
                        [`& .${lineElementClasses.root}`]: {
                            stroke: strokeColor,
                            strokeWidth: 2,
                        },
                        [`& .${markElementClasses.root}`]: {
                            stroke: markColor,
                            scale: '0.6',
                            fill: '#fff',
                            strokeWidth: 2,
                        },
                    }}
                >
                    <LinePlot />
                    <MarkPlot />
                </ChartContainer>
            )}

            {/* Custom tooltip */}
            {showTooltip && tooltipVisible && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x + 10,
                        top: tooltipPosition.y - 40,
                        backgroundColor: 'white',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.15)',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        zIndex: 9999,
                        pointerEvents: 'none',
                    }}
                >
                    <div>Date: {tooltipContent.date}</div>
                    <div>Value: {tooltipContent.value}</div>
                </div>
            )}
        </div>
    );
}

export default CustomLineChart;
