export interface ErrorDetail {
    id: string;
    status: string;
    title: string;
    detail: string;
    source: {
        pointer: string;
    };
}
export interface ErrorResponse {
    errors: ErrorDetail[];
}
export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
export interface TransformedCentres {
    id: string;
    name: string;
}

export interface Centres {
    id: string;
    attributes: {
        name: string;
    };
}
export interface PropertyData {
    id: string;
    name: string;
}
export interface TransformedType {
    id: string;
    name: string;
}
export interface Type {
    id: string;
    attributes: {
        name: string;
    };
}
export interface DocumentTypeData {
    id: string;
    name: string;
}
export interface FileValidationFlags {
    type: boolean;
    size: boolean;
}

export interface UploadFileItem {
    file: File;
    preview: string;
    name?: string;
    description?: string;
    size?: string;
    type?: string;
    status?: string;
    isValid?: FileValidationFlags;
    sizeInBytes?: number;
    propertyId?: string;
    typeId?: string;
}

export type UploadFileList = UploadFileItem[];

export interface UploadInfo {
    status: string;
    ready: number;
    inComplete: number;
    all?: number;
}
