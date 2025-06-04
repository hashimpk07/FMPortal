import { useState, useEffect } from 'react';
import { Box, IconButton, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import {
    fetchWorkOrderDetail,
    fetchWorkOrderComments,
    addWorkOrderComment,
} from '../../services/workOrders';
import type {
    WorkOrderData,
    WorkOrderDetailParams,
    FormattedComment,
} from '../../services/workOrders';
import WorkOrderDetailView from '../WorkOrderDetailView';

interface WorkOrderDetailModalProps {
    id: string;
    open: boolean;
    onClose: () => void;
    onDataEdited?: () => void;
}

function WorkOrderDetailModal({ id, open, onClose, onDataEdited }: WorkOrderDetailModalProps) {
    const { t } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [workOrderData, setWorkOrderData] = useState<WorkOrderData | null>(null);
    const [comments, setComments] = useState<FormattedComment[]>([]);
    const [commentsError, setCommentsError] = useState<Error | null>(null);
    const [commentsLoading, setCommentsLoading] = useState(false);

    // Mock data for linked items (replace with real API data when available)
    const linkedInvoices = ['INV-736', 'INV-145', 'INV-925'];
    const linkedDocuments = [
        'Installation Manual.pdf',
        'Energy Production Reports.png',
        'Warranty Certificate.pdf',
    ];

    useEffect(() => {
        if (open && id) {
            loadWorkOrderDetails();
            fetchWorkOrderCommentsData();
        }
    }, [open, id]);

    async function loadWorkOrderDetails() {
        setError(null);
        setLoading(true);
        try {
            const params: WorkOrderDetailParams = {
                id,
                include: ['local', 'createdBy', 'form'],
            };
            const response = await fetchWorkOrderDetail(params);
            setWorkOrderData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch work order details'));
        } finally {
            setLoading(false);
        }
    }

    const fetchWorkOrderCommentsData = async () => {
        setCommentsLoading(true);
        try {
            const commentData = await fetchWorkOrderComments(id);
            setComments(commentData);
        } catch (err) {
            setCommentsError(
                err instanceof Error ? err : new Error('Failed to fetch work order comments'),
            );
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleCommentSubmit = async (comment: string, isInternal: boolean) => {
        await addWorkOrderComment(id, comment, isInternal);
        fetchWorkOrderCommentsData();
        if (onDataEdited) onDataEdited();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box component="span">
                        {workOrderData?.attributes?.data?.title || t('asset.work-order-details')}
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <WorkOrderDetailView
                    workOrderData={workOrderData}
                    isLoading={isLoading}
                    error={error}
                    comments={comments}
                    commentsLoading={commentsLoading}
                    commentsError={commentsError}
                    linkedInvoices={linkedInvoices}
                    linkedDocuments={linkedDocuments}
                    onCommentSubmit={handleCommentSubmit}
                    readOnly={false}
                />
            </DialogContent>
        </Dialog>
    );
}

export default WorkOrderDetailModal;
