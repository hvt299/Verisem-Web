import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type HRViewMode = 'OWNER' | 'MEMBER';

interface HRViewState {
    hrViewMode: HRViewMode;
    setHrViewMode: (mode: HRViewMode) => void;
    toggleHrViewMode: () => void;
}

export const useHRViewStore = create<HRViewState>()(
    persist(
        (set) => ({
            hrViewMode: 'OWNER',

            setHrViewMode: (mode) => {
                set({ hrViewMode: mode });
            },

            toggleHrViewMode: () => {
                set((state) => ({
                    hrViewMode:
                        state.hrViewMode === 'OWNER'
                            ? 'MEMBER'
                            : 'OWNER',
                }));
            },
        }),
        {
            name: 'verisem_hr_view',
            storage: createJSONStorage(() => localStorage),
        }
    )
);