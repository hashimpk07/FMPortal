import { useEffect, useState } from 'react';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { Search, Edit, Download, ContentCopy } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
}

const ListControls = ({ search, setSearch }: ControlsProps) => {
    const { t } = useTranslation();
    const [hasData, setHasData] = useState(true);
    console.log('hasData', hasData);
    useEffect(() => {
        const data = localStorage.getItem('userData');
        if (data) {
            setHasData(true);
        } else {
            setHasData(true);
        }
    }, []);

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
                                sx: {
                                    borderRadius: '15px',
                                },
                            },
                        }}
                        sx={{
                            width: '27%',
                            padding: '2px',
                            height: 'auto',
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1em',
                            alignItems: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<ContentCopy />}
                            sx={{
                                width: '24%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('common.copy')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<ContentCopy />}
                            sx={{
                                width: '24%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('common.email')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Download />}
                            sx={{
                                width: '29%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.download')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Edit />}
                            sx={{
                                width: '22%',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.edit-work-order')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ListControls;
