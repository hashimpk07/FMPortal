import { useState, useEffect } from 'react';
import {
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField,
    Typography,
    Divider,
    Avatar,
    Box,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/system';
import { RANDOM_AVATAR } from '../../../constants';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
`;

interface AddWorkOrderProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

interface CategoryListProps {
    id: number;
    name: string;
}

interface PriorityListProps {
    id: number;
    name: string;
}

interface PropertyListProps {
    id: number;
    name: string;
}

interface StoreListProps {
    id: number;
    name: string;
}

interface AssigneeListProps {
    id: number;
    name: string;
    imageUrl?: string;
}

interface StatusListProps {
    id: number;
    name: string;
}

const AddWorkOrder = ({ onSubmit, onCancel }: AddWorkOrderProps) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryListProps | null>(null);
    const [categoryList, setCategoryList] = useState<CategoryListProps[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const [priorities, setPriorities] = useState<PriorityListProps[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<PriorityListProps | null>(null);

    const [properties, setProperties] = useState<PropertyListProps[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyListProps | null>(null);

    const [stores, setStores] = useState<StoreListProps[]>([]);
    const [selectedStore, setSelectedStore] = useState<StoreListProps | null>(null);

    const [assignees, setAssignees] = useState<AssigneeListProps[]>([]);
    const [selectedAssignee, setSelectedAssignee] = useState<AssigneeListProps | null>(null);

    const [status, setStatus] = useState<StatusListProps[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<StatusListProps | null>(null);

    const { t } = useTranslation();

    const handleDateChange = (newDate: Date | null) => {
        setSelectedDate(newDate);
    };

    const getCategory = () => {
        setCategoryList([
            { id: 1, name: 'Security' },
            { id: 2, name: 'Issue' },
            { id: 3, name: 'Pest control' },
            { id: 4, name: 'Maintenance' },
            { id: 5, name: 'Assets' },
            { id: 6, name: 'Jobs' },
            { id: 7, name: 'Cleaning' },
        ]);
    };

    const getPriorities = () => {
        const priorityList = [
            { id: 1, name: 'Urgent' },
            { id: 2, name: 'High' },
            { id: 3, name: 'Low' },
            { id: 4, name: 'Medium' },
            { id: 5, name: 'Normal' },
        ];
        setPriorities(priorityList);
        setSelectedPriority(priorityList.find((priority) => priority.id === 1) || null);
    };

    const getProperties = () => {
        const propertyList = [
            { id: 1, name: 'Westgate Mall' },
            { id: 2, name: 'Lakeside Plaza' },
            { id: 3, name: 'City Central Mall' },
            { id: 4, name: 'City Center' },
            { id: 5, name: 'Brown Center' },
            { id: 6, name: 'Williams Square' },
        ];
        setProperties(propertyList);
        setSelectedProperty(propertyList.find((property) => property.id === 1) || null);
    };

    const getStores = () => {
        const storeList = [
            { id: 1, name: 'Adidas' },
            { id: 2, name: 'KFC' },
            { id: 3, name: 'M&N' },
        ];
        setStores(storeList);
        setSelectedStore(storeList.find((store) => store.id === 1) || null);
    };

    const getAssignees = () => {
        const assigneeList = [
            { id: 1, name: 'Alex T', imageUrl: RANDOM_AVATAR },
            { id: 2, name: 'John Smith', imageUrl: RANDOM_AVATAR },
            {
                id: 3,
                name: 'Peter Parker',
                imageUrl: RANDOM_AVATAR,
            },
            {
                id: 4,
                name: 'Michael Brown',
                imageUrl: RANDOM_AVATAR,
            },
            {
                id: 5,
                name: 'Sophia Williams',
                imageUrl: RANDOM_AVATAR,
            },
            {
                id: 6,
                name: 'Olivia Harris',
                imageUrl: RANDOM_AVATAR,
            },
            {
                id: 7,
                name: 'James Taylor',
                imageUrl: RANDOM_AVATAR,
            },
            { id: 8, name: 'Ethan Scott', imageUrl: RANDOM_AVATAR },
        ];
        setAssignees(assigneeList);
        setSelectedAssignee(assigneeList.find((assignee) => assignee.id === 1) || null);
    };

    const getStatus = () => {
        const statusList = [
            { id: 1, name: 'In Progress' },
            { id: 2, name: 'Done' },
            { id: 3, name: 'Open' },
            { id: 4, name: 'Completed' },
        ];
        setStatus(statusList);
        setSelectedStatus(statusList.find((status) => status.id === 1) || null);
    };

    const submitForm = () => {
        const data = {
            workOrder: 'Rooftop Solar Panels',
            status: 'In progress',
            completed: '-',
        };
        onSubmit(data);
        onCancel();
    };

    useEffect(() => {
        getProperties();
        getCategory();
        getPriorities();
        getAssignees();
        getStores();
        getStatus();
    }, []);

    return (
        <StyledPage>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {t('asset.new-work-order')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onCancel} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth style={{ width: '50%' }}>
                        <InputLabel id="select.case-work-category">
                            {t('asset.category')}
                        </InputLabel>
                        <Select
                            labelId="category-name-select"
                            value={selectedCategory?.id || null}
                            label={t('asset.category')}
                            onChange={(e) => {
                                setSelectedCategory(
                                    categoryList.find(
                                        (category) => category.id === e.target.value,
                                    ) || null,
                                );
                            }}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {selectedCategory ? (
                    <>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('common.title')}
                                variant="outlined"
                                fullWidth
                                value="Preventive Maintenance"
                                margin="normal"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('asset.description')}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                value="Conduct a comprehensive inspection and cleaning of the rooftop solar panels. Check panel connections, inverter functionality, and overall system performance. Ensure all mounting structures are secure and that panels are free of dirt, debris, or damage."
                                margin="normal"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('asset.dateModified')}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-priority">
                                    {t('select.case-work-priority')}
                                </InputLabel>
                                <Select
                                    labelId="select-priority"
                                    value={selectedPriority?.id || null}
                                    label={t('select.case-work-priority')}
                                    onChange={(e) => {
                                        setSelectedPriority(
                                            priorities.find(
                                                (priority) => priority.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {priorities.map((priority) => (
                                        <MenuItem key={priority.id} value={priority.id}>
                                            {priority.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-property">
                                    {t('select.case-work-property')}
                                </InputLabel>
                                <Select
                                    labelId="select-property"
                                    value={selectedProperty?.id || null}
                                    label={t('select.case-work-property')}
                                    onChange={(e) => {
                                        setSelectedProperty(
                                            properties.find(
                                                (property) => property.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {properties.map((property) => (
                                        <MenuItem key={property.id} value={property.id}>
                                            {property.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-store">
                                    {t('select.case-work-store')}
                                </InputLabel>
                                <Select
                                    labelId="select-store"
                                    value={selectedStore?.id || null}
                                    label={t('select.case-work-store')}
                                    onChange={(e) => {
                                        setSelectedStore(
                                            stores.find((store) => store.id === e.target.value) ||
                                                null,
                                        );
                                    }}
                                >
                                    {stores.map((store) => (
                                        <MenuItem key={store.id} value={store.id}>
                                            {store.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-assignee">
                                    {t('select.case-work-assigne')}
                                </InputLabel>
                                <Select
                                    labelId="select-assignee"
                                    value={selectedAssignee?.id || null}
                                    label={t('select.case-work-assigne')}
                                    onChange={(e) => {
                                        setSelectedAssignee(
                                            assignees.find(
                                                (assignee) => assignee.id === e.target.value,
                                            ) || null,
                                        );
                                    }}
                                >
                                    {assignees.map((assignee) => (
                                        <MenuItem key={assignee.id} value={assignee.id}>
                                            <Stack
                                                direction="row"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        mr: 2,
                                                    }}
                                                    src={assignee.imageUrl}
                                                />
                                                <Typography variant="body1">
                                                    {assignee.name}
                                                </Typography>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="select-status">{t('select.status')}</InputLabel>
                                <Select
                                    labelId="select-status"
                                    value={selectedStatus?.id || null}
                                    label={t('select.status')}
                                    onChange={(e) => {
                                        setSelectedStatus(
                                            status.find((status) => status.id === e.target.value) ||
                                                null,
                                        );
                                    }}
                                >
                                    {status.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('cases.contact-email')}
                                variant="outlined"
                                fullWidth
                                value="j-smith@gmail.com"
                                margin="normal"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={t('cases.contact-phone-number')}
                                variant="outlined"
                                fullWidth
                                value="+22 7136 827319"
                                margin="normal"
                            />
                        </Grid>
                    </>
                ) : (
                    <Box sx={{ height: '300px' }}></Box>
                )}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ marginY: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }} textAlign="right">
                    <Button
                        variant="outlined"
                        sx={{ marginRight: 2, textTransform: 'none' }}
                        onClick={onCancel}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={submitForm}
                        sx={{ marginRight: 2, textTransform: 'none' }}
                    >
                        {t('buttons.add-case-works')}
                    </Button>
                </Grid>
            </Grid>
        </StyledPage>
    );
};

export default AddWorkOrder;
