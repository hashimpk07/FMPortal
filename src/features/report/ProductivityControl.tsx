import { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Typography,
    Grid,
    IconButton,
} from '@mui/material';
import { Search, Login, Add } from '@mui/icons-material';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useTranslation } from 'react-i18next';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';

interface ProductivityControlProps {
    search: string;
    setSearch: (value: string) => void;
}

const ProductivityControl = ({ search, setSearch }: ProductivityControlProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [hasData, setHasData] = useState(false);
    console.log('hasData', hasData);
    useEffect(() => {
        const data = localStorage.getItem('userData');
        if (data) {
            setHasData(true);
        } else {
            setHasData(false);
        }
    }, []);

    const handleButtonClick = () => {
        navigate('/productivity-list');
    };

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
                            width: '30%',
                            padding: '7px',
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
                        <Button variant="contained" size="medium" startIcon={<Add />}>
                            {t('buttons.create-report')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<Login />}
                            sx={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.all-report')}
                        </Button>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="medium"
                            startIcon={<StarBorderOutlinedIcon />}
                            sx={{
                                width: '25%',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            {t('buttons.favourites')}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ width: '100%', height: '100vh', marginTop: '2%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100vh',
                                    marginTop: '2%',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '2px solid',
                                        borderColor: 'lightgrey',
                                        padding: '16px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            src="/reports/Display Icon.png"
                                            alt="Landing"
                                            style={{
                                                maxWidth: '100px',
                                                height: 'auto',
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '10px',
                                            }}
                                        >
                                            <IconButton aria-label="start">
                                                <StarBorderIcon />
                                            </IconButton>
                                            <IconButton aria-label="edit">
                                                <LibraryBooksIcon />
                                            </IconButton>
                                            <IconButton aria-label="copy">
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Box sx={{ marginTop: '16px' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {t('report.my-productivity')}
                                        </Typography>

                                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                                            {t('report.productivity-centre')}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            sx={{ width: '25%' }}
                                            onClick={handleButtonClick}
                                        >
                                            {t('buttons.view')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>{' '}
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default ProductivityControl;
