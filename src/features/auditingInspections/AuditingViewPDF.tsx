import { Box, Typography } from '@mui/material';

import Grid from '@mui/material/Grid2';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useTranslation } from 'react-i18next';

const AuditingViewPDF = () => {
    const { t } = useTranslation();

    const handleDownloadClick = (): void => {
        const a = document.createElement('a');
        a.href = 'auditingView.pdf';
        a.download = 'auditingView.pdf';

        a.click();
    };

    const handlePreviewdClick = () => {
        const pdfUrl = 'auditingView.pdf';
        window.open(pdfUrl, '_blank');
    };

    return (
        <Box sx={{ marginTop: '20px', marginLeft: '5%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="div">
                    314419_1731423420_dERz.pdf
                </Typography>

                <Box display="flex" gap={2}>
                    <FileDownloadOutlinedIcon
                        onClick={handleDownloadClick}
                        sx={{ fontSize: 20, cursor: 'pointer' }}
                    />
                    <OpenInNewOutlinedIcon
                        onClick={handlePreviewdClick}
                        sx={{ fontSize: 20, cursor: 'pointer' }}
                    />
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography color="textSecondary" sx={{ fontSize: '12px', marginRight: '4px' }}>
                    {t('common.PDF')}
                </Typography>
                <Box
                    sx={{
                        height: '4px',
                        width: '4px',
                        backgroundColor: 'grey',
                        borderRadius: '50%',
                        marginRight: '4px',
                    }}
                ></Box>
                <Typography color="textSecondary" sx={{ fontSize: '12px', marginRight: '4px' }}>
                    167 KB
                </Typography>
                <Box
                    sx={{
                        height: '4px',
                        width: '4px',
                        backgroundColor: 'grey',
                        borderRadius: '50%',
                        marginRight: '4px',
                    }}
                ></Box>
                <Typography color="textSecondary" sx={{ fontSize: '12px', marginRight: '4px' }}>
                    {t('inspections.uploaded-5-minutes-ago')}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} marginTop={2}>
                    <embed
                        src="public/auditingView.pdf"
                        type="application/pdf"
                        width="100%"
                        height="600px"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuditingViewPDF;
