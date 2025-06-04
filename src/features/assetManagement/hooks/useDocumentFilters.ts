import { useMemo } from 'react';
import type { Document } from '../components/Modals/DocumentSelectionModal';

interface DocumentFilters {
    status?: string;
    contractor?: string;
    searchQuery: string;
}

function useDocumentFilters(documents: Document[], filters: DocumentFilters) {
    return useMemo(() => {
        return documents.filter((doc) => {
            const matchesSearch = doc.attributes.name
                .toLowerCase()
                .includes(filters.searchQuery.toLowerCase());
            const matchesStatus = !filters.status || doc.attributes.status === filters.status;
            const matchesContractor =
                !filters.contractor || doc.relationships.contractor?.data.id === filters.contractor;

            return matchesSearch && matchesStatus && matchesContractor;
        });
    }, [documents, filters]);
}

export default useDocumentFilters;
