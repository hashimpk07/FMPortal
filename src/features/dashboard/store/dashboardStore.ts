/* eslint-disable no-param-reassign */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { ChartData, Centre, WorkOrderData, WorkOrderList } from '../types/dashboardTypes';

// Whether to enable devtools (should be true in dev, false in prod)
const ENABLE_DEVTOOLS = process.env.NODE_ENV === 'development';

/**
 * Dashboard state interface
 */
interface DashboardState {
    // Filters
    selectedCentreId?: number;
    startDate: Date | null;
    endDate: Date | null;

    // Loading states
    isLoadingCharts: boolean;
    isLoadingPriorityWorkOrders: boolean;
    isLoadingStatusWorkOrders: boolean;
    isLoadingWorkOrderLists: boolean;
    isLoadingCentres: boolean;

    // Data
    priorityWorkOrderData: WorkOrderData[];
    statusWorkOrderData: WorkOrderData[];
    casesCreatedData: ChartData | null;
    casesClosedData: ChartData | null;
    workOrdersCreatedData: ChartData | null;
    workOrdersData: ChartData | null;
    averageCaseCompletionTimeData: ChartData | null;
    averageWorkOrderCompletionTimeData: ChartData | null;
    workOrdersDueToday: WorkOrderList | null;
    workOrdersCompletedYesterday: WorkOrderList | null;
    centres: Centre[];

    // Metrics
    casesCreated: number;
    casesClosed: number;
    workOrdersCreated: number;
    workOrdersClosed: number;
    averageCaseCompletionTime: string;
    averageWorkOrderCompletionTime: string;

    // Actions
    setSelectedCentreId: (centreId?: number) => void;
    setDateRange: (startDate: Date | null, endDate: Date | null) => void;
    setLoadingCharts: (isLoading: boolean) => void;
    setLoadingPriorityWorkOrders: (isLoading: boolean) => void;
    setLoadingStatusWorkOrders: (isLoading: boolean) => void;
    setLoadingWorkOrderLists: (isLoading: boolean) => void;
    setLoadingCentres: (isLoading: boolean) => void;
    setPriorityWorkOrderData: (data: WorkOrderData[]) => void;
    setStatusWorkOrderData: (data: WorkOrderData[]) => void;
    setCasesCreatedData: (data: ChartData | null) => void;
    setCasesClosedData: (data: ChartData | null) => void;
    setWorkOrdersCreatedData: (data: ChartData | null) => void;
    setWorkOrdersData: (data: ChartData | null) => void;
    setAverageCaseCompletionTimeData: (data: ChartData | null) => void;
    setAverageWorkOrderCompletionTimeData: (data: ChartData | null) => void;
    setWorkOrdersDueToday: (data: WorkOrderList | null) => void;
    setWorkOrdersCompletedYesterday: (data: WorkOrderList | null) => void;
    setCentres: (data: Centre[]) => void;

    // Metrics actions
    setCasesCreated: (value: number) => void;
    setCasesClosed: (value: number) => void;
    setWorkOrdersCreated: (value: number) => void;
    setWorkOrdersClosed: (value: number) => void;
    setAverageCaseCompletionTime: (value: string) => void;
    setAverageWorkOrderCompletionTime: (value: string) => void;

    resetStore: () => void;
}

/**
 * Initial state values
 */
const initialState = {
    // Filters
    selectedCentreId: 0,
    startDate: null,
    endDate: null,

    // Loading states
    isLoadingCharts: false,
    isLoadingPriorityWorkOrders: false,
    isLoadingStatusWorkOrders: false,
    isLoadingWorkOrderLists: false,
    isLoadingCentres: false,

    // Data
    priorityWorkOrderData: [],
    statusWorkOrderData: [],
    casesCreatedData: null,
    casesClosedData: null,
    workOrdersCreatedData: null,
    workOrdersData: null,
    averageCaseCompletionTimeData: null,
    averageWorkOrderCompletionTimeData: null,
    workOrdersDueToday: null,
    workOrdersCompletedYesterday: null,
    centres: [],

    // Metrics
    casesCreated: 0,
    casesClosed: 0,
    workOrdersCreated: 0,
    workOrdersClosed: 0,
    averageCaseCompletionTime: '0 days',
    averageWorkOrderCompletionTime: '0 days',
};

/**
 * Dashboard store with devtools middleware
 */
