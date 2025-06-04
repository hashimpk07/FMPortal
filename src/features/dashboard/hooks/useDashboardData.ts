import { useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import DashboardService from '../services/dashboardService';

/**
 * Custom hook to handle all dashboard data loading logic
 * Centralizes the data fetching that was previously scattered in the Dashboard component
 */
function useDashboardData() {
    const { selectedCentreId, startDate, endDate } = useDashboardStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const isInitialMount = useRef(true);
    const prevCentreId = useRef(selectedCentreId);
    const [centresLoaded, setCentresLoaded] = useState(false);

    // Load centres when hook is first used
    useEffect(() => {
        const loadCentres = async () => {
            try {
                await DashboardService.loadCentres();
                setCentresLoaded(true);
            } catch (error) {
                console.error('Error loading centres:', error);
                setIsError(true);
            }
        };

        loadCentres();
    }, []);

    // Load dashboard data when necessary conditions are met
    useEffect(() => {
        if (!centresLoaded) return;

        const loadData = async () => {
            try {
                setIsLoading(true);

                // If this is initial data load
                if (isInitialMount.current && startDate && endDate) {
                    await DashboardService.loadDashboardData();
                    isInitialMount.current = false;
                    setIsLoading(false);
                    return;
                }

                // If centre changed
                const centreIdChanged = prevCentreId.current !== selectedCentreId;
                prevCentreId.current = selectedCentreId;

                if (
                    !isInitialMount.current &&
                    centreIdChanged &&
                    selectedCentreId !== undefined &&
                    startDate &&
                    endDate
                ) {
                    await DashboardService.loadDashboardData();
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [selectedCentreId, startDate, endDate, centresLoaded]);

    return {
        isLoading,
        isError,
        refresh: async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                await DashboardService.loadDashboardData();
            } catch (error) {
                console.error('Error refreshing dashboard data:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        },
    };
}

export default useDashboardData;
