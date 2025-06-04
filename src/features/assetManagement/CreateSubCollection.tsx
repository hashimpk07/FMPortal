import { Subject, Close } from '@mui/icons-material';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    FormHelperText,
    Button,
} from '@mui/material';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import snackbar from '../../utils/ts/helper/snackbar';

const CreateSubCollection = ({
    collections,
    setCollections,
    setCreateSubCollectionModal,
    onClose,
}: any) => {
    const [collectionName, setCollectionName] = useState('');
    const [selectedCollectionGrp, setSelectedCollectionGrp] = useState('1');
    const { t } = useTranslation();
    const createNewCollection = () => {
        const newCollection = {
            id: collections.length + 1,
            name: collectionName,
            icon: <Subject />,
        };
        setCollections([...collections, newCollection]);
        snackbar(
            t('snackbar.new-sub-collection-created'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            null,
        );
        setCreateSubCollectionModal(false);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: 'bold', pb: 2 }}
                >
                    {t('asset.create-sub-collection')}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'grey', '&:hover': { color: 'black' } }}>
                    <Close />
                </IconButton>
            </Box>
            <Grid container spacing={4}>
                <Grid size={{ sm: 12, md: 12 }}>
                    <TextField
                        label={t('asset.name')}
                        variant="outlined"
                        fullWidth
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                </Grid>
                <Grid size={{ sm: 12, md: 12 }}>
                    <FormControl fullWidth>
                        <InputLabel id="collection-group-select">
                            {t('asset.create-collection-within')}
                        </InputLabel>
                        <Select
                            labelId="collection-group-select"
                            value={selectedCollectionGrp}
                            label={t('asset.create-collection-within')}
                            onChange={(e) => setSelectedCollectionGrp(e.target.value)}
                        >
                            {collections.map((grp: any) => (
                                <MenuItem key={grp.id} value={grp.id}>
                                    <Stack direction="row" spacing={1}>
                                        {grp.icon} <span>{grp.name}</span>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{t('asset.create-collection-text')}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={{ sm: 12, md: 12 }} textAlign="right">
                    <Button
                        variant="outlined"
                        sx={{ mr: 2 }}
                        onClick={() => setCreateSubCollectionModal(false)}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => createNewCollection()}
                        disabled={collectionName === ''}
                    >
                        {t('buttons.create')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateSubCollection;
