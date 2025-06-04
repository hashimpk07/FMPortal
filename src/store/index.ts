import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const ENABLE_PERSISTENCE = true;

interface StoreProps {
    example: string;
    setExample: (example: string) => void;
}

const storeConfig: StateCreator<StoreProps> = (set) => ({
    example: 'Hello, World!',
    setExample: (example) => set({ example }),
});

const createStore = ENABLE_PERSISTENCE
    ? create(
          persist(storeConfig, {
              name: 'store',
              storage: createJSONStorage(() => sessionStorage),
          }),
      )
    : create(storeConfig);

export default createStore;
