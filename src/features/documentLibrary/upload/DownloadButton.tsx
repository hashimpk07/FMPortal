import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';

type LoadingIconButtonProps = {
    fileUrl: string;
};

export default function LoadingIconButton({ fileUrl }: LoadingIconButtonProps) {
    const [loading, setLoading] = React.useState(false);

    const downloadFromS3 = (fileUrl: string) => {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileUrl.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={2}>
            <IconButton
                onClick={() => downloadFromS3(fileUrl)}
                loading={loading}
                sx={{ width: 150, height: 150 }}
            >
                <DownloadIcon fontSize="large" />
            </IconButton>
        </Box>
    );
}
