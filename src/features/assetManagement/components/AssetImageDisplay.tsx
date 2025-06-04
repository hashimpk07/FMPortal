import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AssetImageDisplayProps {
    imageUrl: string | null;
    assetName: string;
}

function AssetImageDisplay({ imageUrl, assetName }: AssetImageDisplayProps) {
    const { t } = useTranslation();

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={assetName}
                style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                color: 'text.secondary',
            }}
        >
            <Typography variant="body1">{t('asset.no-image-available')}</Typography>
        </Box>
    );
}

export default AssetImageDisplay;
