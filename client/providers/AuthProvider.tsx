'use client'
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { User } from '@/lib/types/user';

interface authState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

let authStore: StoreApi<authState> | null = null;

export const getAuthStore = () => {
  if (!authStore) {
    throw new Error('Auth store not initialized');
  }
  return authStore;
};

const createAuthStore = ({ user }: { user: User | null }) =>
  createStore<authState>((set) => ({
    user,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
  }));

const StoreContext = createContext<StoreApi<authState> | null>(null);

export const AuthProvider = ({ user, children }: { user: User | null; children: ReactNode }) => {
  const storeRef = useRef<StoreApi<authState> | null>(null);
  
  if (!authStore) {
    authStore = createAuthStore({ user: user ?? null });
  }
  storeRef.current = authStore;
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
};

export function useAuthStore<T>(
  selector: (state: authState) => T,
): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Missing StoreProvider');
  return useStore(store, selector);
}