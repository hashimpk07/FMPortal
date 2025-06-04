import styled from '@emotion/styled';
import { useState } from 'react';
import { Button, Typography, Drawer } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Controls from './ViewControls';
import ReorderColumns from './ReorderColumns';
import EmailReport from './EmailReport';
import columns from '../../columnDefinitions/report';
import snackbar from '../../utils/ts/helper/snackbar';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const rows = [
    {
        id: 1,
        centre: 'Westgate Mall',
        openTicketsCount: 275,
        overdueTicketsCount: 260,
        totalTicketsCreated: 600,
        ticketsResolvedCount: 15,
        percentageOverdueTickets: '11%',
    },
    {
        id: 2,
        centre: 'Lakeside Plaza',
        openTicketsCount: 150,
        overdueTicketsCount: 140,
        totalTicketsCreated: 600,
        ticketsResolvedCount: 10,
        percentageOverdueTickets: '11%',
    },
    {
        id: 3,
        centre: 'City Central Mall',
        openTicketsCount: 95,
        overdueTicketsCount: 90,
        totalTicketsCreated: 600,
        ticketsResolvedCount: 5,
        percentageOverdueTickets: '11%',
    },
    {
        id: 4,
        centre: 'Riverside Shopping Centre',
        openTicketsCount: 370,
        overdueTicketsCount: 355,
        totalTicketsCreated: 600,
        ticketsResolvedCount: 15,
        percentageOverdueTickets: '11%',
    },
];

const ViewReport = () => {
    const [search, setSearch] = useState('');
    const [showReorderModal, setReorderModal] = useState(false);

    const location = useLocation();
    const reportName = location.state.name;
    const [showEmailReportModal, setShowEmailReportModal] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShowEmailReportModal(false);
        setOpen(false);
    };
    const { t } = useTranslation();

    const sendMail = () => {
        handleClose();
        return snackbar(
            t('snackbar.email-report-created'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            2000,
        );
    };

    const openEmailReport = () => {
        setShowEmailReportModal(true);
        handleOpen();
    };

    return (
        <StyledPage>
            <Typography variant="h1">{reportName}</Typography>
            <Controls search={search} setSearch={setSearch} onEmailClick={openEmailReport} />
            <DataGridPro
                onRowClick={() => {}}
                columns={columns({ t })}
                pagination
                rows={rows || []}
                sx={{
                    // pointer cursor on ALL rows
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
            />
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                <Grid size={{ xs: 3, md: 3 }} offset={{ md: 'auto' }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => setReorderModal(true)}
                    >
                        {t('reporting.reorder-columns')}
                    </Button>
                </Grid>
            </Grid>
            <ReorderColumns open={showReorderModal} onClose={() => setReorderModal(false)} />

            <Drawer anchor="right" open={open} onClose={handleClose}>
                {showEmailReportModal && <EmailReport onSubmit={sendMail} onCancel={handleClose} />}
            </Drawer>
        </StyledPage>
    );
};

export default ViewReport;
