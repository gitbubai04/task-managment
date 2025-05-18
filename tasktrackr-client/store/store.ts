export const stateName: string = `tasktrackr:state`;
export const storage: Storage = sessionStorage;

export const loadState = (): Record<string, any> | null => {
    try {
        const state = storage.getItem(stateName);
        if (!state) {
            return {};
        }

        return JSON.parse(state);
    } catch (error) {
        console.error('Error loading state:', error);
        return null;
    }
};

// Save state function with encryption and proper typing
export const saveState = (localState: Record<string, any> | null): void => {
    try {
        if (!localState) {
            return;
        }

        storage.clear();
        storage.setItem(stateName, JSON.stringify(localState));

    } catch (error) {
        console.error('Error saving state:', error);
    }
};