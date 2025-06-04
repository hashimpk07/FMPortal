import React, { useState } from 'react';
import {
    Typography,
    Box,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Grid,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PublicIcon from '@mui/icons-material/Public';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import AssetDetailField from './AssetDetailField';
import type { WorkOrderData, FormattedComment } from '../services/workOrders';
import Avatar from '../../../components/common';
import useAuth from '../../../hooks/useAuth';

export interface WorkOrderDetailViewProps {
    workOrderData: WorkOrderData | null;
    isLoading?: boolean;
    error?: Error | null;
    comments?: FormattedComment[];
    commentsLoading?: boolean;
    commentsError?: Error | null;
    linkedInvoices?: string[];
    linkedDocuments?: string[];
    onCommentSubmit?: (comment: string, isInternal: boolean) => Promise<void>;
    readOnly?: boolean;
    titleOverride?: string;
}

function WorkOrderDetailView({
    workOrderData,
    isLoading = false,
    error = null,
    comments = [],
    commentsLoading = false,
    commentsError = null,
    linkedInvoices = [],
    linkedDocuments = [],
    onCommentSubmit,
    readOnly = false,
    titleOverride,
}: WorkOrderDetailViewProps) {
    const { t } = useTranslation();
    const [comment, setComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [selectedVisibilityStatus, setSelectedVisibilityStatus] = useState('internal');
    const { userDetails } = useAuth();
    const userName = userDetails?.attributes?.name || '';
    const userEmail = userDetails?.attributes?.email || '';

    // Common visibility status options
    const visibilityStatuses = [
        { id: 'internal', name: t('asset.visibility.internal') },
        { id: 'public', name: t('asset.visibility.public') },
    ];

    // Common priority options
    const priorities = [
        {
            value: '4',
            label: t('asset.priority.urgent'),
            imgSrc: '/assets/images/urgent.svg',
        },
        { value: '3', label: t('priority.high'), imgSrc: '/assets/images/high.svg' },
        { value: '2', label: t('priority.medium'), imgSrc: '/assets/images/medium.svg' },
        { value: '1', label: t('priority.low'), imgSrc: '/assets/images/low.svg' },
    ];

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!comment.trim()) {
            setCommentError(t('errors.comment-text-required', 'Comment text is required'));
            return;
        }

        if (!onCommentSubmit) {
            setCommentError(
                t('errors.comment-handler-missing', 'Unable to submit comment - handler missing'),
            );
            return;
        }

        setCommentError(null);
        setCommentSubmitting(true);
        try {
            await onCommentSubmit(comment, selectedVisibilityStatus === 'internal');
            setComment('');
        } catch (error) {
            setCommentError(
                error instanceof Error
                    ? error.message
                    : t('errors.failed-to-add-comment', 'Failed to add comment'),
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleCommentCancel = () => {
        setComment('');
    };

    // Extract and format the work order data for display
    const formattedData = workOrderData
        ? {
              id: workOrderData.id,
              title: workOrderData.attributes.data.title || '',
              description:
                  workOrderData.attributes.data.details ||
                  workOrderData.attributes.data.description ||
                  t('asset.no-description'),
              status: workOrderData.attributes.status?.slug || 'unknown',
              statusLabel:
                  workOrderData.attributes.status?.label ||
                  workOrderData.attributes.status?.slug ||
                  '',
              dueDate: workOrderData.attributes.data.reserved_due_date || '',
              priority: workOrderData.attributes.data.reserved_priority || '',
              contractor:
                  (workOrderData.attributes as any).contractor ||
                  (workOrderData.attributes.data as any).contractor ||
                  t('asset.not-assigned'),
              specialist:
                  (workOrderData.attributes as any).specialist ||
                  (workOrderData.attributes.data as any).specialist ||
                  t('asset.not-assigned'),
              createdBy: workOrderData.relationships?.createdBy?.data?.id || t('asset.unknown'),
              contact_email:
                  (workOrderData.attributes.data as any)?.contactEmail ||
                  (workOrderData.attributes as any).contact_email ||
                  t('asset.no-email'),
              contact_phone_number:
                  (workOrderData.attributes.data as any)?.contactPhone ||
                  (workOrderData.attributes as any).contact_phone_number ||
                  t('asset.no-phone'),
              createdAt: workOrderData.attributes.createdAt || '',
          }
        : null;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error.message || t('asset.work-order-not-found')}
            </Alert>
        );
    }

    if (!formattedData) {
        return (
            <Alert severity="warning" sx={{ my: 2 }}>
                {t('asset.work-order-not-found')}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* Only show title if titleOverride is provided (for selection modal details) */}
            {titleOverride && (
                <>
                    <Typography variant="h2" fontWeight={500} mb={2} component="div">
                        {titleOverride}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </>
            )}

            {/* Main Details Section */}
            <Grid container spacing={2} mb={3}>
                {/* First two fields */}
                <Grid item xs={12} md={6}>
                    <AssetDetailField label={t('asset.work-order')} value={formattedData.id} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <AssetDetailField
                        label={t('work-order.due-date')}
                        value={
                            formattedData.dueDate
                                ? DateTime.fromISO(formattedData.dueDate).toFormat('dd MMM yyyy')
                                : t('asset.not-set')
                        }
                    />
                </Grid>

                {/* Description full width */}
                <Grid item xs={12}>
                    <AssetDetailField
                        label={t('asset.description')}
                        value={formattedData.description}
                        fullWidth
                    />
                </Grid>

                {/* Remaining fields in two columns */}
                {[
                    {
                        label: t('asset.status'),
                        value: t(formattedData.statusLabel),
                    },
                    {
                        label: t('asset.priority-label'),
                        value: t(
                            priorities.find((p) => p.value === formattedData.priority)?.label ||
                                'asset.not-set',
                        ),
                    },
                    {
                        label: t('asset.contractor'),
                        value: t(formattedData.contractor),
                    },
                    {
                        label: t('asset.specialist'),
                        value: t(formattedData.specialist),
                    },
                    {
                        label: t('asset.contact-email'),
                        value: formattedData.contact_email,
                    },
                    {
                        label: t('asset.contact-phone-number'),
                        value: formattedData.contact_phone_number,
                    },
                    {
                        label: t('asset.date-created'),
                        value: formattedData.createdAt
                            ? DateTime.fromISO(formattedData.createdAt).toFormat('dd MMMM yyyy')
                            : '',
                    },
                ].map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <AssetDetailField label={field.label} value={field.value} />
                    </Grid>
                ))}
            </Grid>

            {/* Linked Invoices Section (full width) */}
            <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={500} mb={1} component="div">
                    {t('asset.linked-invoices')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {linkedInvoices.length > 0 ? (
                        linkedInvoices.map((invoice, index) => (
                            <Chip
                                key={index}
                                label={invoice}
                                clickable
                                onClick={() => {}}
                                icon={<OpenInNewOutlinedIcon sx={{ color: 'black' }} />}
                                sx={{ mb: 1, bgcolor: 'grey.100', fontWeight: 500 }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" component="div">
                            {t('asset.no-invoices-linked')}
                        </Typography>
                    )}
                </Stack>
            </Box>

            {/* Linked Documents Section (full width) */}
            <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={500} mb={1} component="div">
                    {t('asset.documents')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {linkedDocuments.length > 0 ? (
                        linkedDocuments.map((document, index) => (
                            <Chip
                                key={index}
                                label={document}
                                clickable
                                onClick={() => {}}
                                icon={<OpenInNewOutlinedIcon sx={{ color: 'black' }} />}
                                sx={{ mb: 1, bgcolor: 'grey.100', fontWeight: 500 }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" component="div">
                            {t('asset.no_documents')}
                        </Typography>
                    )}
                </Stack>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={1} component="div">
                    {t('select.case-comments')}
                </Typography>
                {!readOnly && (
                    <Box component="form" onSubmit={handleCommentSubmit} mb={2}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar name={userName} email={userEmail} size={40} />
                            <Box sx={{ flex: 1 }}>
                                {commentError && (
                                    <Alert
                                        severity="error"
                                        sx={{ mb: 2 }}
                                        onClose={() => setCommentError(null)}
                                    >
                                        {commentError}
                                    </Alert>
                                )}
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder={t('asset.add-comment-placeholder')}
                                    value={comment}
                                    required
                                    onChange={handleCommentChange}
                                    disabled={commentSubmitting}
                                    sx={{ mb: 2.5, bgcolor: 'white', borderRadius: 1 }}
                                />
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={commentSubmitting || !onCommentSubmit}
                                            sx={{
                                                minWidth: 80,
                                                fontSize: 15,
                                                py: 1,
                                                px: 2,
                                            }}
                                        >
                                            {t('buttons.save')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleCommentCancel}
                                            disabled={commentSubmitting}
                                            sx={{
                                                minWidth: 80,
                                                fontSize: 15,
                                                py: 1,
                                                px: 2,
                                            }}
                                        >
                                            {t('buttons.cancel')}
                                        </Button>
                                    </Stack>
                                    <FormControl sx={{ minWidth: 110 }}>
                                        <InputLabel id="visibility-label">
                                            {t('asset.visibility-label')}
                                        </InputLabel>
                                        <Select
                                            id="visibility-select"
                                            labelId="visibility-label"
                                            value={selectedVisibilityStatus}
                                            onChange={(e) =>
                                                setSelectedVisibilityStatus(e.target.value)
                                            }
                                            label={t('asset.visibility-label')}
                                            disabled={commentSubmitting}
                                        >
                                            {visibilityStatuses.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        {option.id === 'internal' ? (
                                                            <LockIcon fontSize="small" />
                                                        ) : option.id === 'public' ? (
                                                            <PublicIcon fontSize="small" />
                                                        ) : null}
                                                        <span>{option.name}</span>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                )}
                <Divider sx={{ my: 1 }} />
                {commentsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={22} />
                    </Box>
                ) : commentsError ? (
                    <Alert severity="error" sx={{ my: 1 }}>
                        {commentsError.message}
                    </Alert>
                ) : comments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" component="div">
                        {t('asset.no-comments-yet')}
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {[...comments].reverse().map((comment, idx) => (
                            <React.Fragment key={comment.id}>
                                <Stack direction="row" alignItems="flex-start" spacing={2} py={1}>
                                    <Avatar
                                        name={comment.username}
                                        email={comment.email}
                                        size={40}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1.5}
                                            mb={0.5}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={700}
                                                sx={{ mr: 1 }}
                                                component="div"
                                            >
                                                {comment.username}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                component="div"
                                            >
                                                {comment.createdBy}
                                            </Typography>
                                            <Chip
                                                label={comment.visibility}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    ml: 1,
                                                    fontWeight: 500,
                                                }}
                                            />
                                            {comment.visibility === t('asset.internal') && (
                                                <Button
                                                    size="small"
                                                    color="inherit"
                                                    sx={{
                                                        ml: 1,
                                                        textTransform: 'none',
                                                        fontWeight: 400,
                                                        fontSize: 13,
                                                        p: 0,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                lineHeight: 1.5,
                                            }}
                                            component="div"
                                        >
                                            {comment.text}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {idx < comments.length - 1 && <Divider sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
}

export default WorkOrderDetailView;
