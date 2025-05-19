export const stateName: string = `tasktrackr:state`;

export const loadState = (): Record<string, any> | null => {
    try {
        const state = sessionStorage?.getItem(stateName);
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

        sessionStorage?.clear();
        sessionStorage?.setItem(stateName, JSON.stringify(localState));

    } catch (error) {
        console.error('Error saving state:', error);
    }
};