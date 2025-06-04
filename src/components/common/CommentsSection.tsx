import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import { userStore } from '@mallcomm/portals-auth';
import { getAvatarInitials } from '../../utils/ts/helper/textFormatter';

interface CommentsSectionProps {
    comments: CommentItem[];
    comment: string;
    onCommentChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onCommentSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onCommentCancel?: () => void;
    loading?: boolean;
    error?: string;
    showVisibility?: boolean;
    visibilityValue?: string;
    onVisibilityChange?: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    visibilityOptions?: { id: string; name: string; icon?: React.ReactNode }[];
    inputPlaceholder?: string;
    submitLabel?: string;
    cancelLabel?: string;
}

interface CommentItem {
    id: string | number;
    avatar?: string;
    username: string;
    createdBy?: string;
    visibility?: string;
    text: string;
}

function CommentsSection({
    comments,
    comment,
    onCommentChange,
    onCommentSubmit,
    onCommentCancel,
    loading = false,
    error = '',
    showVisibility = false,
    visibilityValue = '',
    onVisibilityChange,
    visibilityOptions = [],
    inputPlaceholder = 'Add a comment...',
    submitLabel = 'Post',
    cancelLabel = 'Cancel',
}: CommentsSectionProps) {
    const { t } = useTranslation();
    const { userDetails } = userStore();

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                {t('select.case-comments')}
            </Typography>
            <form onSubmit={onCommentSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Avatar sx={{ background: '#A48FFF' }}>
                        {/* Optionally show user initials or icon */}
                        {getAvatarInitials(userDetails.attributes.name)}
                    </Avatar>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder={inputPlaceholder}
                        value={comment}
                        required
                        onChange={onCommentChange}
                        sx={{ marginRight: 2 }}
                        disabled={loading}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: '0px',
                        marginBottom: '10px',
                    }}
                >
                    <Stack
                        direction="row"
                        gap={2}
                        sx={{ marginLeft: '50px', marginBottom: '10px' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : submitLabel}
                        </Button>
                        {onCommentCancel && (
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={onCommentCancel}
                                disabled={loading}
                            >
                                {cancelLabel}
                            </Button>
                        )}
                    </Stack>
                    {showVisibility && onVisibilityChange && (
                        <FormControl sx={{ minWidth: 150, right: '15px' }}>
                            <InputLabel id="visibility-label">{t('common.visibility')}</InputLabel>
                            <Select
                                id="visibility-label"
                                label={t('common.visibility')}
                                value={visibilityValue}
                                onChange={onVisibilityChange}
                                disabled={loading}
                            >
                                {visibilityOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            {option.icon}
                                            <span>{option.name}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
            </form>
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
                        <Avatar sx={{ width: 40, height: 40, marginRight: 2 }} src={comment.avatar}>
                            {comment.username?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box display="flex" alignItems="center">
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{ marginRight: 2 }}
                                >
                                    {comment.username}
                                </Typography>
                                {comment.createdBy && (
                                    <Typography variant="subtitle2" sx={{ marginRight: 2 }}>
                                        {comment.createdBy}
                                    </Typography>
                                )}
                                {comment.visibility && <Chip label={comment.visibility} />}
                            </Box>
                            <Typography variant="body1">{comment.text}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default CommentsSection;
