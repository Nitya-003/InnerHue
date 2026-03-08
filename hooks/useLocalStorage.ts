import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {

            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Handle storage event - both standard and custom events
    const handleStorageChange = useCallback((event: StorageEvent | CustomEvent) => {
        if ('detail' in event && event.detail) {
            // Custom event with detail containing key and value
            const { key: eventKey, value } = event.detail as { key: string; value: T };
            if (eventKey === key) {
                setStoredValue(value);
            }
        } else if (event instanceof StorageEvent && event.key === key) {
            // Standard storage event from other tabs/windows
            try {
                const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
                setStoredValue(newValue);
            } catch (error) {
                console.warn(`Error parsing storage event for key "${key}":`, error);
            }
        }
    }, [key, initialValue]);

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));

                // Dispatch a custom event with details so other components can update
                // Include key and value in the event detail for targeted updates
                window.dispatchEvent(new CustomEvent('local-storage-update', {
                    detail: { key, value: valueToStore }
                }));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        // Listen for custom events from other components using the same hook
        window.addEventListener('local-storage-update', handleStorageChange as EventListener);
        
        // Also listen for standard storage events (cross-tab synchronization)
        window.addEventListener('storage', handleStorageChange as EventListener);
        
        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('local-storage-update', handleStorageChange as EventListener);
            window.removeEventListener('storage', handleStorageChange as EventListener);
        };
    }, [handleStorageChange]);

    return [storedValue, setValue] as const;
}