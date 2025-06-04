import { Box, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
}
const Controls = ({ search, setSearch }: ControlsProps) => {
    const { t } = useTranslation();

    return (
        <>
            <Box sx={{ width: '100%' }}>
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
                        sx={{
                            width: '35%',
                            padding: '3px',
                            height: 'auto',
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Controls;
