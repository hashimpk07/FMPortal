import {
    Typography,
    Box,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    IconButton,
    Backdrop,
    CircularProgress,
    Avatar,
    Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import React, { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
// import { AxiosResponse } from 'axios';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// import { format } from 'date-fns';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import FormCreator from '../../components/MUIFormBuilder/FormCreator';
import snackbar from '../../utils/ts/helper/snackbar';
import { getAvatarInitials } from '../../utils/ts/helper/textFormatter';
import fetchCentresList, { CentreData } from '../../services/centres';

interface CreateFormProps {
    data?: any;
    onCancel: () => void;
    hastabs: boolean;
    isEdit: boolean;
    initialTabIndex?: number;
    setData?: any;
    setNewCaseCount?: React.Dispatch<React.SetStateAction<number>>;
    id?: number;
    caseId?: number;
    onDataEdited?: () => void;
}

interface Category {
    id: number;
    name: string;
    forms?: FormData[];
}

interface Priority {
    id: number | string;
    name: string;
}

interface Property {
    id: number | string;
    name: string;
}

interface Store {
    id: number | string;
    name: string;
}

interface Assignee {
    id: number | string;
    name: string;
}
interface FormData {
    type: string;
    id: string;
}

interface Relationships {
    forms: {
        data: FormData[];
    };
}

interface Status {
    id: number | string;
    name: string;
}

interface TransformedCategory {
    id: number;
    name: string;
    forms?: FormData[];
}
interface TransCategory {
    id: string;
    attributes: {
        name: string;
    };
    relationships: Relationships;
}

interface TransformedCentres {
    id: number;
    name: string;
}
interface TransformedUsers {
    id: number;
    name: string;
}

interface Users {
    id: string;
    attributes: {
        name: string;
    };
}
interface TransformedStore {
    id: number;
    name: string;
}

interface Stores {
    id: string;
    attributes: {
        name: string;
    };
}

interface PropertyStatus {
    id: number;
    type: string;
    attributes: {
        label: string;
        slug: string;
    };
}

const priorityIconPath = (value: string) => {
    return `/assets/images/${value.toLowerCase()}.svg`;
};

const CreateForm = ({
    hastabs = true,
    isEdit = false,
    data,
    onCancel,
    initialTabIndex,
    setData,
    setNewCaseCount,
    id,
    caseId,
    onDataEdited,
}: CreateFormProps) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tabValue, setTabValue] = useState<number>(initialTabIndex || 0);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [selectedAssignee, setSelectedAssignee] = useState<string>('');
    const [statusList, setStatusList] = useState<Status[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [dynamicForms, setDynamicForms] = useState<any>([]);
    const [isCaseForm, setCaseForm] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [formList, setFormList] = useState<any>({});
    const [pageHasBeenLoaded, setPageHasbeenLoaded] = useState(false);
    // To keep updated form values on change event
    const [updatedFormValues, setUpdatedFormValues] = useState<any>({});
    const [hasPriorityInForm, setPriorityInForm] = useState(false);
    const [propertyFieldTitle, setPropertyFieldTitle] = useState('');
    const [storeFieldTitle, setStoreFieldTitle] = useState('');
    const [categoryFieldTitle, setCategoryFieldTitle] = useState('');
    const [isStandAloneWorkOrder, setStandAloneWorkOrder] = useState(false);
    const [isFileUploading, setFileUploading] = useState(false);

    useEffect(() => {
        if (
            isEdit &&
            id &&
            properties.length &&
            statusList.length &&
            assignees.length &&
            priorities.length &&
            stores.length &&
            categories.length &&
            !pageHasBeenLoaded
        ) {
            setSelectedProperty(data.propertyId);
            setSelectedStore(data.storeId);
            setSelectedAssignee(data.assigneeId);
            setSelectedPriority(data.reserved_priority || '');
            setSelectedStatus(data.status);
            handleCategoryChange(data.categoryId);
            setCaseForm('parentId' in data && !data.parentId);
        }

        if (data?.centreId && properties.length) {
            // When adding new work order
            setSelectedProperty(data?.centreId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        data,
        properties,
        statusList,
        assignees,
        priorities,
        stores,
        pageHasBeenLoaded,
        categories,
    ]);

    const submitForm: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setLoading(true);

        // const propertyId = selectedProperty;

        let uploadFileData: any = {};

        if ('upload' in updatedFormValues) {
            uploadFileData = { ...updatedFormValues.upload };
            delete updatedFormValues.upload;
        }

        // Get updated form data from dynamic forms state
        const formData = { ...updatedFormValues, ...uploadFileData };

        // Check if a form field has a priority and use its value
        // let dynamic_priority;
        // if (hasPriorityInForm && 'priority' in formData) {
        //     dynamic_priority = formData.priority;
        //     delete formData.priority; // Remove it from the form data to avoid duplication
        // }

        // Case or Work order title
        const title = formData.title ?? formData.subject ?? '';

        // Get reference number if exists
        const referenceNumber = formData.referenceNumber;

        // Build the request payload
        const finalFormData: any = {
            data: {
                type: 'tickets',
                attributes: {
                    data: {
                        ...formData,
                        form: selectedCategory?.forms?.[0]?.id,
                        title,
                        ...(referenceNumber && { referenceNumber }),
                        ...(hasPriorityInForm ? { reserved_priority: selectedPriority } : {}),
                    },
                    status: selectedStatus,
                },
                // Add relationships structure to match API format
                ...(selectedCategory?.forms?.[0]?.id &&
                    !isEdit && {
                        relationships: {
                            assignedTo: {
                                data: {
                                    type: 'profiles',
                                    id: Number(selectedAssignee),
                                },
                            },
                            local: {
                                data: {
                                    type: 'localOrgs',
                                    id: Number(selectedStore),
                                },
                            },
                            form: {
                                data: {
                                    type: 'forms',
                                    id: Number(selectedCategory.forms[0].id),
                                },
                            },
                            ...(caseId
                                ? {
                                      parent: {
                                          data: {
                                              type: 'tickets',
                                              id: Number(caseId),
                                          },
                                      },
                                  }
                                : {}),
                        },
                    }),
            },
        };

        try {
            // determine which endpoint to use based on isEdit flag
            const endpoint =
                isEdit && id
                    ? `${API_BASE_URL}/${API_VERSION}/tickets/${Number(id)}`
                    : `${API_BASE_URL}/${API_VERSION}/tickets`;

            const method = isEdit ? HTTP.patch : HTTP.post;

            // Send the request and ignore the response
            await method(endpoint, finalFormData);

            // Success message based on the type of form submitted
            const msg = isEdit
                ? isCaseForm
                    ? 'snackbar.case-updated-successfully'
                    : 'snackbar.work-order-updated-successfully'
                : isCaseForm
                  ? 'snackbar.case-created-successfully'
                  : 'snackbar.work-order-created-successfully';

            // Show success message
            snackbar(t(msg), 'default', { horizontal: 'center', vertical: 'bottom' }, null);

            // Increment counter to trigger parent component refresh
            if (setNewCaseCount) {
                setNewCaseCount((prev) => prev + 1);
            }

            // Notify parent component that data was edited
            if (onDataEdited) {
                onDataEdited();
            }

            // Close the form
            onCancel();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error message
            snackbar(
                t('snackbar.common.error-on-update'),
                'error',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: number | string, resetForm?: boolean) => {
        const selectedCategory =
            categories.find((category) => category.id === Number(categoryId)) || null;

        if (selectedCategory && selectedCategory.forms && selectedCategory.forms[0]) {
            const formId = selectedCategory.forms[0].id;
            const dynamicForms = formList[formId].attributes.fields;

            setDynamicForms(dynamicForms);
            if (resetForm && setData) {
                setData({});
            }

            dynamicForms.forEach((formData: any) => {
                if (formData.type === 'priority') {
                    setPriorityInForm(true);
                }
            });
        }

        setSelectedCategory(selectedCategory);
    };
    useEffect(() => {
        if (typeof initialTabIndex !== 'undefined') {
            setCaseForm(tabValue === 0);
            setStandAloneWorkOrder(tabValue === 1);
        }
        getPriorities();
        getProperties();
        getStatus();
        setStores([]);
        setCategories([]);
        setSelectedProperty('');
        setSelectedStore('');
        setSelectedCategory(null);
        setSelectedPriority('');
        setSelectedStatus('');
        setSelectedAssignee('');
    }, [tabValue]);

    useEffect(() => {
        if (selectedProperty && ((isEdit && pageHasBeenLoaded) || !isEdit)) {
            getCategories(selectedProperty);
            getAssignees(selectedProperty);
            getStores(selectedProperty);
            // setSelectedPriority('');
        }

        if (isEdit && selectedProperty && !pageHasBeenLoaded) {
            setPageHasbeenLoaded(true);
        }
    }, [selectedProperty]);

    useEffect(() => {
        if (data && data.propertyId) {
            getCategories(data.propertyId);
            getAssignees(data.propertyId);
            getStores(data.propertyId);
        }
    }, []);

    useEffect(() => {
        if (!isEdit) {
            setStoreFieldTitle(selectedProperty ? '' : 'Select a property first');
            setCategoryFieldTitle(selectedProperty ? '' : 'Select a property first');
            // Dependent work order
            if (!isCaseForm && !isStandAloneWorkOrder) {
                setPropertyFieldTitle(
                    "Property can't be changed for 'Work Order' with parent 'Case'",
                );
            } else {
                setPropertyFieldTitle('');
            }
        }

        if (isEdit) {
            setPropertyFieldTitle("Property can't be changed in edit form");
            setStoreFieldTitle("Store can't be changed in edit form");
            setCategoryFieldTitle("Category can't be changed in edit form");
        }
    }, [selectedProperty, isEdit, isStandAloneWorkOrder, isCaseForm]);

    const getStores = async (property: string) => {
        try {
            setLoading(true);
            setSelectedStore('');
            const response = await HTTP.get(`
                ${API_BASE_URL}/${API_VERSION}/locals?filter[centreId]=${property}
                `);
            const storeData = response.data.data;
            if (Array.isArray(storeData)) {
                const transformedData: TransformedStore[] = storeData.map((item: Stores) => ({
                    id: Number(item.id),
                    name: item.attributes.name,
                }));
                setStores(transformedData);
            } else {
                console.error("Response data 'data' is not an array", storeData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Categories not fetch ', error);
            setLoading(false);
        }
    };

    const filterCategoryList = async (includedData: any, apiData: any) => {
        if (data?.parentId || isStandAloneWorkOrder) {
            const workCategoryUuids: any = [];
            apiData.forEach((categoryData: any) => {
                // For standalone work order, get all work order categories
                // For dependent work order, get work order categories under selected Case category
                if (categoryData.id === data?.parentCategoryId || isStandAloneWorkOrder) {
                    categoryData.relationships.config.data.forEach((categoryData: any) => {
                        if (categoryData.type === 'categoryConfig') {
                            workCategoryUuids.push(categoryData.id);
                        }
                    });
                }
            });

            let workCategoryIds: any = '';
            includedData.forEach((data: any) => {
                if (
                    data.type === 'categoryConfig' &&
                    workCategoryUuids.includes(data.id) &&
                    data.attributes.config_key === 'sub_ticket_categories'
                ) {
                    workCategoryIds +=
                        (workCategoryIds.length ? ',' : '') + data.attributes.config_value;
                }
            });

            if (!workCategoryIds) {
                return [];
            }
            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/categories` +
                    `?include=forms&filter[ids]=${workCategoryIds}`,
            );
            const categoryFormList: any = {};
            response.data.included.forEach((item: any) => {
                if (item.type === 'forms') {
                    categoryFormList[item.id] = item;
                }
            });
            setFormList(categoryFormList);
            return response.data.data;
        }
        const categoryFormList: any = {};
        includedData.forEach((item: any) => {
            if (item.type === 'forms') {
                categoryFormList[item.id] = item;
            }
        });
        setFormList(categoryFormList);

        const caseCategoryIds: any = [];
        includedData.forEach((data: any) => {
            if (
                data.type === 'categoryConfig' &&
                data.attributes.config_key === 'allow_sub_tickets'
            ) {
                caseCategoryIds.push(data.id);
            }
        });

        return apiData.filter((data: any) => {
            let isCaseCategory = false;
            data.relationships.config.data.forEach((configData: any) => {
                if (caseCategoryIds.includes(configData.id)) {
                    isCaseCategory = true;
                }
            });
            return isCaseCategory;
        });
    };

    const getCategories = async (propertyId: string) => {
        try {
            setLoading(true);
            setSelectedCategory(null);
            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/categories` +
                    `?include=forms,config&filter[centreId]=${propertyId}&` +
                    `filter[config][key]=allow_sub_tickets`,
            );

            const includedData = response.data.included;

            const categoriesData = await filterCategoryList(includedData, response.data.data);

            if (Array.isArray(categoriesData)) {
                const transformedData: TransformedCategory[] = categoriesData.map(
                    (item: TransCategory) => {
                        if (item.relationships.forms.data.length > 0) {
                            return {
                                id: Number(item.id),
                                name: item.attributes.name,
                                forms: item.relationships.forms.data,
                            };
                        }
                        return {
                            id: Number(item.id),
                            name: item.attributes.name,
                        };
                    },
                );

                const filteredData = transformedData.filter(
                    (category) => category.forms && category.forms.length > 0,
                );

                setCategories(filteredData);
            } else {
                console.error("Response data 'data' is not an array", categoriesData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Categories not fetch ', error);
            setLoading(false);
        }
    };
    const getPriorities = () => {
        // api here... to fetch priorities of store
        setPriorities([
            { id: 4, name: 'Urgent' },
            { id: 3, name: 'High' },
            { id: 2, name: 'Medium' },
            { id: 1, name: 'Low' },
        ]);
    };

    const getProperties = async () => {
        try {
            setLoading(true);
            const response = await fetchCentresList();
            const centresData = response.data;
            if (Array.isArray(centresData)) {
                const transformedData: TransformedCentres[] = centresData.map(
                    (item: CentreData) => ({
                        id: Number(item.id),
                        name: item.attributes.name,
                    }),
                );
                setProperties(transformedData);
            } else {
                console.error("Response data 'data' is not an array", centresData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Categories not fetch ', error);
            setLoading(false);
        }
    };

    const getAssignees = async (propertyId: string) => {
        try {
            setLoading(true);
            setSelectedAssignee('');
            const response = await HTTP.get(`
                ${API_BASE_URL}/${API_VERSION}/users?filter[centreId]=${propertyId}
                `);
            const propertyData = response.data.data;
            if (Array.isArray(propertyData)) {
                const transformedData: TransformedUsers[] = propertyData.map((item: Users) => ({
                    id: Number(item.id),
                    name: item.attributes.name,
                }));
                setAssignees(transformedData);
            } else {
                console.error("Response data 'data' is not an array", propertyData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Users not fetch ', error);
            setLoading(false);
        }
    };
    const getStatus = async () => {
        try {
            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/tickets/statuses`);
            const statusData = response.data;
            const statusList = statusData.data.map((item: PropertyStatus) => {
                return {
                    id: item.attributes.slug,
                    name: item.attributes.label,
                };
            });
            setStatusList(id ? statusList : statusList.slice(0, 2));
        } catch (err) {
            console.log('Error in status API call', err);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        console.log('Handle tab nave : ', event, newValue);
    };

    const tabStyles = (value: boolean) => {
        return {
            backgroundColor: value ? 'grey.300' : 'transparent',
            '&:hover': {
                backgroundColor: 'grey.400',
            },
            fontWeight: 'bold',
        };
    };

    return (
        <Container maxWidth="sm">
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '30px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    mb: 2,
                    mx: -5,
                    backgroundColor: 'white',
                    padding: 2,
                    borderBottom: '1px solid #ddd',
                }}
            >
                <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px', mx: 2 }}>
                    {isCaseForm && !isEdit && t('cases.create-new-case')}
                    {!isCaseForm && !isEdit && t('cases.create-new-work-order')}
                    {isEdit && t('cases.edit-details')}
                </Typography>
                <IconButton edge="end" sx={{ mx: 2 }} color="inherit" onClick={() => onCancel()}>
                    <Close />
                </IconButton>
            </Box>
            <form onSubmit={submitForm}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        {hastabs && !isEdit && (
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="inherit"
                                sx={{
                                    color: 'black',
                                    pb: 2,
                                }}
                            >
                                <Tab sx={tabStyles(isCaseForm)} label={t('cases.case')} />
                                <Tab sx={tabStyles(!isCaseForm)} label={t('cases.work-order')} />
                            </Tabs>
                        )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}></Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="property-name-label">{t('cases.property')}</InputLabel>
                            <Select
                                labelId="property-select"
                                value={selectedProperty}
                                label={t('cases.property')}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                name="property"
                                title={propertyFieldTitle}
                                // Make field 'read only' for edit form and dependent work order
                                readOnly={isEdit || (!isCaseForm && !isStandAloneWorkOrder)}
                            >
                                {properties.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="store-name-label">{t('cases.store')}</InputLabel>
                            <Select
                                labelId="store-select"
                                value={selectedStore}
                                label={t('cases.store')}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                title={storeFieldTitle}
                                name="store"
                                required={true}
                                readOnly={!selectedProperty ? true : false}
                            >
                                {stores.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="category-name-label">{t('cases.category')}</InputLabel>
                            <Select
                                labelId="category-select"
                                value={selectedCategory?.id || ''}
                                label={t('cases.category')}
                                onChange={(e) => handleCategoryChange(e.target.value, true)}
                                required={true}
                                readOnly={isEdit || !selectedProperty}
                                title={categoryFieldTitle}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {selectedCategory && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-name-label">
                                        {t('cases.status')}
                                    </InputLabel>
                                    <Select
                                        labelId="status-name-label"
                                        value={selectedStatus}
                                        label={t('cases.status')}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        name="status"
                                        required={true}
                                    >
                                        {statusList.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <FormCreator
                                    formData={dynamicForms}
                                    centreConfig={{
                                        default_currency_symbol: '',
                                        default_currency_divider: '',
                                    }}
                                    currentData={data} // You can pass actual data here
                                    setUpdatedFormValues={setUpdatedFormValues}
                                    centreId={Number(selectedProperty)}
                                    onSubmit={(formData: any) => {
                                        console.log('Form Submitted:', formData);
                                    }}
                                    hasSubmit={false}
                                    setFileUploading={setFileUploading}
                                />
                            </Grid>
                            {/* This field will be used in future, as part of ticket fields  */}
                            {/* <Grid size={{ xs: 12, sm: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label={t('cases.due-date')}
                                        value={dueDate}
                                        format="dd/MM/yyyy"
                                        onChange={(newValue) => setDueDate(newValue)}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            */}
                            {hasPriorityInForm && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="priority-name-label">
                                            {t('cases.priority')}
                                        </InputLabel>
                                        <Select
                                            labelId="priority-select"
                                            value={selectedPriority}
                                            label={t('cases.priority')}
                                            onChange={(e) => setSelectedPriority(e.target.value)}
                                            name="priority"
                                        >
                                            {priorities.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    <img
                                                        alt=""
                                                        style={{ paddingRight: '5px' }}
                                                        src={priorityIconPath(item.name)}
                                                    />
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="assignee-name-label">
                                        {t('cases.assignee')}
                                    </InputLabel>
                                    <Select
                                        labelId="assignee-select"
                                        value={selectedAssignee}
                                        label={t('cases.assignee')}
                                        onChange={(e) => setSelectedAssignee(e.target.value)}
                                        name="assignee"
                                        required={true}
                                    >
                                        {assignees.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                <Stack direction="row">
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            mr: 1,
                                                            fontSize: 10,
                                                            fontWeight: 800,
                                                            color: 'black',
                                                        }}
                                                    >
                                                        {getAvatarInitials(item.name)}
                                                    </Avatar>
                                                    {item.name}
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}> </Grid>
                        </>
                    )}

                    {!selectedCategory?.id && (
                        <Grid size={{ xs: 12 }}>
                            <div style={{ height: '380px' }} />
                        </Grid>
                    )}

                    {/* Divider before Buttons */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2, mx: -5 }} />
                    </Grid>

                    {/* Submit and Cancel Buttons */}
                    <Grid size={{ xs: 12 }} sx={{ mb: 2 }} textAlign="right">
                        <Button variant="outlined" sx={{ marginRight: 2 }} onClick={onCancel}>
                            {t('cases.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            disabled={isFileUploading}
                            sx={{ marginRight: 2 }}
                            type="submit"
                        >
                            {isEdit ? t('buttons.update') : t('buttons.create')}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CreateForm;
