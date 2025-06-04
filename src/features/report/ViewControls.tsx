import { Search, Download, ContentCopy, Edit } from '@mui/icons-material';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
    onEmailClick?: () => void;
}

const ViewControls = ({ search, setSearch, onEmailClick }: ControlsProps) => {
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
                sx={{ width: '40%' }}
                variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: '1em' }}>
                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    startIcon={<ContentCopy />}
                >
                    {t('buttons.copy')}
                </Button>
                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    startIcon={<ContentCopy />}
                    onClick={onEmailClick}
                >
                    {t('buttons.email')}
                </Button>
                <Button variant="contained" color="inherit" size="medium" startIcon={<Download />}>
                    {t('buttons.download')}
                </Button>

                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    startIcon={<Edit />}
                    onClick={() => {}}
                >
                    {t('buttons.edit')}
                </Button>
            </Box>
        </Box>
    );
};

export default ViewControls;
