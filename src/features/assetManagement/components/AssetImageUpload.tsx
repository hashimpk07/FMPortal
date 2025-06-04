import { useState, useCallback } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

interface AssetImageUploadProps {
    currentImageUrl?: string;
    onImageChange: (file: File | null) => void;
    disabled?: boolean;
}

function AssetImageUpload({ currentImageUrl, onImageChange, disabled = false }: AssetImageUploadProps) {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                // Create local preview
                const filePreview = URL.createObjectURL(file);
                setPreviewUrl(filePreview);

                // Pass the file to parent component but don't upload yet
                onImageChange(file);
            }
        },
        [onImageChange],
    );

    const handleRemoveImage = () => {
        onImageChange(null);
        setPreviewUrl(undefined);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxFiles: 1,
        disabled: disabled,
    });

    return (
        <Box>
            {previewUrl ? (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        opacity: disabled ? 0.7 : 1,
                    }}
                >
                    {!disabled && (
                        <IconButton
                            onClick={handleRemoveImage}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                                zIndex: 3,
                            }}
                            size="small"
                            aria-label={t('asset.remove-image')}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                    <img
                        src={previewUrl}
                        alt={t('asset.image')}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            ) : (
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed',
                        borderColor: isDragActive ? 'primary.main' : 'grey.300',
                        borderRadius: '8px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        '&:hover': {
                            backgroundColor: disabled ? 'background.paper' : 'action.hover',
                        },
                        position: 'relative',
                        opacity: disabled ? 0.7 : 1,
                    }}
                >
                    <input {...getInputProps()} disabled={disabled} />
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {isDragActive
                            ? t('asset.drop-file-here')
                            : t('asset.drag-and-drop-or-click')}
                    </Typography>
                    <Button variant="outlined" color="primary" disabled={disabled}>
                        {t('asset.choose-file')}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default AssetImageUpload;
