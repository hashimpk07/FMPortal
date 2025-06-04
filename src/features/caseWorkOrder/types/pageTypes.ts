export interface MetaData {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}
export interface FilterData {
    id: string | number;
    label: string;
}

export interface CaseWorkOrderData {
    [key: string]: string | number;
}

export interface CaseWorkOrder {
    data: CaseWorkOrderData[];
    filters: {
        status: FilterData[];
        category: FilterData[];
        priority: FilterData[];
        store: FilterData[];
        owner: FilterData[];
    } | null;
    meta: MetaData | null;
    errors: string | null | undefined;
}

export interface StatusData {
    id: number;
    name: string;
}
export interface Status {
    data: StatusData[];
    errors?: string;
}

export interface CategoryData {
    id: number;
    name: string;
}
export interface Category {
    data: CategoryData[];
    errors?: string;
}

export interface OwnerData {
    id: number;
    name: string;
}
export interface Owner {
    data: OwnerData[];
    errors?: string;
}

export interface StoreData {
    id: number;
    name: string;
}
export interface Store {
    data: StoreData[];
    errors?: string;
}

export interface PriorityData {
    id: number;
    name: string;
}
export interface Priority {
    data: PriorityData[];
    errors?: string;
}

export interface StatusFilterData {
    id: number;
    name: string;
}

export interface StatusFilter {
    data: StatusFilterData[];
    errors?: string;
}
