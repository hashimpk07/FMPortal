import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

import { DataGridPro } from '@mui/x-data-grid-pro';
import snackbar from '../../utils/ts/helper/snackbar';
import columns from '../../columnDefinitions/historyEmailReport';
import Control from './Controls';

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
    dateSent: string;
    download: string;
}

const serviceProductivity = async () => {
    const data: ListEmailScheduleDataType[] = [
        {
            id: 1,
            subject: 'My Productivity repor',
            from: 'Mallcomm',
            emailTO: 'alex.dixon@gmail.com; a-smith@hotmail.co.uk',
            dateSent: '25/08/2024',
            download: 'download.jpg',
        },
        {
            id: 2,
            subject: 'My Productivity repor',
            from: 'Mallcomm',
            emailTO: 'b.m@gmail.com',
            dateSent: '17/07/2024',
            download: 'download.jpg',
        },
        {
            id: 3,
            subject: 'My Productivity report',
            from: 'jonathan.smith@google.mail.com',
            emailTO: 'roy.mal@gmail.com',
            dateSent: '25/10/2024',
            download: 'download.jpg',
        },
    ];
    return { data, errors: null };
};

const ListHistoryReport = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState<ListEmailScheduleDataType[]>([]);

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

    return (
        <StyledPage>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                {t('report.reportHistory-productivityReport')}
            </Typography>

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
            />
        </StyledPage>
    );
};

export default ListHistoryReport;
