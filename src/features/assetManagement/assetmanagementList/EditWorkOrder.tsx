import { useState, useEffect } from 'react';
import {
    Button,
    MenuItem,
    Select,
    FormControl,
    TextField,
    Typography,
    Divider,
    Avatar,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import styled from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
`;

interface EditWorkOrderProps {
    caseInfo: any;
    onCancel: () => void;
}

interface CategoryListProps {
    id: number;
    name: string;
}

interface PriorityListProps {
    id: number;
    name: string;
    imageUrl?: string;
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

const EditWorkOrder = ({ caseInfo, onCancel }: EditWorkOrderProps) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryListProps | null>(null);
    const [categoryList, setCategoryList] = useState<CategoryListProps[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date('12/12/2024'));
    const { t } = useTranslation();
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
            {
                id: 1,
                name: 'Urgent',
                imageUrl: 'public/assets/images/urgent.svg',
            },
            { id: 2, name: 'High', imageUrl: 'public/assets/images/high.svg' },
            { id: 3, name: 'Low', imageUrl: 'public/assets/images/low.svg' },
            {
                id: 4,
                name: 'Medium',
                imageUrl: 'public/assets/images/medium.svg',
            },
            {
                id: 5,
                name: 'Normal',
                imageUrl: 'public/assets/images/normal.svg',
            },
        ];
        setPriorities(priorityList);
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
    };

    const getStores = () => {
        const storeList = [
            { id: 1, name: 'Adidas' },
            { id: 2, name: 'KFC' },
            { id: 3, name: 'M&N' },
        ];
        setStores(storeList);
    };

    const getAssignees = () => {
        const assigneeList = [
            { id: 1, name: 'Alex T', imageUrl: '/path/to/alex-image.jpg' },
            { id: 2, name: 'John Smith', imageUrl: '/path/to/alex-image.jpg' },
            {
                id: 3,
                name: 'Peter Parker',
                imageUrl: '/path/to/alex-image.jpg',
            },
            {
                id: 4,
                name: 'Michael Brown',
                imageUrl: '/path/to/alex-image.jpg',
            },
            {
                id: 5,
                name: 'Sophia Williams',
                imageUrl: '/path/to/alex-image.jpg',
            },
            {
                id: 6,
                name: 'Olivia Harris',
                imageUrl: '/path/to/alex-image.jpg',
            },
            {
                id: 7,
                name: 'James Taylor',
                imageUrl: '/path/to/alex-image.jpg',
            },
            { id: 8, name: 'Ethan Scott', imageUrl: '/path/to/alex-image.jpg' },
        ];
        setAssignees(assigneeList);
    };

    const getStatus = () => {
        const statusList = [
            { id: 1, name: 'In progress' },
            { id: 2, name: 'Done' },
            { id: 3, name: 'Open' },
            { id: 4, name: 'Completed' },
        ];
        setStatus(statusList);
    };

    const submitForm = () => {
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

    useEffect(() => {
        if (caseInfo) {
            setSelectedCategory(
                categoryList.find((category) => category.name === caseInfo.category) || null,
            );
            setSelectedPriority(
                priorities.find((priority) => priority.name === caseInfo.priority) || null,
            );
            setSelectedProperty(
                properties.find((property) => property.name === caseInfo.property) || null,
            );
            setSelectedStore(stores.find((store) => store.name === caseInfo.store) || null);
            setSelectedAssignee(
                assignees.find((assignee) => assignee.name === caseInfo.assignee) || null,
            );
            setSelectedStatus(status.find((status) => status.name === caseInfo.status) || null);
        }
    }, [caseInfo, categoryList, priorities, properties, stores, assignees, status]);

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
                    {t('asset.editWorkOrder"')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onCancel} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth style={{ width: '50%' }}>
                        <Select
                            labelId="category-name-select"
                            value={selectedCategory?.id || null}
                            label={t('select.case-work-category"')}
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

                <>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label={t('select.case-work-title')}
                            variant="outlined"
                            fullWidth
                            value="Preventive Maintenance"
                            margin="normal"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label={t('select.case-work-description')}
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
                            <Select
                                labelId="select-priority"
                                value={selectedPriority?.id || null}
                                label={t('cases.priority')}
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            {priority.imageUrl ? (
                                                <img
                                                    src={priority.imageUrl}
                                                    alt={priority.name}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        marginRight: '8px',
                                                    }}
                                                />
                                            ) : (
                                                <AccountCircleIcon sx={{ fontSize: 25 }} />
                                            )}
                                            <Typography variant="body1">{priority.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
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
                            <Select
                                labelId="select-store"
                                value={selectedStore?.id || null}
                                label={t('select.case-work-store')}
                                onChange={(e) => {
                                    setSelectedStore(
                                        stores.find((store) => store.id === e.target.value) || null,
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
                            <Select
                                labelId="select-assignee"
                                value={selectedAssignee?.id || null}
                                label={t('cases.assignee')}
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    marginRight: 2,
                                                }}
                                            >
                                                {assignee.imageUrl ? (
                                                    <img
                                                        src={assignee.imageUrl}
                                                        alt={assignee.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            marginTop: '20px',
                                                            marginRight: '16px',
                                                        }}
                                                    />
                                                ) : (
                                                    <AccountCircleIcon
                                                        sx={{
                                                            fontSize: 25,
                                                        }}
                                                    />
                                                )}
                                            </Avatar>
                                            <Typography variant="body1">{assignee.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <Select
                                labelId="select-status"
                                value={selectedStatus?.id || null}
                                label={t('cases.status')}
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
                            {t('buttons.update')}
                        </Button>
                    </Grid>
                </>
            </Grid>
        </StyledPage>
    );
};

export default EditWorkOrder;
