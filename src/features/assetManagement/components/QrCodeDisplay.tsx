import { Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';

interface QrCodeDisplayProps {
    assetId: string;
    assetName: string;
    baseUrl?: string;
}

function QrCodeDisplay({
    assetId,
    assetName,
    // baseUrl = window.location.origin,
}: QrCodeDisplayProps) {
    const { t } = useTranslation();
    const qrRef = useRef<HTMLCanvasElement>(null);

    // Generate the asset URL - now points to standalone page
    const assetUrl = `${assetId}`;
    // const assetUrl = `${baseUrl}/asset-management/asset/${assetId}`;

    const handleQrCodeDownload = () => {
        if (!qrRef.current) return;

        // Convert canvas to blob
        qrRef.current.toBlob((blob) => {
            if (!blob) return;

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${assetName}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
                sx={{
                    width: '150px',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    margin: '28px auto 0',
                    padding: '8px',
                }}
            >
                <QRCodeCanvas
                    ref={qrRef}
                    value={assetUrl}
                    size={150}
                    level="H"
                    includeMargin={true}
                />
            </Box>
            <Button
                startIcon={<DownloadIcon />}
                variant="outlined"
                onClick={handleQrCodeDownload}
                sx={{
                    mt: 1,
                    color: 'black',
                    borderColor: 'grey.300',
                }}
            >
                {t('buttons.download')}
            </Button>
        </Box>
    );
}

export default QrCodeDisplay;
