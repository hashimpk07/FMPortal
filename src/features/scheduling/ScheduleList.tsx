import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Drawer, Typography } from '@mui/material';
import styled from '@emotion/styled';
import type { DocumentsData as DocumentsDataType } from '../../types/pageTypes';
import columns from '../../columnDefinitions/scheduleList';
import Controls from './Controls';
import ViewTask from './ViewTask';

const STATUS_ACTIVE = 1;
const STATUS_INACTIVE = 2;
const STATUS_FINISHED = 3;

const scheduleList: DocumentsDataType[] = [
    {
        id: 1,
        taskName: 'Emergency intercom monthly check',
        type: 'Property Compliance',
        plan: 'Value',
        asset: 'Freight Elevator',
        button: 'Value',
        status: STATUS_ACTIVE,
    },
    {
        id: 2,
        taskName: 'Annual air filter check',
        type: 'Inspection',
        plan: 'Value',
        asset: 'HVAC Unit #014',
        button: 'Value',
        status: STATUS_ACTIVE,
    },
    {
        id: 3,
        taskName: 'Circus breaker replacement',
        type: 'Work order',
        plan: 'Value',
        asset: '-',
        button: 'Value',
        status: STATUS_ACTIVE,
    },
    {
        id: 4,
        taskName: 'Parking Level 1 Auto Pay Station installation',
        type: 'Case',
        plan: 'Value',
        asset: '-',
        button: 'Value',
        status: STATUS_INACTIVE,
    },
    {
        id: 5,
        taskName: 'Parking Level 1 Auto Pay Station removal',
        type: 'Case',
        plan: 'Value',
        asset: 'APS L1 #01',
        button: 'Value',
        status: STATUS_FINISHED,
    },
];

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const ScheduleList = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<DocumentsDataType[]>([]);
    const [showViewTaskModal, setViewTaskModal] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setRows(scheduleList);
        };

        getData();
    }, []);

    const onRowSelect = () => {
        setViewTaskModal(true);
    };

    return (
        <StyledPage>
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '36px' }}>
                {t('scheduling.Scheduling')}
            </Typography>
            <Controls />
            <DataGridPro
                onRowClick={onRowSelect}
                columns={columns({ t })}
                rows={rows || []}
                pagination
                sx={{
                    // pointer cursor on ALL rows
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
            />
            <Drawer
                anchor="right"
                open={showViewTaskModal}
                onClose={() => setViewTaskModal(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                <ViewTask onClose={() => setViewTaskModal(false)} />
            </Drawer>
        </StyledPage>
    );
};

export default ScheduleList;
