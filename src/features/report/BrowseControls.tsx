import { Add, Search } from '@mui/icons-material';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

interface ControlsProps {
    search: string;
    setSearch: (value: string) => void;
    showCreateModal?: () => void;
}

const BrowseControls = ({ search, setSearch, showCreateModal }: ControlsProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const listEmailSheduleReport = () => {
        navigate('/schedule-report');
    };

    const onChangeSearch = (e: any) => {
        setSearch(e.currentTarget.value);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                        id="input-with-icon-textfield"
                        label={t('common.search')}
                        value={search}
                        onChange={onChangeSearch}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: '75%' }}
                        variant="outlined"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 7 }} sx={{ alignContent: 'flex-end' }}>
                    <Box sx={{ display: 'flex', gap: '1em' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                height: '40px',
                            }}
                            onClick={showCreateModal}
                        >
                            {t('buttons.create-report')}
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<TrendingUpIcon />}
                            sx={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                height: '40px',
                            }}
                        >
                            {t('buttons.all-reports')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<AccessTimeIcon />}
                            sx={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                height: '40px',
                            }}
                            onClick={() => listEmailSheduleReport()}
                        >
                            {t('navigation.scheduled-reports')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<StarBorderIcon />}
                            onClick={() => {}}
                            sx={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                height: '40px',
                            }}
                        >
                            {t('buttons.favourites')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BrowseControls;
