import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Typography,
    CircularProgress,
    Stack,
    Alert,
    Backdrop,
    Divider,
    Avatar,
    SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import HTTP from '../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../constants';
import useAssetManagementStore from '../store/assetManagementStore';
import {
    categoryService,
    fetchAssignableUsers,
    fetchWorkOrderStatuses,
    Status,
    Assignee,
} from '../services/workOrders';
import { Category } from '../services/workOrders/categoryService';

interface WorkOrderCreateFormProps {
    assetId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

interface FormData {
    title: string;
    details: string;
    priority: string;
    dueDate: string;
    categoryId: string;
    assigneeId: string;
    status: string;
    contactEmail: string;
    contactPhone: string;
}

const WorkOrderCreateForm: React.FC<WorkOrderCreateFormProps> = ({
    assetId,
    onSuccess,
    onCancel,
}) => {
    const { t } = useTranslation();
    const { selectedAssetDetails } = useAssetManagementStore();
    const { selectedCentreId } = useAssetManagementStore.getState();
    const assetData = selectedAssetDetails?.data;

    // Set initial form data
    const [formData, setFormData] = useState<FormData>({
        title: '',
        details: '',
        priority: '',
        dueDate: '',
        categoryId: '',
        assigneeId: '',
        status: 'open',
        contactEmail: '',
        contactPhone: '',
    });

    // Form state
    const [categories, setCategories] = useState<Category[]>([]);
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [statusList, setStatusList] = useState<Status[]>([]);
    const [includeMap, setIncludeMap] = useState<Record<string, any>>({});

    // UI state
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation
    const [errors, setErrors] = useState({
        title: '',
        details: '',
        priority: '',
        dueDate: '',
        categoryId: '',
        assigneeId: '',
    });

    // Priorities for work orders
    const priorities = [
        { id: 4, name: t('asset.priority.urgent') },
        { id: 3, name: t('priority.high') },
        { id: 2, name: t('priority.medium') },
        { id: 1, name: t('priority.low') },
    ];

    // Initial loading of data
    useEffect(() => {
        fetchCategories(String(selectedCentreId));
        fetchAssignees(String(selectedCentreId));
        fetchStatuses();
    }, []);

    // Category selection effects
    useEffect(() => {
        if (formData.categoryId && includeMap) {
            const selectedCategory = categories.find(
                (category) => category.id === formData.categoryId,
            );

            if (
                selectedCategory &&
                selectedCategory.relationships &&
                selectedCategory.relationships.forms &&
                selectedCategory.relationships.forms.data.length > 0
            ) {
                const formId = selectedCategory.relationships.forms.data[0].id;
                const formData = includeMap[formId];

                if (formData && formData.attributes && formData.attributes.fields) {
                    // We can save it for later use if needed, but not using it directly now
                    // We don't need to track it if not using it
                }
            }
        }
    }, [formData.categoryId, categories, includeMap]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData({
                ...formData,
                [name]: value,
            });

            // Clear validation error when field is edited
            if (errors[name as keyof typeof errors]) {
                setErrors({
                    ...errors,
                    [name]: '',
                });
            }
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (name) {
            setFormData({
                ...formData,
                [name]: value,
            });

            // Clear validation error when field is edited
            if (errors[name as keyof typeof errors]) {
                setErrors({
                    ...errors,
                    [name]: '',
                });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors = {
            title: !formData.title ? t('validation.title-required') : '',
            details: !formData.details ? t('validation.details-required') : '',
            priority: !formData.priority ? t('validation.priority-required') : '',
            dueDate: !formData.dueDate ? t('validation.due-date-required') : '',
            categoryId: !formData.categoryId ? t('validation.category-required') : '',
            assigneeId: !formData.assigneeId ? t('validation.assignee-required') : '',
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Get the storeId from the asset data - use type assertion for missing properties
            const storeId = (assetData?.relationships as any)?.local?.data?.id;

            // Build the payload
            const payload = {
                data: {
                    type: 'tickets',
                    attributes: {
                        data: {
                            title: formData.title,
                            details: formData.details,
                            reserved_priority: formData.priority,
                            reserved_due_date: formData.dueDate,
                            contactEmail: formData.contactEmail,
                            contactPhone: formData.contactPhone,
                        },
                        status: formData.status,
                    },
                    relationships: {
                        assignedTo: {
                            data: {
                                type: 'profiles',
                                id: Number(formData.assigneeId),
                            },
                        },
                        local: {
                            data: {
                                type: 'localOrgs',
                                id: storeId,
                            },
                        },
                        form: {
                            data: {
                                type: 'forms',
                                id: Number(formData.categoryId),
                            },
                        },
                        asset: {
                            data: {
                                type: 'assets',
                                id: assetId,
                            },
                        },
                    },
                },
            };

            const response = await HTTP.post(`${API_BASE_URL}/${API_VERSION}/tickets`, payload);

            if (response.status === 201 || response.status === 200) {
                onSuccess();
            } else {
                throw new Error(
                    t('errors.failed-to-create-work-order', 'Failed to create work order'),
                );
            }
        } catch (err) {
            console.error('Error creating work order:', err);
            setError(
                t(
                    'errors.failed-to-create-work-order',
                    'Failed to create work order. Please try again.',
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Data fetching functions using our service modules
    const fetchCategories = async (centreId: string) => {
        try {
            setLoading(true);
            const response = await categoryService.fetchWorkOrderCategories(centreId);

            // Process the included data
            const includeData: Record<string, any> = {};
            if (response.included) {
                response.included.forEach((item) => {
                    includeData[item.id] = item;
                });
            }

            setIncludeMap(includeData);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Categories not fetched', error);
            setError(t('errors.failed-to-fetch-categories', 'Failed to fetch categories'));
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignees = async (centreId: string) => {
        try {
            setLoading(true);
            const assigneesList = await fetchAssignableUsers(centreId);
            setAssignees(assigneesList);
        } catch (error) {
            console.error('Assignees not fetched', error);
            setError(t('errors.failed-to-fetch-assignees', 'Failed to fetch assignees'));
        } finally {
            setLoading(false);
        }
    };

    const fetchStatuses = async () => {
        try {
            const statusList = await fetchWorkOrderStatuses();

            // Only include open and in progress statuses for new work orders
            setStatusList(statusList.slice(0, 2));

            // Set default status to open
            setFormData((prev) => ({
                ...prev,
                status: statusList[0]?.id || 'open',
            }));
        } catch (error) {
            console.error('Error in status API call', error);
            setError(t('errors.failed-to-fetch-statuses', 'Failed to fetch statuses'));
        }
    };

    // Get avatar initials for assignee display
    const getAvatarInitials = (value: string) => {
        const names = value.toUpperCase().split(' ');
        if (names.length >= 2) {
            return `${names[0].charAt(0)}${names[1].charAt(0)}`;
        }
        return names[0].charAt(0);
    };

    if (loading && !isSubmitting) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Display store and centre information from asset details
    // const storeName =
    //     (assetData?.relationships as any)?.local?.data?.attributes?.name ||
    //     (assetData as any)?.included?.find(
    //         (item: any) =>
    //             item.type === 'localOrgs' &&
    //             item.id === (assetData?.relationships as any)?.local?.data?.id,
    //     )?.attributes?.name ||
    //     t('asset.unknown', 'Unknown');

    // const centreName =
    //     (assetData?.relationships?.centre?.data as any)?.attributes?.name ||
    //     (assetData as any)?.included?.find(
    //         (item: any) =>
    //             item.type === 'centres' && item.id === assetData?.relationships?.centre?.data?.id,
    //     )?.attributes?.name ||
    //     t('asset.unknown', 'Unknown');

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isSubmitting && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isSubmitting}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress color="inherit" />
                        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                            {t('asset.applying-changes')}
                        </Typography>
                    </Box>
                </Backdrop>
            )}

            <Grid container spacing={3}>
                {/* Display Property and Store information */}
                {/* <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {t('asset.property')}
                    </Typography>
                    <Typography variant="body1">{centreName}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {t('asset.store')}
                    </Typography>
                    <Typography variant="body1">{storeName}</Typography>
                </Grid> */}

                {/* Category Section - Select box always visible */}
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.categoryId} required>
                        <InputLabel>{t('asset.category')}</InputLabel>
                        <Select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleSelectChange}
                            label={t('asset.category')}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.attributes.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
                    </FormControl>
                </Grid>

                {formData.categoryId && (
                    <>
                        {/* Title Section */}
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                label={t('common.title')}
                                fullWidth
                                value={formData.title}
                                onChange={handleChange}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Details Section */}
                        <Grid item xs={12}>
                            <TextField
                                name="details"
                                label={t('asset.details')}
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.details}
                                onChange={handleChange}
                                error={!!errors.details}
                                helperText={errors.details}
                                required
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Priority and Due Date Section */}
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                error={!!errors.priority}
                                required
                                disabled={isSubmitting}
                            >
                                <InputLabel>{t('asset.priority-label')}</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleSelectChange}
                                    label={t('asset.priority-label')}
                                >
                                    {priorities.map((priority) => (
                                        <MenuItem key={priority.id} value={priority.id}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 14,
                                                        height: 14,
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            priority.id === 4
                                                                ? '#FF5252'
                                                                : priority.id === 3
                                                                  ? '#FFA726'
                                                                  : priority.id === 2
                                                                    ? '#42A5F5'
                                                                    : '#66BB6A',
                                                        mr: 1,
                                                    }}
                                                />
                                                <Typography>{priority.name}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.priority && (
                                    <FormHelperText>{errors.priority}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dueDate"
                                label={t('asset.due-date')}
                                type="date"
                                fullWidth
                                value={formData.dueDate}
                                onChange={handleChange}
                                error={!!errors.dueDate}
                                helperText={errors.dueDate}
                                required
                                disabled={isSubmitting}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Status Section */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>{t('asset.status')}</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleSelectChange}
                                    label={t('asset.status')}
                                >
                                    {statusList.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Assignee Section */}
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                error={!!errors.assigneeId}
                                required
                                disabled={isSubmitting}
                            >
                                <InputLabel>{t('asset.assignee')}</InputLabel>
                                <Select
                                    name="assigneeId"
                                    value={formData.assigneeId}
                                    onChange={handleSelectChange}
                                    label={t('asset.assignee')}
                                >
                                    {assignees.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            <Stack direction="row" alignItems="center">
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
                                                    {getAvatarInitials(item.name.toString())}
                                                </Avatar>
                                                {item.name}
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.assigneeId && (
                                    <FormHelperText>{errors.assigneeId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Contact Email Field */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="contactEmail"
                                label={t('asset.contact-email')}
                                fullWidth
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Contact Phone Field */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="contactPhone"
                                label={t('asset.contact-phone-number')}
                                fullWidth
                                value={formData.contactPhone}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </Grid>
                    </>
                )}

                {!formData.categoryId && (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                height: '300px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                opacity: 0.6,
                            }}
                        >
                            <Typography variant="body1">
                                {t('asset.work-order-create-form.category-selection-required')}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={onCancel} variant="outlined" disabled={isSubmitting}>
                    {t('asset.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !formData.categoryId}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {t('buttons.create')}
                </Button>
            </Stack>
        </Box>
    );
};

export default WorkOrderCreateForm;