const useDashboardStore = create<DashboardState>()(
    ENABLE_DEVTOOLS
        ? devtools(
              (set) => ({
                  ...initialState,

                  // Actions
                  setSelectedCentreId: (centreId?: number) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.selectedCentreId = centreId;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_SELECTED_CENTRE_ID', payload: centreId },
                      );
                  },

                  setDateRange: (startDate: Date | null, endDate: Date | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.startDate = startDate;
                              state.endDate = endDate;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_DATE_RANGE',
                              payload: { startDate, endDate },
                          },
                      );
                  },

                  setLoadingCharts: (isLoading: boolean) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.isLoadingCharts = isLoading;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_LOADING_CHARTS', payload: isLoading },
                      );
                  },

                  setLoadingPriorityWorkOrders: (isLoading: boolean) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.isLoadingPriorityWorkOrders = isLoading;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_LOADING_PRIORITY_WORK_ORDERS',
                              payload: isLoading,
                          },
                      );
                  },

                  setLoadingStatusWorkOrders: (isLoading: boolean) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.isLoadingStatusWorkOrders = isLoading;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_LOADING_STATUS_WORK_ORDERS',
                              payload: isLoading,
                          },
                      );
                  },

                  setLoadingWorkOrderLists: (isLoading: boolean) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.isLoadingWorkOrderLists = isLoading;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_LOADING_WORK_ORDER_LISTS',
                              payload: isLoading,
                          },
                      );
                  },

                  setLoadingCentres: (isLoading: boolean) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.isLoadingCentres = isLoading;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_LOADING_CENTRES', payload: isLoading },
                      );
                  },

                  setPriorityWorkOrderData: (data: WorkOrderData[]) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.priorityWorkOrderData = data;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_PRIORITY_WORK_ORDER_DATA',
                              payload: data,
                          },
                      );
                  },

                  setStatusWorkOrderData: (data: WorkOrderData[]) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.statusWorkOrderData = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_STATUS_WORK_ORDER_DATA', payload: data },
                      );
                  },

                  setCasesCreatedData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.casesCreatedData = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_CASES_CREATED_DATA', payload: data },
                      );
                  },

                  setCasesClosedData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.casesClosedData = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_CASES_CLOSED_DATA', payload: data },
                      );
                  },

                  setWorkOrdersCreatedData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersCreatedData = data;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_WORK_ORDERS_CREATED_DATA',
                              payload: data,
                          },
                      );
                  },

                  setWorkOrdersData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersData = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_WORK_ORDERS_DATA', payload: data },
                      );
                  },

                  setAverageCaseCompletionTimeData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.averageCaseCompletionTimeData = data;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_AVERAGE_CASE_COMPLETION_TIME_DATA',
                              payload: data,
                          },
                      );
                  },

                  setAverageWorkOrderCompletionTimeData: (data: ChartData | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.averageWorkOrderCompletionTimeData = data;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_AVERAGE_WORK_ORDER_COMPLETION_TIME_DATA',
                              payload: data,
                          },
                      );
                  },

                  setWorkOrdersDueToday: (data: WorkOrderList | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersDueToday = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_WORK_ORDERS_DUE_TODAY', payload: data },
                      );
                  },

                  setWorkOrdersCompletedYesterday: (data: WorkOrderList | null) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersCompletedYesterday = data;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_WORK_ORDERS_COMPLETED_YESTERDAY',
                              payload: data,
                          },
                      );
                  },

                  setCentres: (data: Centre[]) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.centres = data;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_CENTRES', payload: data },
                      );
                  },

                  // Metrics actions
                  setCasesCreated: (value: number) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.casesCreated = value;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_CASES_CREATED', payload: value },
                      );
                  },

                  setCasesClosed: (value: number) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.casesClosed = value;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_CASES_CLOSED', payload: value },
                      );
                  },

                  setWorkOrdersCreated: (value: number) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersCreated = value;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_WORK_ORDERS_CREATED', payload: value },
                      );
                  },

                  setWorkOrdersClosed: (value: number) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.workOrdersClosed = value;
                          }),
                          false,
                          { type: 'DASHBOARD/SET_WORK_ORDERS_CLOSED', payload: value },
                      );
                  },

                  setAverageCaseCompletionTime: (value: string) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.averageCaseCompletionTime = value;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_AVERAGE_CASE_COMPLETION_TIME',
                              payload: value,
                          },
                      );
                  },

                  setAverageWorkOrderCompletionTime: (value: string) => {
                      set(
                          produce<DashboardState>((state) => {
                              state.averageWorkOrderCompletionTime = value;
                          }),
                          false,
                          {
                              type: 'DASHBOARD/SET_AVERAGE_WORK_ORDER_COMPLETION_TIME',
                              payload: value,
                          },
                      );
                  },

                  resetStore: () => {
                      set(
                          produce<DashboardState>((state) => {
                              // Reset to initial state but keep filter values
                              const { selectedCentreId, startDate, endDate } = state;
                              Object.assign(state, {
                                  ...initialState,
                                  selectedCentreId,
                                  startDate,
                                  endDate,
                              });
                          }),
                          false,
                          { type: 'DASHBOARD/RESET_STORE' },
                      );
                  },
              }),
              { name: 'dashboard-store' },
          )
        : (set) => ({
              ...initialState,
              // Actions
              setSelectedCentreId: (centreId?: number) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.selectedCentreId = centreId;
                      }),
                  );
              },
              setDateRange: (startDate: Date | null, endDate: Date | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.startDate = startDate;
                          state.endDate = endDate;
                      }),
                  );
              },
              setLoadingCharts: (isLoading: boolean) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.isLoadingCharts = isLoading;
                      }),
                  );
              },
              setLoadingPriorityWorkOrders: (isLoading: boolean) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.isLoadingPriorityWorkOrders = isLoading;
                      }),
                  );
              },
              setLoadingStatusWorkOrders: (isLoading: boolean) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.isLoadingStatusWorkOrders = isLoading;
                      }),
                  );
              },
              setLoadingWorkOrderLists: (isLoading: boolean) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.isLoadingWorkOrderLists = isLoading;
                      }),
                  );
              },
              setLoadingCentres: (isLoading: boolean) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.isLoadingCentres = isLoading;
                      }),
                  );
              },
              setPriorityWorkOrderData: (data: WorkOrderData[]) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.priorityWorkOrderData = data;
                      }),
                  );
              },
              setStatusWorkOrderData: (data: WorkOrderData[]) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.statusWorkOrderData = data;
                      }),
                  );
              },
              setCasesCreatedData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.casesCreatedData = data;
                      }),
                  );
              },
              setCasesClosedData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.casesClosedData = data;
                      }),
                  );
              },
              setWorkOrdersCreatedData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersCreatedData = data;
                      }),
                  );
              },
              setWorkOrdersData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersData = data;
                      }),
                  );
              },
              setAverageCaseCompletionTimeData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.averageCaseCompletionTimeData = data;
                      }),
                  );
              },
              setAverageWorkOrderCompletionTimeData: (data: ChartData | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.averageWorkOrderCompletionTimeData = data;
                      }),
                  );
              },
              setWorkOrdersDueToday: (data: WorkOrderList | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersDueToday = data;
                      }),
                  );
              },
              setWorkOrdersCompletedYesterday: (data: WorkOrderList | null) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersCompletedYesterday = data;
                      }),
                  );
              },
              setCentres: (data: Centre[]) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.centres = data;
                      }),
                  );
              },
              // Add metrics actions to the non-devtools version
              setCasesCreated: (value: number) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.casesCreated = value;
                      }),
                  );
              },
              setCasesClosed: (value: number) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.casesClosed = value;
                      }),
                  );
              },
              setWorkOrdersCreated: (value: number) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersCreated = value;
                      }),
                  );
              },
              setWorkOrdersClosed: (value: number) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.workOrdersClosed = value;
                      }),
                  );
              },
              setAverageCaseCompletionTime: (value: string) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.averageCaseCompletionTime = value;
                      }),
                  );
              },
              setAverageWorkOrderCompletionTime: (value: string) => {
                  set(
                      produce<DashboardState>((state) => {
                          state.averageWorkOrderCompletionTime = value;
                      }),
                  );
              },
              resetStore: () => {
                  set(
                      produce<DashboardState>((state) => {
                          // Reset to initial state but keep filter values
                          const { selectedCentreId, startDate, endDate } = state;
                          Object.assign(state, {
                              ...initialState,
                              selectedCentreId,
                              startDate,
                              endDate,
                          });
                      }),
                  );
              },
          }),
);

export { useDashboardStore };
export default useDashboardStore;
