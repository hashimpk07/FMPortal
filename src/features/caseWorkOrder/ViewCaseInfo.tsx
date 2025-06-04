import React, { useState, useEffect } from 'react';

import {
    Button,
    IconButton,
    Box,
    Typography,
    Divider,
    Select,
    MenuItem,
    Avatar,
    FormControl,
    Container,
    InputLabel,
    Stack,
    Drawer,
    Backdrop,
    CircularProgress,
    Chip,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { Close } from '@mui/icons-material';
import { format } from 'date-fns';
import HTTP from '../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../constants';
import CreateForm from './CreateForm';
import FormCreator from '../../components/MUIFormBuilder/FormCreator';
import snackbar from '../../utils/ts/helper/snackbar';
import CommentsSection from '../../components/common/CommentsSection';
import { getAvatarInitials } from '../../utils/ts/helper/textFormatter';

interface Profile {
    id: string;
    type: string;
    attributes: {
        name: string;
        email: string;
    };
}

interface ViewCaseInfoProps {
    caseInfo: any;
    onEditCase?: () => void;
    onClose?: () => void;
    setNewCaseCount?: React.Dispatch<React.SetStateAction<number>>;
    newCaseCount?: number;
    onDataEdited?: () => void;
}
interface Status {
    id: string;
    type: string;
    attributes: {
        label: string;
        slug: string;
    };
}
interface StatusListProps {
    id: string;
    name: string;
}
const ViewCaseInfo: React.FC<ViewCaseInfoProps> = ({
    caseInfo,
    onEditCase,
    onClose,
    setNewCaseCount,
    newCaseCount,
    onDataEdited,
}) => {
    const { t } = useTranslation();

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<
        {
            id: string;
            avatar: string;
            username: string;
            createdBy: string;
            visibility: string;
            text: string;
        }[]
    >([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedVisibilityStatus, setSelectedVisibilityStatus] = useState('internal');
    const [visibilityStatuses] = useState([
        { id: 'internal', name: 'Internal' },
        { id: 'public', name: 'Public' },
    ]);
    const [statuses, setStatusList] = useState<StatusListProps[]>([]);

    const [caseDataFromApi, setCaseDataFromApi] = useState<any>({});
    const [showEditModal, setEditModal] = useState(false);
    const [dynamicForms, setDynamicForms] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showAddWrkOrderModal, setAddWrkOrderModal] = useState(false);
    const [priorities] = useState([
        { value: '4', label: 'Urgent', imgSrc: '/assets/images/urgent.svg' },
        { value: '3', label: 'High', imgSrc: '/assets/images/high.svg' },
        { value: '2', label: 'Medium', imgSrc: '/assets/images/medium.svg' },
        { value: '1', label: 'Low', imgSrc: '/assets/images/low.svg' },
    ]);
    const [selectedPriority, setSelectedPriority] = useState('');
    const [hasPriorityInForm, setPriorityInForm] = useState(false);
    const [hasWorkOrderCategories, setWorkOrderCategories] = useState(false);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const fetchComments = async () => {
        try {
            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/tickets/${caseInfo.id}/comments?include=createdBy`,
            );
            const commentData = response.data;

            const attributesArray = commentData.data.map((item: any) => {
                const user = commentData.included.find(
                    (profile: Profile) => profile.id === item.relationships.createdBy.data.id,
                );
                const formattedDate = format(
                    new Date(item.attributes.createdAt),
                    'dd MMMM yyyy H:MM',
                );
                const visibility = item.attributes.is_internal
                    ? t('cases.comment_internal')
                    : t('cases.comment_public');

                return {
                    id: item.id,
                    avatar: user ? user.attributes.name : 'Unknown',
                    username: user ? user.attributes.name : 'Unknown',
                    createdBy: formattedDate,
                    visibility: visibility,
                    text: item.attributes.comment,
                };
            });
            setComments(attributesArray);
        } catch (err) {
            console.log('Error in document landing page API', err);
        }
    };
    const getStatus = async () => {
        try {
            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/tickets/statuses`);
            const statusData = response.data;
            const attributesArray = statusData.data.map((item: Status) => {
                return {
                    id: item.attributes.slug,
                    name: item.attributes.label,
                };
            });
            setStatusList(attributesArray);
        } catch (err) {
            console.log('Error in status API call', err);
        }
    };

    useEffect(() => {
        getStatus();
        fetchComments();
    }, []);

    const handleCommentSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        try {
            const response = await HTTP.post(
                `${API_BASE_URL}/${API_VERSION}/tickets/${caseInfo.id}/comments`,
                {
                    data: {
                        type: 'ticketComments',
                        attributes: {
                            comment: comment,
                            is_internal: selectedVisibilityStatus === 'internal',
                        },
                    },
                },
            );
            const status = response.status;
            setComment('');

            if (status === 204) {
                snackbar(
                    caseInfo.parentId
                        ? t('snackbar.work-order-comment-added-successfully')
                        : t('snackbar.case-comment-added-successfully'),
                    'default',
                    { horizontal: 'center', vertical: 'bottom' },
                    null,
                );
                fetchComments();
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleCommentCancel = () => {
        setComment('');
    };

    useEffect(() => {
        const checkWorkOrderCategories = async () => {
            const response = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/categories?include=config&` +
                    `filter[ids]=${caseInfo.categoryId}&filter[config][key]=allow_sub_tickets`,
            );

            const data = response.data.data;
            const included = response.data.included;

            const categoryUuids: string[] = [];

            data.forEach((categoryData: any) => {
                const idList = categoryData?.relationships?.config?.data;
                if (idList) {
                    idList.forEach((list: any) => {
                        if (list.type === 'categoryConfig') {
                            categoryUuids.push(list.id);
                        }
                    });
                }
            });

            let categoryIds = '';
            if (included) {
                included.forEach((data: any) => {
                    if (
                        data.type === 'categoryConfig' &&
                        categoryUuids.includes(data.id) &&
                        data.attributes.config_key === 'sub_ticket_categories'
                    ) {
                        categoryIds +=
                            (categoryIds.length ? ',' : '') + data.attributes.config_value;
                    }
                });
            }

            setWorkOrderCategories(categoryIds.length > 0);
        };
        checkWorkOrderCategories();
    }, []);

    useEffect(() => {
        const getCaseWorkDetails = async () => {
            const {
                data: {
                    data: { attributes },
                    included,
                },
            } = await HTTP.get(
                `${API_BASE_URL}/${API_VERSION}/tickets/${caseInfo.id}` +
                    `?include=form,centre,local,assignedTo,category`,
            );

            if (included) {
                included.forEach((data: any) => {
                    if (data.type === 'forms') {
                        setDynamicForms(data.attributes.fields);
                        data.attributes.fields.forEach((info: any) => {
                            if (info.type === 'priority') {
                                setPriorityInForm(true);
                            }
                        });
                    }
                    if (data.type === 'centres') {
                        attributes.data.property = data.attributes.name;
                        attributes.data.propertyId = data.id;
                    }
                    if (data.type === 'locals') {
                        attributes.data.store = data.attributes.name;
                        attributes.data.storeId = data.id;
                    }
                    if (data.type === 'profiles') {
                        attributes.data.assignee = data.attributes.name;
                        attributes.data.assigneeId = data.id;
                    }
                    if (data.type === 'categories') {
                        attributes.data.category = data.attributes.name;
                        attributes.data.categoryId = data.id;
                    }
                });
            }
            attributes.data.status = attributes.status.slug;

            if ('reserved_priority' in attributes.data) {
                setSelectedPriority(attributes.data.reserved_priority);
            }
            setCaseDataFromApi(attributes.data || {});
            setSelectedStatus(attributes.status.slug);
        };

        getCaseWorkDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newCaseCount]);

    const updateStatus = async (status: string) => {
        const finalFormData = {
            data: {
                type: 'tickets',
                attributes: {
                    data: caseDataFromApi,
                    status: status,
                },
            },
        };
        try {
            await HTTP.patch(
                `${API_BASE_URL}/${API_VERSION}/tickets/${caseInfo.id}`,
                finalFormData,
            );

            setSelectedStatus(status);
            snackbar(
                caseInfo.parentId
                    ? t('snackbar.work-order-updated-successfully')
                    : t('snackbar.case-updated-successfully'),
                'default',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );

            // Call setNewCaseCount to trigger a data refresh
            if (setNewCaseCount) {
                setNewCaseCount((prevCount) => prevCount + 1);
            }

            // Notify parent component that data was edited
            if (onDataEdited) {
                onDataEdited();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    console.log('-case---------', caseInfo);

    const updatePriority = async (priority: string) => {
        const finalFormData = {
            data: {
                type: 'tickets',
                attributes: {
                    data: {
                        ...caseDataFromApi,
                        reserved_priority: priority,
                    },
                    status: selectedStatus,
                },
            },
        };
        setSelectedPriority(priority);
        const response = await HTTP.patch(
            `${API_BASE_URL}/${API_VERSION}/tickets/${caseInfo.id}`,
            finalFormData,
        );

        if (response.data.data.id) {
            snackbar(
                caseInfo.parentId
                    ? t('snackbar.work-order-priority-updated-successfully')
                    : t('snackbar.case-priority-updated-successfully'),
                'default',
                { horizontal: 'center', vertical: 'bottom' },
                null,
            );
            if (setNewCaseCount) {
                setNewCaseCount((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        if (Object.keys(caseDataFromApi).length && dynamicForms.length) {
            setLoading(false);
        }
    }, [caseDataFromApi, dynamicForms, comments]);

    return (
        <>
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <Container maxWidth="sm">
                <Box>
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
                            {caseInfo.title}
                        </Typography>
                        <IconButton sx={{ mx: 2 }} edge="end" color="inherit" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid size={{ sm: 12 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                {hasWorkOrderCategories && (
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        startIcon={<Add />}
                                        onClick={() => setAddWrkOrderModal(true)}
                                        sx={{
                                            height: '40px',
                                            backgroundColor: '#F5F5F5',
                                            width: 'auto',
                                            borderRadius: '8px',
                                            color: 'black',
                                        }}
                                    >
                                        {t('buttons.add-work-order')}
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditModal(true)}
                                    sx={{
                                        height: '40px',
                                        backgroundColor: '#F5F5F5',
                                        width: 'auto',
                                        borderRadius: '8px',
                                        color: 'black',
                                    }}
                                >
                                    {t('buttons.edit-work-order')}
                                </Button>

                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                {t('select.case-work-category')}
                            </Typography>
                            <Box sx={{ marginBottom: '1px' }} />
                            <Typography variant="h6" component="span" sx={{ fontSize: '1rem' }}>
                                {caseDataFromApi.category}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="status-name-label">{t('common.status')}</InputLabel>
                                <Select
                                    id="status-name-label"
                                    label={t('common.status')}
                                    value={selectedStatus}
                                    onChange={(e) => updateStatus(e.target.value)}
                                >
                                    {statuses.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <FormCreator
                                formData={dynamicForms}
                                centreConfig={{
                                    default_currency_symbol: '',
                                    default_currency_divider: '',
                                }}
                                currentData={caseDataFromApi} // You can pass actual data here
                                centreId={1}
                                onSubmit={(formData: any) => {
                                    console.log('Form Submitted:', formData);
                                }}
                                hasSubmit={false}
                                showDetails={true}
                            />
                        </Grid>

                        {hasPriorityInForm && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="priority-name-label">
                                            {t('common.priority')}
                                        </InputLabel>
                                        <Select
                                            id="priority-name-label"
                                            label={t('common.priority')}
                                            value={selectedPriority}
                                            onChange={(e) => updatePriority(e.target.value)}
                                            displayEmpty
                                        >
                                            {priorities.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    <Stack direction={'row'} spacing={1}>
                                                        <img src={option.imgSrc} alt="" />
                                                        <span> {option.label} </span>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                {t('select.case-work-property')}
                            </Typography>
                            <Typography>{caseDataFromApi.property}</Typography>
                        </Grid>

                        {/* Right Column */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                {t('select.case-work-store')}
                            </Typography>
                            <Typography>{caseDataFromApi.store}</Typography>
                        </Grid>

                        {/* Left Column */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                {t('select.case-work-assigne')}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        mr: 1,
                                        fontSize: 14,
                                        fontWeight: 800,
                                        color: 'black',
                                    }}
                                >
                                    {getAvatarInitials(caseDataFromApi.assignee)}
                                </Avatar>
                                <Typography>{caseDataFromApi.assignee}</Typography>
                            </Box>
                        </Grid>

                        {/* Right Column */}
                        <Grid size={{ xs: 12, sm: 6 }}></Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ mx: -5 }} />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <CommentsSection
                            comments={[]}
                            comment={comment}
                            onCommentChange={handleCommentChange}
                            onCommentSubmit={handleCommentSubmit}
                            onCommentCancel={handleCommentCancel}
                            loading={isLoading}
                            error={''}
                            showVisibility={true}
                            visibilityValue={selectedVisibilityStatus}
                            onVisibilityChange={(e: any) =>
                                setSelectedVisibilityStatus(e.target.value as string)
                            }
                            visibilityOptions={visibilityStatuses.map((v) => ({
                                id: v.id,
                                name: v.name,
                                icon: null,
                            }))}
                            inputPlaceholder="Add a comment..."
                            submitLabel={t('buttons.save')}
                            cancelLabel={t('buttons.cancel')}
                        />
                    </Box>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ mx: -1 }} />
                    </Grid>

                    <Box>
                        {comments.map((comment) => (
                            <Box
                                key={comment.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 2,
                                    marginTop: 2,
                                }}
                            >
                                <Avatar
                                    sx={{ width: 40, height: 40, marginRight: 2 }}
                                    src={comment.avatar}
                                >
                                    {getAvatarInitials(comment.username)}
                                </Avatar>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{ marginRight: 2 }}
                                        >
                                            {comment.username}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ marginRight: 2 }}>
                                            {comment.createdBy}
                                        </Typography>

                                        <Chip sx={{ fontWeight: 800 }} label={comment.visibility} />
                                    </Box>

                                    <Typography variant="body1">{comment.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>

            <Drawer
                anchor="right"
                open={showEditModal}
                onClose={onEditCase}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                {showEditModal && (
                    <CreateForm
                        hastabs={false}
                        isEdit={true}
                        onCancel={() => setEditModal(false)}
                        data={{
                            ...caseDataFromApi,
                            parentCategoryId: caseInfo.parentCategoryId,
                            parentId: caseInfo.parentId,
                        }}
                        setData={setCaseDataFromApi}
                        id={caseInfo.id}
                        caseId={caseInfo.id}
                        setNewCaseCount={setNewCaseCount}
                    />
                )}
            </Drawer>

            <Drawer
                anchor="right"
                open={showAddWrkOrderModal}
                onClose={onEditCase}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                {showAddWrkOrderModal && (
                    <CreateForm
                        hastabs={false}
                        isEdit={false}
                        onCancel={() => setAddWrkOrderModal(false)}
                        data={{
                            centreId: caseDataFromApi.propertyId,
                            parentCategoryId: caseDataFromApi.categoryId,
                            parentId: caseInfo.id,
                        }}
                        caseId={caseInfo.id}
                        setNewCaseCount={setNewCaseCount}
                    />
                )}
            </Drawer>
        </>
    );
};

export default ViewCaseInfo;
