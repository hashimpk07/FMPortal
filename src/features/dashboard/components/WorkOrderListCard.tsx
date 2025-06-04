import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Stack,
    Pagination,
    Button,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import { WorkOrderList as WorkOrderListType } from '../types/dashboardTypes';

interface WorkOrderListCardProps {
    data: WorkOrderListType;
}

export default function WorkOrderListCard({ data }: WorkOrderListCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 5;

    // Pagination state
    const [page, setPage] = useState(1);
    const [showAll, setShowAll] = useState(false);

    const totalPages = Math.ceil(data.workOrderData.length / ITEMS_PER_PAGE);

    // Get current page data
    const currentItems = showAll
        ? data.workOrderData
        : data.workOrderData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Handle pagination change
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Toggle between paginated and all items view
    const toggleView = () => {
        setShowAll(!showAll);
    };

    // Header with date information
    const headerAction = (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
                <CalendarToday fontSize="small" />
            </IconButton>
            <Typography variant="body2">{data.date}</Typography>
        </Box>
    );

    // Handle click on a work order to navigate and select it
    const handleWorkOrderClick = (orderId: string) => {
        // Navigate to the cases-and-work-orders page with the order ID
        navigate(`/cases-and-work-orders?id=${orderId}`);
    };

    return (
        <DashboardCard title={data.name} headerAction={headerAction} sx={{ height: '100%' }}>
            <Box sx={{ p: 1 }}>
                {currentItems.map((order) => (
                    <Card
                        key={order.id}
                        variant="outlined"
                        sx={{
                            borderRadius: 1,
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                            ':hover': {
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                backgroundColor: '#f9f9f9',
                            },
                            mb: 2,
                        }}
                        onClick={() => handleWorkOrderClick(order.id)}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
                            {/* Content */}
                            <Box sx={{ width: '100%' }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="600"
                                        fontSize="14px"
                                    >
                                        {order.title}
                                    </Typography>
                                    <Typography variant="body2" color="#666">
                                        {order.id}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%',
                                        my: 1,
                                        '&:hover': {
                                            whiteSpace: 'normal',
                                            overflow: 'visible',
                                            textOverflow: 'clip',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            borderRadius: 1,
                                            p: 0,
                                        },
                                    }}
                                >
                                    {order.description}
                                </Typography>

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Chip
                                        label={
                                            order.status === 1
                                                ? t('common.completed')
                                                : t('common.in-progress')
                                        }
                                        size="small"
                                        sx={{
                                            borderRadius: '4px',
                                            color: order.status === 1 ? '#4FBE86' : '#2E7DF7',
                                            backgroundColor:
                                                order.status === 1 ? '#EDFBF3' : '#ECF4FC',
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            height: '24px',
                                        }}
                                    />
                                    <Chip
                                        label={order.dueDate}
                                        size="small"
                                        sx={{
                                            borderRadius: '4px',
                                            backgroundColor: '#F5F5F5',
                                            color: '#666',
                                            fontWeight: 400,
                                            fontSize: '12px',
                                            height: '24px',
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {data.workOrderData.length > ITEMS_PER_PAGE && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                        }}
                    >
                        {!showAll && (
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                size="small"
                                color="primary"
                            />
                        )}
                        <Button size="small" onClick={toggleView} sx={{ ml: 'auto' }}>
                            {showAll ? t('common.show-paginated') : t('common.show-all')}
                        </Button>
                    </Box>
                )}
            </Box>
        </DashboardCard>
    );
}
