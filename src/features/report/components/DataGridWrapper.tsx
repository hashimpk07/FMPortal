import { useRef, useMemo, useState, useCallback } from 'react';
import { DataGridPro, type GridSlotProps, type DataGridProProps } from '@mui/x-data-grid-pro';
import { useTranslation } from 'react-i18next';
import columns from '../../../columnDefinitions/report';

interface DataGridWrapperProps {
    loading: boolean;
    rows: any[];
    meta: any;
    setPage: (page: number) => void;
    onRowClick: (params: any) => void;
}

const DataGridWrapper = ({ loading, rows, meta, setPage, onRowClick }: DataGridWrapperProps) => {
    const { t } = useTranslation();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 15,
    });

    const rowCountRef = useRef(meta?.total || 0);

    const setPaginationModelFunc = useCallback(
        (newModel: DataGridProProps['paginationModel']) => {
            setPaginationModel(newModel as any);
            setPage(newModel?.page as number);
        },
        [setPage],
    );

    const rowCount = useMemo(() => {
        if (meta?.total !== undefined) {
            rowCountRef.current = meta?.total;
        }
        return rowCountRef.current;
    }, [meta]);

    const slotProps = {
        loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
        },
    } as GridSlotProps;

    return (
        <DataGridPro
            loading={loading}
            columns={columns({ t })}
            rows={rows || []}
            rowCount={rowCount}
            pageSizeOptions={[15]}
            paginationModel={paginationModel}
            pagination={true}
            onPaginationModelChange={setPaginationModelFunc}
            paginationMode="server"
            slotProps={slotProps}
            onRowClick={onRowClick}
            sx={{
                // pointer cursor on ALL rows
                '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer',
                },
            }}
        />
    );
};

export default DataGridWrapper;
