import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDashboardStore } from '../store/dashboardStore';

function CentreSelector() {
    const { t } = useTranslation();
    const { centres, isLoadingCentres, selectedCentreId, setSelectedCentreId } =
        useDashboardStore();

    return (
        <Box sx={{ minWidth: 200, maxWidth: 250 }}>
            <FormControl fullWidth disabled={isLoadingCentres}>
                <InputLabel id="centre-name-label">{t('dashboard.centre', 'Centre')}</InputLabel>
                <Select
                    labelId="centre-name-select"
                    value={selectedCentreId}
                    label={t('dashboard.centre', 'Centre')}
                    onChange={(e) => {
                        const value = e.target.value as number;
                        setSelectedCentreId(value);
                    }}
                >
                    <MenuItem key="all" value={0}>
                        {t('dashboard.all-centres', 'All Centres')}
                    </MenuItem>
                    {centres.map((centre) => (
                        <MenuItem key={centre.id} value={centre.id}>
                            {centre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default CentreSelector;
