import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

import ProductivityControl from './ProductivityControl';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const ListReports = () => {
    const { t } = useTranslation();

    const [search, setSearch] = useState('');

    return (
        <StyledPage>
            <Typography variant="h1">{t('page-titles.reporting')}</Typography>

            <ProductivityControl search={search} setSearch={setSearch} />
        </StyledPage>
    );
};

export default ListReports;
