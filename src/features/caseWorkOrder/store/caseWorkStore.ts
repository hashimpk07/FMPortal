import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const ENABLE_PERSISTENCE = false;

interface FilterData {
    id: string;
    label: string;
}

interface StoreProps {
    statusFilterOptions: FilterData[];
    setStatusFilterOptions: (statusFilterOptions: FilterData[]) => void;
    selectedStatus: { id: string; label: string } | null;
    setSelectedStatus: (selectedStatus: { id: string; label: string } | null) => void;

    categoryFilterOptions: FilterData[];
    setCategoryFilterOptions: (categoryFilterOptions: FilterData[]) => void;
    selectedCategory: { id: string; label: string } | null;
    setSelectedCategory: (selectedCategory: { id: string; label: string } | null) => void;

    storeFilterOptions: FilterData[];
    setStoreFilterOptions: (storeFilterOptions: FilterData[]) => void;
    selectedStore: { id: string; label: string } | null;
    setSelectedStore: (selectedStore: { id: string; label: string } | null) => void;

    ownerFilterOptions: FilterData[];
    setOwnerFilterOptions: (ownerFilterOptions: FilterData[]) => void;
    selectedOwner: { id: string; label: string } | null;
    setSelectedOwner: (selectedStore: { id: string; label: string } | null) => void;

    priorityFilterOptions: FilterData[];
    setPriorityFilterOptions: (priorityFilterOptions: FilterData[]) => void;
    selectedPriority: { id: string; label: string } | null;
    setSelectedPriority: (selectedSPriority: { id: string; label: string } | null) => void;
}

const storeConfig: StateCreator<StoreProps> = (set) => ({
    statusFilterOptions: [],
    setStatusFilterOptions: (statusFilterOptions: FilterData[]) => set({ statusFilterOptions }),
    selectedStatus: null,
    setSelectedStatus: (selectedStatus: { id: string; label: string } | null) =>
        set({ selectedStatus }),

    categoryFilterOptions: [],
    setCategoryFilterOptions: (categoryFilterOptions: FilterData[]) =>
        set({ categoryFilterOptions }),
    selectedCategory: null,
    setSelectedCategory: (selectedCategory: { id: string; label: string } | null) =>
        set({ selectedCategory }),

    storeFilterOptions: [],
    setStoreFilterOptions: (storeFilterOptions: FilterData[]) => set({ storeFilterOptions }),
    selectedStore: null,
    setSelectedStore: (selectedStore: { id: string; label: string } | null) =>
        set({ selectedStore }),

    ownerFilterOptions: [],
    setOwnerFilterOptions: (ownerFilterOptions: FilterData[]) => set({ ownerFilterOptions }),
    selectedOwner: null,
    setSelectedOwner: (selectedOwner: { id: string; label: string } | null) =>
        set({ selectedOwner }),

    priorityFilterOptions: [],
    setPriorityFilterOptions: (priorityFilterOptions: FilterData[]) =>
        set({ priorityFilterOptions }),
    selectedPriority: null,
    setSelectedPriority: (selectedPriority: { id: string; label: string } | null) =>
        set({ selectedPriority }),
});

const createStore = ENABLE_PERSISTENCE
    ? create(
          persist(storeConfig, {
              name: 'caseWorkStore',
              storage: createJSONStorage(() => sessionStorage),
          }),
      )
    : create(storeConfig);

export default createStore;
