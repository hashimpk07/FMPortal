import { format } from 'date-fns';
import i18next from 'i18next';
import HTTP from '../../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../../constants';

export interface CommentUser {
    id: string;
    type: string;
    attributes: {
        name: string;
        email: string;
    };
}

export interface Comment {
    id: string;
    avatar?: string;
    username?: string;
    createdBy?: string;
    visibility?: string;
    text?: string;
    attributes: {
        comment: string;
        createdAt: string;
        is_internal: boolean;
    };
    relationships: {
        createdBy: {
            data: {
                id: string;
                type: string;
            };
        };
    };
}

export interface FormattedComment {
    id: string;
    avatar: string;
    username: string;
    createdBy: string;
    visibility: string;
    text: string;
    email: string;
}

/**
 * Fetches comments for a specific work order
 * @param workOrderId The ID of the work order
 * @returns Promise with formatted comments data
 */
export async function fetchWorkOrderComments(workOrderId: string): Promise<FormattedComment[]> {
    if (!workOrderId) {
        throw new Error(i18next.t('errors.work-order-id-required', 'Work order ID is required'));
    }

    try {
        const response = await HTTP.get(
            `${API_BASE_URL}/${API_VERSION}/tickets/${workOrderId}/comments?include=createdBy`,
        );

        const commentData = response.data;
        const comments = commentData.data;
        const included = commentData.included || [];

        const formattedComments: FormattedComment[] = comments.map((item: Comment) => {
            const user = included.find(
                (profile: CommentUser) => profile.id === item.relationships.createdBy.data.id,
            );

            const formattedDate = format(new Date(item.attributes.createdAt), 'dd MMMM yyyy HH:mm');

            const visibility = item.attributes.is_internal
                ? i18next.t('asset.internal', 'Internal')
                : i18next.t('asset.public', 'Public');

            return {
                id: item.id,
                avatar: user ? user.attributes.name : i18next.t('asset.unknown', 'Unknown'),
                username: user ? user.attributes.name : i18next.t('asset.unknown', 'Unknown'),
                createdBy: formattedDate,
                visibility: visibility,
                text: item.attributes.comment,
                email: user ? user.attributes.email : '',
            };
        });

        return formattedComments;
    } catch (error) {
        console.error('Error fetching work order comments:', error);
        throw new Error(
            i18next.t('errors.failed-to-fetch-comments', 'Failed to fetch work order comments'),
        );
    }
}

/**
 * Adds a comment to a work order
 * @param workOrderId The ID of the work order
 * @param comment The comment text
 * @param isInternal Whether the comment is internal or public
 * @returns Promise with success status
 */
export async function addWorkOrderComment(
    workOrderId: string,
    comment: string,
    isInternal: boolean = true,
): Promise<{ success: boolean }> {
    if (!workOrderId) {
        throw new Error(i18next.t('errors.work-order-id-required', 'Work order ID is required'));
    }

    if (!comment) {
        throw new Error(i18next.t('errors.comment-text-required', 'Comment text is required'));
    }

    try {
        const response = await HTTP.post(
            `${API_BASE_URL}/${API_VERSION}/tickets/${workOrderId}/comments`,
            {
                data: {
                    type: 'ticketComments',
                    attributes: {
                        comment: comment,
                        is_internal: isInternal,
                    },
                },
            },
        );

        return {
            success: response.status === 204 || response.status === 201 || response.status === 200,
        };
    } catch (error) {
        console.error('Error adding work order comment:', error);
        throw new Error(
            i18next.t('errors.failed-to-add-comment', 'Failed to add work order comment'),
        );
    }
}

const workOrderCommentsService = {
    fetchWorkOrderComments,
    addWorkOrderComment,
};

export default workOrderCommentsService;
