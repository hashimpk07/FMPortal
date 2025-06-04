import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TableSortingState {
    hasSorting: boolean;
    setHasSorting: (hasSorting: boolean) => void;
    clearSortingFlag: boolean;
    setClearSortingFlag: (flag: boolean) => void;
    tableSortingState: Record<string, boolean>;
    setTableSortingState: (tableId: string, hasSorting: boolean) => void;
    resetSortingForTable: (tableId: string) => void;
    resetAllSorting: () => void;
    clearAllTableSorting: () => void;
}

const useTableSortingStore = create<TableSortingState>()(
    devtools(
        (set) => ({
            hasSorting: false,
            setHasSorting: (hasSorting) => set({ hasSorting }),
            clearSortingFlag: false,
            setClearSortingFlag: (flag) => set({ clearSortingFlag: flag }),
            tableSortingState: {},
            setTableSortingState: (tableId, hasSorting) =>
                set((state) => {
                    const newTableState = {
                        ...state.tableSortingState,
                        [tableId]: hasSorting,
                    };
                    const anyTableHasSorting = Object.values(newTableState).some(Boolean);
                    return {
                        tableSortingState: newTableState,
                        hasSorting: anyTableHasSorting,
                    };
                }),
            resetSortingForTable: (tableId) =>
                set((state) => {
                    const newTableState = { ...state.tableSortingState };
                    delete newTableState[tableId];
                    const anyTableHasSorting = Object.values(newTableState).some(Boolean);
                    return {
                        tableSortingState: newTableState,
                        hasSorting: anyTableHasSorting,
                    };
                }),
            resetAllSorting: () => set({ tableSortingState: {}, hasSorting: false }),
            clearAllTableSorting: () =>
                set(() => {
                    setTimeout(() => {
                        useTableSortingStore.setState({
                            clearSortingFlag: false,
                        });
                    }, 100);
                    return {
                        clearSortingFlag: true,
                        tableSortingState: {},
                        hasSorting: false,
                    };
                }),
        }),
        { name: 'table-sorting-store' },
    ),
);

export default useTableSortingStore;
