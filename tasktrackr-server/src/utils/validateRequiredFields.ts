export const validateRequiredFields = (
    data: Record<string, any>,
    requiredFields: string[]
): string | null => {
    for (const field of requiredFields) {
        const value = data[field];
        if (typeof value !== 'string' || !value.trim()) {
            return field;
        }
    }
    return null;
};
