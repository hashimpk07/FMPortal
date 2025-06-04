/* eslint-disable no-unused-vars */
import {
    Container,
    Box,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Modal,
    IconButton,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

//import SearchIcon from '@mui/icons-material/Search';
import { Close } from '@mui/icons-material';
import { parseISO } from 'date-fns';
import HTTP from '../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../constants';
import snackbar from '../../utils/ts/helper/snackbar';
import fetchCentresList, { CentreData } from '../../services/centres';

interface Type {
    id: string;
    attributes: {
        name: string;
    };
}

interface DocumentTypeData {
    id: string;
    name: string;
}

interface TransformedType {
    id: string;
    name: string;
}

interface TransformedCentres {
    id: string;
    name: string;
}

interface PropertyData {
    id: string;
    name: string;
}

const EditDetails = ({ data, setEdit, setDocumentDetailModal, setEditCount }: any) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');

    const [options, setOptions] = useState([
        { id: 'more-testing', name: 'simple-tag1' },
        { id: 'yet-more-testing', name: 'simple-tag2' },
        { id: 'even-more-testing', name: 'simple-tag3' },
        { id: 'the-most-testing', name: 'simple-tag4' },
    ]);

    const [expiryDate, setExpiryDate] = useState<Date>();
    const [expiryTime, setExpiryTime] = useState<Date>();

    const [tagName, setTagName] = useState('');

    const [isLoading, setLoading] = useState(false);

    const createNewTags = () => {
        const newOption = {
            id: tagName,
            name: tagName,
        };
        setOptions([newOption, ...options]);
        snackbar(
            t('snackbar.new-tag-created'),
            'default',
            { horizontal: 'center', vertical: 'bottom' },
            null,
        );
        closeModal();
    };

    const closeModal = () => {
        setLoading(false);
    };

    const clearModalTagName = () => {
        setTagName('');
    };

    // const selectedTags = [
    //     { id: 'more-testing', name: 'simple-tag' },
    //     { id: 'yet-more-testing', name: 'simple-tag' },
    // ];

    const [documnetTypes, setDocumentTypes] = useState<DocumentTypeData[]>([]);
    const [properties, setProperties] = useState<PropertyData[]>([]);

    const getProperties = async () => {
        try {
            const response = await fetchCentresList();
            const centresData = response.data;
            if (Array.isArray(centresData)) {
                const transformedData: TransformedCentres[] = centresData.map(
                    (item: CentreData) => ({
                        id: String(item.id),
                        name: item.attributes.name,
                    }),
                );
                setProperties(transformedData);
            } else {
                console.error("Response data 'data' is not an array", centresData);
            }
        } catch (error) {
            console.error('Properties not fetch ', error);
        }
    };

    const getType = async () => {
        try {
            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/documents/types`);
            const typesData = response.data.data;

            if (Array.isArray(typesData)) {
                const transformedData: TransformedType[] = typesData.map((item: Type) => ({
                    id: String(item.id),
                    name: item.attributes.name,
                }));
                setDocumentTypes(transformedData);
            } else {
                console.error("Response data 'data' is not an array", typesData);
            }
        } catch (error) {
            console.error('Type not fetch ', error);
        }
    };

    // function formatDateTimeWithOffset(date: Date): string {
    //     const base = format(date, "yyyy-MM-dd'T'HH:mm:ss");

    //     const offsetMinutes = date.getTimezoneOffset();
    //     const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    //     const absOffset = Math.abs(offsetMinutes);
    //     const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    //     const offsetMins = String(absOffset % 60).padStart(2, '0');

    //     return `${base}${offsetSign}${offsetHours}:${offsetMins}`;
    // }

    useEffect(() => {
        setName(data.name);
        setDescription(data.description);
        setSelectedProperty(data.propertyId);
        setSelectedDocumentType(data.type);

        if (data.expiryDate && data.expiryTime) {
            //data.expiryDateTime
            const parsedDate = parseISO(data.expiryDateTime);
            setExpiryDate(parsedDate);
            setExpiryTime(parsedDate);
        }

        getType();
        getProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveDocumentDetails = async () => {
        let formatted;

        if (expiryDate instanceof Date) {
            const dateTimeInUtc = expiryDate.toISOString();
            formatted = dateTimeInUtc.replace(/(\.\d{3})?Z$/, '+00:00');
        } else {
            formatted = '';
        }
        console.log('formatted', expiryTime);

        try {
            const documentId = data.id;
            // const tags = selectedTags.map((tag) => {
            //     return {
            //         data: {
            //             type: tag.name,
            //             id: tag.id,
            //         },
            //     };
            // });

            const formData = {
                data: {
                    type: 'document',
                    id: documentId,
                    attributes: {
                        name: name,
                        description: description,
                        expiresAt: formatted,
                    },
                    relationships: {
                        tags: [],
                    },
                },
            };

            const { status } = await HTTP.patch(
                `${API_BASE_URL}/${API_VERSION}/documents/${documentId}`,
                formData,
            );
            if (status === 200) {
                setEditCount((prev: number) => prev + 1);
                snackbar(
                    t('snackbar.document-details-updated-successfully'),
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
                setDocumentDetailModal(false);
            }
        } catch (err) {
            console.log('Error in document landing page API', err);
            snackbar(
                t('snackbar.common.error-on-update'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
            setDocumentDetailModal(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ overflowY: 'auto', height: '100vh' }}>
            <Box sx={{ padding: 3 }}>
                <form>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <TextField
                                label={t('common.name')}
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid
                            size={{ xs: 12, lg: 6 }}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        ></Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <TextField
                                label={t('common.description')}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="property-select">{t('common.property')}</InputLabel>
                                <Select
                                    labelId="property-select"
                                    value={selectedProperty}
                                    label={t('common.property')}
                                    onChange={(e) => setSelectedProperty(e.target.value)}
                                    disabled
                                >
                                    {properties.map((prop) => (
                                        <MenuItem key={prop.id} value={prop.id}>
                                            {prop.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="document-type-select">
                                    {t('common.document-type')}
                                </InputLabel>
                                <Select
                                    labelId="document-type-select"
                                    value={selectedDocumentType}
                                    label={t('common.document-type')}
                                    disabled
                                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                                >
                                    {documnetTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('common.expire-date')}
                                    format="dd/MM/yyyy"
                                    value={expiryDate}
                                    onChange={(newValue) => newValue && setExpiryDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: false,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label={t('common.expire-time')}
                                    views={['hours', 'minutes']}
                                    ampm={false}
                                    value={expiryDate}
                                    onChange={(newValue) => newValue && setExpiryDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: false,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* <FormControl fullWidth>
                            <InputLabel id="multi-select-label">
                                {t('common.tags')}
                            </InputLabel>
                            <Select
                                labelId="multi-select-label"
                                multiple
                                label={t('common.tags')}
                                value={selectedOptions}
                                onChange={handleSelectTagsChange}
                                open={tagsOpen}
                                onOpen={() => setTagsOpen(true)}
                                onClose={() => setTagsOpen(false)}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return t('common.tags');
                                    }
                                    return selected.join(',');
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        width: '50%',
                                    },
                                }}
                            >
                                {/* Search field */}

                        {/*  <TextField
                                    fullWidth
                                    placeholder={t('common.searchTags')}
                                    value={searchTags}
                                    onChange={(e) => setSearchTags(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        padding: '6px 10px',
                                        borderRadius: '5px',
                                        width: '95%',
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon /> 
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {filteredTagsOptions.length > 0 ? (
                                    filteredTagsOptions.map((option) => (
                                        <MenuItem key={option.name} value={option.name}>
                                            <ListItemText primary={option.id} />
                                            <Checkbox
                                                checked={
                                                    selectedOptions.indexOf(option.name) >
                                                    -1
                                                }
                                            />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem>
                                        <ListItemText primary={t('common.noResults')} />
                                    </MenuItem>
                                )}

                          

                                <Button
                                    fullWidth
                                    onClick={handleAddTagsClick}
                                    sx={{
                                        backgroundColor: '#F0F0F0',
                                        marginLeft: '5%',
                                        color: '#000',
                                        width: '90%',
                                        '&:hover': {
                                            backgroundColor: 'darkgrey',
                                        },
                                        marginTop: 2,
                                    }}
                                >
                                    {t('common.createNewTags')}
                                </Button>
                            </Select>
                        </FormControl>  */}

                        {/* <Grid size={{ xs: 12, lg: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="document">
                                    {t('common.document')}
                                </InputLabel>
                                <Select
                                    labelId="document-type-select"
                                    value={selectedDocumentType}
                                    label={t('common.document')}
                                    onChange={(e) =>
                                        setSelectedDocumentType(e.target.value)
                                    }
                                >
                                    {documnetTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid size={{ xs: 12, lg: 12 }}>
                            <TextField
                                label={t('common.document')}
                                variant="outlined"
                                type="file"
                                fullWidth
                                disabled
                                // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                //     handleFileChange(e)
                                // }
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        // multiple: true,
                                        accept: '.pdf,.jpg,.png,.doc',
                                    },
                                }}
                            />
                        </Grid>

                        {/* <Grid size={{ xs: 12, lg: 12 }}>
                            <Autocomplete
                                multiple
                                options={assets}
                                getOptionLabel={(option) => option.name}
                                filterSelectedOptions
                                value={selectedAssets}
                                onChange={(
                                    _,
                                    newValue:
                                        | {
                                              id: string;
                                              name: string;
                                          }[]
                           setExpiryDate     ) => {
                                    setSelectedAssets(newValue || []);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('common.assets')}
                                        placeholder={t('common.assets')}
                                    />
                                )}
                            />
                        </Grid> */}

                        {/* Divider before Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ marginY: 2 }} />
                        </Grid>

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }} textAlign="right">
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={() => setEdit(false)}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button variant="contained" onClick={() => saveDocumentDetails()}>
                                {t('buttons.update-details')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Modal open={isLoading} onClose={closeModal}>
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
                            textAlign: 'center',
                        }}
                    >
                        {/* Container for label and close button */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography id="modal-title" variant="h6">
                                {t('common.createNewTag')}
                            </Typography>

                            {/* Close Button */}
                            <IconButton onClick={closeModal} sx={{ padding: 0 }}>
                                <Close />
                            </IconButton>
                        </Box>

                        {/* TextField for the tag */}
                        <TextField
                            label={t('common.tags')}
                            variant="outlined"
                            fullWidth
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />

                        <Grid
                            size={{ sm: 12, md: 12 }}
                            sx={{ paddingTop: '20px' }}
                            textAlign="right"
                        >
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={clearModalTagName}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => createNewTags()}
                                disabled={tagName === ''}
                            >
                                {t('buttons.create')}
                            </Button>
                        </Grid>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default EditDetails;
