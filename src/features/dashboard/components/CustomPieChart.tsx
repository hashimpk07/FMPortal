import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { Box, Typography } from '@mui/material';

interface CustomPieChartProps {
    data: {
        label: string;
        value: number;
        id: number;
        color: string;
        status?: number;
        percentage?: number;
    }[];
    size?: { width: number; height: number };
    centerLabel?: React.ReactNode;
    additionalLabel?: string;
    itemsPerRow?: number;
}

const StyledText = styled('div')(({ theme }) => ({
    display: 'block',
    fontFamily: theme.typography.fontFamily,
    fontSize: '34px',
    fontWeight: '600',
    lineHeight: '38px',
    textAlign: 'center',
    cursor: 'default',
    transition: 'color 0.3s ease',
}));

const StyledSpan = styled('span')(({ theme }) => ({
    display: 'flex',
    width: '100px',
    fontFamily: theme.typography.fontFamily,
    fontSize: '14px',
    fontWeight: '400',
    textAlign: 'center',
    justifyContent: 'center',
    cursor: 'default',
    transition: 'color 0.3s ease',
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height } = useDrawingArea();
    const [firstLine, secondLine] = React.Children.toArray(children);

    const lineHeight = 15;
    const yOffset = height / 2;

    return (
        <>
            <foreignObject x={width / 2 - 45} y={yOffset - lineHeight / 0.3} width="90" height="60">
                <StyledText>
                    {typeof firstLine === 'string' && firstLine.length > 21
                        ? `${firstLine.slice(0, 21)}...`
                        : firstLine}
                </StyledText>
            </foreignObject>
            {secondLine && (
                <foreignObject x={width / 2 - 50} y={yOffset + 20} width="100" height="4rem">
                    <StyledSpan>{secondLine}</StyledSpan>
                </foreignObject>
            )}
        </>
    );
}

function CustomPieChart({
    data,
    centerLabel = 'Center Label',
    additionalLabel = '',
}: CustomPieChartProps) {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 700,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={3}
                sx={{ width: '100%' }}
            >
                {/* Pie Chart */}
                <Grid
                    size={{ xs: 12, sm: 6 }}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <PieChart
                        series={[
                            {
                                data: data,
                                innerRadius: '80%',
                                outerRadius: '100%',
                                paddingAngle: 1,
                                cornerRadius: 4,
                            },
                        ]}
                        slotProps={{
                            legend: {
                                hidden: true,
                            },
                        }}
                        width={320}
                        height={320}
                    >
                        {/* Center Label */}
                        <PieCenterLabel>
                            {centerLabel}
                            {additionalLabel ? additionalLabel : ''}
                        </PieCenterLabel>
                    </PieChart>
                </Grid>

                {/* Legend */}
                <Grid
                    size={{ xs: 12, sm: 6 }}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                        },
                        gridAutoRows: 'minmax(40px, auto)',
                        gap: 2,
                        width: '100%',
                        justifyContent: 'center',
                    }}
                >
                    {data.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                            }}
                        >
                            {/* Top row: Color box and label */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                }}
                            >
                                {/* Color Indicator */}
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: item.color,
                                    }}
                                />
                                {/* Label */}
                                <Typography
                                    variant="body2"
                                    fontWeight="normal"
                                    fontSize="13px"
                                    color="#666"
                                >
                                    {item.label}
                                </Typography>
                            </Box>

                            {/* Percentage row - aligned left */}
                            <Box
                                sx={{
                                    paddingLeft: 0,
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" fontSize="16px">
                                    {item.percentage}%
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
}

export default CustomPieChart;
