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
export interface ContractorDatabaseData {
    name: string;
    companyName: string;
    description: string;
    phoneNumber: number;
    email: string;
    documentCount: number;
    invoiceCount: number;
    workOrderCount: number;
}
export interface ContractorDatabase {
    data: ContractorDatabaseData[];
    errors: string | null;
    meta: MetaData | null;
}

export interface InvoicesData {
    [key: string]: string | number;
}
export interface Invoices {
    data: InvoicesData[];
    errors?: string;
}

export interface PaymentInvoiceData {
    id: string;
    name: string;
}
export interface PaymentInvoice {
    data: PaymentInvoiceData[];
    errors?: string;
}

export interface ContractorData {
    id: number;
    name: string;
}
export interface Contractor {
    data: ContractorData[];
    errors?: string;
}

export interface StatusData {
    id: string;
    name: string;
}
export interface Status {
    data: StatusData[];
    errors?: string;
}

export interface DocumentsData {
    [key: string]: string | number | string[];
}
export interface Documents {
    data: DocumentsData[];
    errors?: string;
}

export interface PropertyData {
    [key: string]: string | number | any; // @TODO FIX THIS TYPING
}
export interface Property {
    data: PropertyData[];
    errors?: string;
}

export interface DocumentTypeData {
    [key: string]: string | number;
}

export interface DocumentType {
    data: DocumentTypeData[];
    errors?: string;
}

export interface CaseWorkOrderData {
    caseId: string;
    title: string;
    datacreated: string;
    property: string;
    owner: string;
    priority: string | null;
    status: string;
}
export interface CaseWorkOrder {
    data: CaseWorkOrderData[];
    errors: string | null;
    meta: MetaData | null;
}

export interface AssetManagemntData {
    [key: string]: string | number;
}
export interface AssetManagemnt {
    data: AssetManagemntData[];
    errors?: string;
}

export interface InvoicesData1 {
    id: string;
    lastmodified: string;
    status: string;
}
