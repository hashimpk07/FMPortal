export interface AssetTag {
    type: string;
    id: string;
    attributes: {
        name: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface AssetCentre {
    type: string;
    id: string;
    attributes: {
        uuid: string;
        name: string;
        language: string;
        locale: string;
        centreCode: string;
        phoneCode: number;
        createdAt: string;
        updatedAt: string;
    };
}

export interface AssetGroup {
    type: string;
    id: string;
    attributes: {
        name: string;
    };
}

export interface LocationOption {
    type: 'location-option';
    id: string;
    attributes: {
        label: string;
        value: string;
    };
}

export interface Location {
    type: 'location';
    id: string;
    attributes: {
        locationName: string;
        locationLabel: string;
        locationType: string;
        createdAt: string;
        updatedAt: string;
    };
    links: {
        self: string;
    };
    relationships: {
        centre: {
            data: {
                type: 'centre';
                id: number;
            };
        };
        'location-options'?: {
            data: Array<{
                type: 'location-option';
                id: string;
            }>;
        };
    };
}

export interface AssetsListResponse {
    data: Asset[];
    links: {
        first: string;
        last: string;
        next?: string;
        prev?: string;
        self: string;
    };
    meta: {
        page: {
            current: number;
            from: number;
            to: number;
            totalPages: number;
            size: number;
            total: number;
        };
        filters: any[];
    };
    included: Array<AssetTag | AssetCentre | AssetGroup>;
}

export interface FetchAssetsParams {
    centreId: string;
    assetGroupId?: string;
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    include?: string[];
    sort?: SortField[];
}

export interface AssetGroupDetailResponse {
    data: {
        type: 'asset-group';
        id: string;
        attributes: {
            name: string;
            depth: number;
        };
        links: {
            self: string;
        };
        relationships: {
            parent: {
                data: {
                    type: 'asset-group';
                    id: string;
                } | null;
            };
            children: {
                data: Array<{
                    type: 'asset-group';
                    id: string;
                }>;
            };
            centre: {
                data: {
                    type: 'centre';
                    id: string;
                };
            };
        };
    };
    included: Array<{
        type: 'centre';
        id: string;
        attributes: {
            language: string;
        };
    }>;
}

export interface FetchAssetGroupDetailsParams {
    include?: string[];
    centreId?: string;
    parentFields?: string[];
    assetFields?: string[];
    childrenFields?: string[];
    centreFields?: string[];
    assetGroupFields?: string[];
}

export interface Tag {
    type: 'simple-tag';
    id: string;
    attributes: {
        name: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface Document {
    type: 'document';
    id: string;
    attributes: {
        type: string;
        name: string;
        description: string | null;
        expiresAt: string | null;
        public: boolean;
        status: string;
        location: string;
        metadata: {
            filename: string;
            checksum: string;
            filesize: number;
            mediaType: string;
        };
        createdAt: string;
        updatedAt: string;
    };
    links: {
        self: string;
    };
    relationships: {
        centre: {
            data: {
                type: string;
                id: number;
            };
        };
        tags?: Array<{
            data: {
                type: string;
                id: string;
            };
        }>;
    };
}

export interface TagsResponse {
    data: Tag[];
    meta: {
        count: number;
    };
}

export interface DocumentsResponse {
    data: Document[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        count: number;
    };
}

export interface LocationsResponse {
    data: Location[];
    links: {
        first: string;
        last: string;
        next?: string;
        prev?: string;
        self: string;
    };
    meta: {
        page: {
            current: number;
            from: number;
            to: number;
            totalPages: number;
            size: number;
            total: number;
        };
        filters: any[];
    };
    included: Array<LocationOption>;
}

export type AssetStatus = 'operational' | 'pending_repair' | 'missing' | 'out_of_service';

export interface Asset {
    type: string;
    id: string;
    attributes: {
        name: string;
        description: string | null;
        serialNumber: string;
        purchaseCost: string | null;
        estimatedValue: string | null;
        depreciationRate: number | null;
        warrantyExpiresAt: string | null;
        estimatedLifetime: number | null;
        status: AssetStatus;
        updatedAt: string;
        imageUrl?: string | null;
        mediaId?: string | null;
        imageFile?: File | null;
        qrCode?: string | null;
        locations?: Array<{
            locationType: string;
            locationValue: string;
        }>;
        contractor?: {
            name: string;
            id: string;
        } | null;
        tags?: string[];
        documents?: string[];
        invoices?: string[];
    };
    links: {
        self: string;
        'status-summary': string;
        'operational-summary': string;
    };
    relationships: {
        tags: {
            data: Array<{ type: string; id: string }>;
        };
        centre: {
            data: { type: string; id: string };
        };
        assetGroup?: {
            data: { type: string; id: string } | null;
        };
    };
    centre?: AssetCentre;
    tags?: AssetTag[];
    assetGroup?: AssetGroup;
}

export interface AssetDetailResponse {
    data: Asset;
    included: Array<AssetTag | AssetCentre | AssetGroup>;
}

export interface TimeBreakdown {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    percentage: number;
}

export interface AssetOperationalSummary {
    type: string;
    id: string;
    attributes: {
        operational: TimeBreakdown;
        non_operational: TimeBreakdown;
        total_days: number;
    };
    links: {
        self: string;
        asset: string;
        detailed: string;
    };
}

export interface AssetOperationalSummaryResponse {
    data: AssetOperationalSummary;
}

export interface SortField {
    field: string;
    direction: 'asc' | 'desc';
}

/**
 * Enriched Asset type with additional properties from included relationships
 */
export interface EnrichedAsset extends Asset {
    assetGroupDetails?: any;
    qrCodeUrl?: string | null;
    tags?: any[];
}

export interface Contractor {
    type: 'contractor';
    id: string;
    attributes: {
        name: string;
        avatar: string;
        companyName: string;
        description: string;
        phoneNumber: string;
        email: string;
        documents: number;
        invoices: number | null;
        workOrders: number;

        // Keep these fields for backward compatibility, but they might not be present
        contact?: {
            phoneNumber: string | null;
            faxNumber: string | null;
            emailAddress: string | null;
        };
        primaryContact?: {
            title: string | null;
            firstName: string | null;
            lastName: string | null;
            phoneNumber: string | null;
            faxNumber: string | null;
            emailAddress: string | null;
        };
        website?: string | null;
        status?: string;
        rate?: {
            rate: number | null;
            type: string | null;
            minimumCallout: number | null;
        };
        workHours?: Record<string, { start: string | null; end: string | null }>;
        multiSite?: boolean;
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string | null;
    };
    relationships?: {
        business?: {
            data: {
                type: 'business';
                id: string;
            };
        };
        centre?: {
            data: {
                type: 'centre';
                id: number;
            };
        };
    };
    includes?: {
        centre?: {
            data: {
                type: 'centre';
                id: number;
                attributes: {
                    name: string;
                    language: string;
                    locale: string;
                    logoUrl: string;
                };
            };
        };
        business?: {
            data: {
                type: 'business';
                id: string;
                attributes: {
                    name: string;
                    description: string;
                    taxId: string;
                    companyRegistration: string;
                    createdAt: string;
                    updatedAt: string;
                };
            };
        };
    };
    // We don't need these properties anymore as data is directly in attributes
    business?: {
        type: 'business';
        id: string;
        attributes: {
            name: string;
            description: string;
            taxId: string;
            companyRegistration: string;
            createdAt: string;
            updatedAt: string;
        };
    };
    centre?: {
        type: 'centre';
        id: number;
        attributes: {
            name: string;
            language: string;
            locale: string;
            logoUrl: string;
        };
    };
}

export interface ContractorListResponse {
    data: Contractor[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface AssetApiPayload {
    data: {
        type: string;
        id: string;
        attributes: Record<string, unknown>;
        relationships: Record<string, unknown>;
    };
}
