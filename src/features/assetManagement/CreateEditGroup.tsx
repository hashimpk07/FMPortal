import { Close } from '@mui/icons-material';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    FormHelperText,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { createAssetGroup, editAssetGroup } from '../../services/assetManagement';

const CreateEditGroup = ({
    mode = 'create',
    id,
    parentId,
    groups,
    centreId,
    setCreateGroupModal,
    onClose,
}: any) => {
    const IS_PARENT = 'IS-PARENT';
    const ALL_ASSETS = 'all-assets';

    const [groupName, setGroupName] = useState('');
    const [groupOptions, setGroupOptions] = useState<any[]>([]);
    const [selectedCollectionGrp, setSelectedCollectionGrp] = useState(IS_PARENT);
    const { t } = useTranslation();

    useEffect(() => {
        if (mode === 'create') {
            if (parentId !== ALL_ASSETS) {
                setSelectedCollectionGrp(parentId);
            }
        } else {
            const group = groups?.find((e: any) => e.id === id);
            setGroupName(group?.attributes?.name);
            console.log('id', group.id);
            if (parentId && groups.find((e: any) => e.id === parentId)) {
                setSelectedCollectionGrp(group?.attributes?.parentId);
            } else {
                setSelectedCollectionGrp(IS_PARENT);
            }
        }
    }, []);

    useEffect(() => {
        const options = [
            {
                id: IS_PARENT,
                name: t('asset.no-parent'),
                icon: '', // @TODO THIS
            },
        ];

        groups.forEach((e: any) => {
            options.push({
                id: e.id,
                name: e?.attributes?.name,
                icon: '', // @TODO THIS
            });
        });

        setGroupOptions(options);
    }, [groups]);

    const saveGroup = () => {
        let compValue: any = {
            data: {
                type: 'asset-group',
                attributes: {
                    name: groupName,
                },
                relationships: {
                    centre: {
                        data: {
                            type: 'centre',
                            id: Number(centreId),
                        },
                    },
                },
            },
        };

        if (selectedCollectionGrp !== IS_PARENT) {
            compValue.data.relationships.parent = {
                data: {
                    type: 'asset-group',
                    id: selectedCollectionGrp,
                },
            };
        }

        if (mode === 'create') {
            createAssetGroup(compValue).then(() => {
                onClose(true);
            });
        } else {
            compValue.data.id = id;

            editAssetGroup(compValue, id).then(() => {
                onClose(true);
            });
        }
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
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {mode === 'create' ? t('asset.create-group') : t('asset.edit-group')}
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
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Grid>

                {groups.length > 0 && (
                    <Grid size={{ sm: 12, md: 12 }}>
                        <FormControl fullWidth>
                            <InputLabel id="collection-group-select">
                                {t('asset.create-group-within')}
                            </InputLabel>

                            <Select
                                labelId="collection-group-select"
                                value={selectedCollectionGrp}
                                label={t('asset.create-group-within')}
                                onChange={(e) => setSelectedCollectionGrp(e.target.value)}
                            >
                                {groupOptions.map((grp: any) => (
                                    <MenuItem key={grp.id} value={grp.id}>
                                        <Stack direction="row" spacing={1}>
                                            {grp.icon} <span>{grp.name}</span>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>

                            {mode === 'create' && (
                                <FormHelperText>{t('asset.create-collection-text')}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                )}
                <Grid size={{ sm: 12, md: 12 }} textAlign="right">
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2 }}
                        onClick={() => setCreateGroupModal(null)}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => saveGroup()}
                        disabled={groupName === ''}
                    >
                        {mode === 'create' ? t('buttons.create') : t('buttons.save')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateEditGroup;
