import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants/api';
import { useAssetManagementStore } from '../../store/assetManagementStore';

/**
 * Utility function to generate a file checksum using SHA-1
 * @param file The file to generate a checksum for
 * @returns A promise resolving to the SHA-1 checksum as a hexadecimal string
 */
export async function generateFileChecksum(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            try {
                if (!e.target?.result) {
                    throw new Error('Failed to read file');
                }
                const arrayBuffer = e.target.result as ArrayBuffer;
                const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray
                    .map((byte) => byte.toString(16).padStart(2, '0'))
                    .join('');
                resolve(hashHex);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Interface for media upload request
 */
export interface MediaUploadRequest {
    file: File;
    name?: string;
    description?: string;
    centreId?: number;
}

/**
 * Interface for media upload response
 */
export interface MediaUploadResponse {
    data: {
        id: string;
        type: string;
        attributes: {
            name: string;
            description?: string;
            mediaType: string;
            url: string;
            createdAt: string;
            updatedAt: string;
        };
        relationships: {
            centre: {
                data: {
                    type: string;
                    id: string;
                };
            };
        };
    };
    included?: any[];
}

/**
 * Uploads an image file as a media asset
 * @param params The upload parameters including the file and optional metadata
 * @returns A promise resolving to the media upload response
 */
export async function uploadAssetMedia({
    file,
    name,
    description = '',
    centreId,
}: MediaUploadRequest): Promise<MediaUploadResponse> {
    // Get current centre ID from store if not provided
    const selectedCentreId = centreId || useAssetManagementStore.getState().selectedCentreId;

    if (!selectedCentreId) {
        throw new Error('No centre ID available for media upload');
    }

    // Convert file to base64
    const fileReader = new FileReader();
    const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
    });

    const fileContent = await fileContentPromise;
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Content = fileContent.split(',')[1];

    // Generate checksum for file
    const checksum = await generateFileChecksum(file);

    const payload = {
        data: {
            type: 'media',
            attributes: {
                name: name || file.name,
                description,
                mediaType: 'image',
                accessControl: 'private',
                content: base64Content,
                metadata: {
                    filename: file.name,
                    checksum,
                    filesize: file.size,
                    mediaType: file.type || 'application/octet-stream',
                },
            },
            relationships: {
                centre: {
                    data: {
                        type: 'centre',
                        id: selectedCentreId,
                    },
                },
            },
        },
    };

    try {
        const response = await HTTP({
            url: `${API_BASE_URL}/${API_VERSION}/media?include=centre`,
            method: 'POST',
            data: payload,
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading asset media:', error);
        throw error;
    }
}

/**
 * Deletes a media asset
 * @param mediaId The ID of the media to delete
 * @returns A promise resolving when the media is deleted
 */
export async function deleteAssetMedia(mediaId: string): Promise<void> {
    try {
        await HTTP({
            url: `${API_BASE_URL}/${API_VERSION}/media/${mediaId}`,
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting asset media:', error);
        throw error;
    }
}
