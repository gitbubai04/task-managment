import fileUpload from "express-fileupload";

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

export function validateFiles(files: fileUpload.FileArray | null | undefined, ...fileNames: string[]): boolean {
    if (!files) return false;
    for (const file of fileNames) {
        if (!files[file]) return false;
    }
    return true;
}
