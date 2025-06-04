import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Breadcrumbs, Link, Drawer } from '@mui/material';
import styled from '@emotion/styled';
import { DataGridPro, GridRowModel } from '@mui/x-data-grid-pro';
import columns from '../../columnDefinitions/reportEmailSchedule';
import Control from './Controls';
import ViewEmailReport from './ViewEmailReport';
import snackbar from '../../utils/ts/helper/snackbar';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

interface ListEmailScheduleDataType {
    id: number;
    subject: string;
    from: string;
    emailTO: string;
    message: string;
    frequency: string;
    status: string;
}

const serviceProductivity = async () => {
    const data: ListEmailScheduleDataType[] = [
        {
            id: 1,
            subject: 'Cases report',
            from: 'Mallcomm',
            emailTO: 'alex.dixon@gmail.com; a-smith@hotmail.co.uk',
            message: 'This is a report about productivity of centres',
            frequency: 'Weekly',
            status: 'Active',
        },
        {
            id: 2,
            subject: 'Summer report',
            from: 'Mallcomm',
            emailTO: 'b.m@gmail.com',
            message: 'Summary report on Centre summar performances',
            frequency: 'Yearly',
            status: 'Active',
        },
        {
            id: 3,
            subject: 'My Productivity report',
            from: 'jonathan.smith@google.mail.com',
            emailTO: 'roy.mal@gmail.com',
            message: 'This is a report about productivity of centres',
            frequency: 'Monthly',
            status: 'Active',
        },
    ];
    return { data, errors: null };
};

const ListEmailSchedule = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState<ListEmailScheduleDataType[]>([]);
    const [openInvoiceDetailModal, setInvoiceDetailModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<ListEmailScheduleDataType | null>(null);

    useEffect(() => {
        const getData = async () => {
            const { data, errors } = await serviceProductivity();
            if (errors) {
                snackbar(
                    `${errors}`,
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
            } else {
                setRows(data);
            }
        };
        getData();
    }, []);

    const onRowSelect = (params: { row: GridRowModel }) => {
        setSelectedRow(params.row as ListEmailScheduleDataType);
        setInvoiceDetailModal(true);
    };

    return (
        <StyledPage>
            <Typography variant="h1">{t('page-titles.schedule-report')}</Typography>
            <Breadcrumbs separator=">" aria-label="breadcrumb">
                <Link color="inherit" href={'/browse-report'}>
                    {t('navigation.reporting')}
                </Link>
                <Link color="inherit" href="#">
                    {t('navigation.scheduled-reports')}
                </Link>
            </Breadcrumbs>
            <Control search={search} setSearch={setSearch} />

            <DataGridPro
                columns={columns({ t })}
                rows={rows}
                pagination
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
                onRowClick={onRowSelect}
            />

            <Drawer
                anchor="right"
                open={openInvoiceDetailModal}
                onClose={() => setInvoiceDetailModal(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '50%',
                        height: '100%',
                    },
                }}
            >
                {selectedRow && (
                    <ViewEmailReport closeDrawer={() => setInvoiceDetailModal(false)} />
                )}
            </Drawer>
        </StyledPage>
    );
};

export default ListEmailSchedule;
