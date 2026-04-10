import { useState, useEffect, useCallback } from 'react';
import type { Trip } from '@/types';

const STORAGE_KEY = 'minhas-viagens-trips';

function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrips(trips: Trip[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips);

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  const addTrip = useCallback((trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTrip: Trip = {
      ...trip,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Trip>) => {
    setTrips(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      )
    );
  }, []);

  return { trips, addTrip, deleteTrip, updateTrip };
}
