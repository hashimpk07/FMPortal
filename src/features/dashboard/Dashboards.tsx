import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Grid from '@mui/material/Grid2';
import { Box, Typography, Alert } from '@mui/material';
import CentreSelector from './components/CentreSelector';
import DashboardOverview from './components/DashboardOverview';
import DashboardLoadingState from './components/DashboardLoadingState';
import WorkOrdersByCategory from './components/WorkOrdersByCategory';
import WorkOrdersLists from './components/WorkOrdersLists';
import useDashboardData from './hooks/useDashboardData';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8em;
    min-height: 100vh;
`;

function Dashboards() {
    const { t } = useTranslation();
    const { isLoading, isError, refresh } = useDashboardData();

    const pageTitle = useMemo(() => t('page-titles.dashboard', 'Dashboard'), [t]);

    // Handle retry
    const handleRetry = () => {
        refresh();
    };

    return (
        <StyledPage>
            <Box>
                {/* Header section with title and centre selector */}
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                >
                    <Grid>
                        <Typography variant="h1">{pageTitle}</Typography>
                    </Grid>
                    <Grid>
                        <CentreSelector />
                    </Grid>
                </Grid>

                {isError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 4 }}
                        action={
                            <Box
                                component="button"
                                sx={{
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    textDecoration: 'underline',
                                    color: 'inherit',
                                }}
                                onClick={handleRetry}
                            >
                                {t('common.retry', 'Retry')}
                            </Box>
                        }
                    >
                        {t(
                            'dashboard.load-error',
                            'Error loading dashboard data. Please try again.',
                        )}
                    </Alert>
                )}

                {isLoading ? (
                    <DashboardLoadingState />
                ) : (
                    <>
                        {/* Grid Container for Pie Charts */}
                        <Grid container spacing={6} sx={{ mb: 6 }}>
                            {/* Work Orders by Priority */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <WorkOrdersByCategory category="priority" />
                            </Grid>

                            {/* Work Orders by Status */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <WorkOrdersByCategory category="status" />
                            </Grid>
                        </Grid>

                        {/* Dashboard Overview Section */}
                        <DashboardOverview />

                        {/* Work Orders Lists */}
                        <WorkOrdersLists />
                    </>
                )}
            </Box>
        </StyledPage>
    );
}

export default Dashboards;
