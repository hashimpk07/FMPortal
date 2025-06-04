import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer, Typography } from '@mui/material';
import styled from '@emotion/styled';
import ViewCaseInfo from './ViewCaseInfo';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const ViewCase = () => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [viewContractorModal, setViewContractorModal] = useState(false);
    const [caseInfo, setCaseInfo] = useState<any | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setViewContractorModal(false);
        setOpen(false);
    };

    useEffect(() => {
        const getData = async () => {
            const data = {
                firstName: 'Alex',
                lastName: 'Trapper',
                imageUrl: 'https://i.pravatar.cc/300',
                companyName: 'Oakwood Conveyancing',
                designation: 'Site manager',
                email: 'alex.trapper@gmail.com',
                phoneNumber: '+22 7136 827319',
                rate: '£65',
                title: 'Graffiti Removal from North Entrance - SEC-9876',
            };
            setCaseInfo(data);
        };

        getData();
    }, []);

    const showSliderModal = () => {
        setViewContractorModal(true);
        handleOpen();
    };

    return (
        <StyledPage>
            <button onClick={showSliderModal}>View Case View Details</button>{' '}
            {/* Simulate a click to show modal */}
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                {viewContractorModal && caseInfo ? (
                    <ViewCaseInfo onClose={handleClose} caseInfo={caseInfo} />
                ) : (
                    <Typography>{t('common.case-empty')}</Typography>
                )}
            </Drawer>
        </StyledPage>
    );
};

export default ViewCase;
