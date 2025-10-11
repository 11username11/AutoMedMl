import { GENDER, STATUS } from "@/lib/constants"
import { create } from "zustand"

export const FILTERS = [
  {
    key: "gender",
    label: "Gender",
    options: ["All genders", ...GENDER],
  },
  {
    key: "status",
    label: "Status",
    options: ["All statuses", ...STATUS],
  },
] as const

export type FilterKey = typeof FILTERS[number]["key"]

export type FilterFields = {
  [key in FilterKey]?: string
}

export interface FilterState {
  searchTerm: string,
  filters: FilterFields
}

export interface FilterStore extends FilterState {
  setSearchTerm: (searchTerm: string) => void,
  setFilters: (filter: Partial<FilterFields>) => void,
  reset: () => void
}

const defaultFilter: FilterState = {
  searchTerm: "",
  filters: {}
}

export const useFilter = create<FilterStore>((set) => ({
  ...defaultFilter,
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  reset: () => set({ ...defaultFilter })
}))