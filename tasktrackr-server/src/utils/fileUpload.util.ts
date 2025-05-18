import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ApiError } from './error.util';
import fs from 'fs';
import { HTTP_STATUSCODE } from '../constant/http.constant';

export const uploadImage = async (imageFile: UploadedFile, fileName: string): Promise<string> => {
    try {
        const imagesFolderPath = path.join(__dirname, "..", 'public', 'images');
        if (!existsSync(imagesFolderPath)) {
            mkdirSync(imagesFolderPath, { recursive: true });
            console.log('Images folder created successfully!');
        }
        const destinationFile = path.join(__dirname, "..", "public", "images", fileName + '.' + imageFile.mimetype.split("/")[1]);
        await imageFile.mv(destinationFile);
        return process.env.HOST_URL + '/images/' + fileName + '.' + imageFile.mimetype.split("/")[1];
    } catch (error) {
        console.error(error);
        throw new ApiError(HTTP_STATUSCODE.OPERATION_FAIL, "Failed to upload image");
    }
}

export const deleteImage = async (url: string) => {
    try {
        const splits = url.split('/');
        const img = splits[splits.length - 1];
        fs.unlinkSync(path.join(__dirname, "..", "public", "images", img))
    } catch (error) {
        console.error(error);
    }
}

export const deleteAndUploadImage = async (imageFile: UploadedFile, fileName: string, prevUrl?: string | null): Promise<string> => {
    if (!!prevUrl) await deleteImage(prevUrl);
    return uploadImage(imageFile, fileName);
}