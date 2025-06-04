declare global {
    interface FilterData {
        id: string;
        label: string;
    }

    interface Filter {
        data: FilterData[];
        errors?: string;
    }
}
