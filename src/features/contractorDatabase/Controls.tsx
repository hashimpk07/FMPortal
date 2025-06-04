import { Search, Add, Download } from '@mui/icons-material';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
    onAdd: () => void;
}

const Controls = ({ search, setSearch, onAdd }: ControlsProps) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '1em',
                justifyContent: 'space-between',
            }}
        >
            <TextField
                id="input-with-icon-textfield"
                label={t('common.search')}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ width: '50%' }}
                variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: '1em' }}>
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<Add />}
                    onClick={() => {
                        onAdd();
                    }}
                >
                    {t('buttons.add-contractor')}
                </Button>

                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    startIcon={<Download />}
                    onClick={() => {}}
                >
                    {t('buttons.download-table')}
                </Button>
            </Box>
        </Box>
    );
};

export default Controls;
