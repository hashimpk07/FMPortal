import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close, Download, Launch, Link } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Define the document type
interface Document {
    id: number;
    name: string;
    url: string;
    size?: string;
    lastUpdatedAt?: string;
    type?: string;
}

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    width: '90%',
    height: '90%',
    overflow: 'scroll',
};

const headerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    display: 'flex',
    alignItems: 'center',
};

interface DocumentListProps {
    setDocumentListModal: React.Dispatch<React.SetStateAction<boolean>>;
    documentList: Document[];
    selectedDocumentItem?: Document;
}

const GreyDotIcon = () => (
    <Box
        sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'grey',
            display: 'inline-block',
            marginRight: 1,
            marginLeft: 1,
        }}
    />
);

const DocumentList = ({
    setDocumentListModal,
    documentList,
    selectedDocumentItem = documentList[0],
}: DocumentListProps) => {
    const { t } = useTranslation();
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(selectedDocumentItem);
    const handleDocumentClick = (document: Document): void => {
        setSelectedDocument(document);
    };

    // Handle the download action for a PDF
    const handleDownloadClick = (url: string): void => {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop() || 'document.pdf'; // Extract file name from URL
        a.click();
    };

    // Handle copying the document link to the clipboard
    const handleCopyLinkClick = (url: string): void => {
        navigator.clipboard.writeText(url);
        console.log('Link copied to clipboard!');
    };

    return (
        <Box sx={boxStyle}>
            <Box sx={headerStyle}>
                <Typography variant="h6" sx={{ textAlign: 'left', flexGrow: 1 }}>
                    {t('contractor.view-documents')}
                </Typography>
                <IconButton
                    onClick={() => setDocumentListModal(false)}
                    sx={{ color: 'black' }}
                    title="Close"
                >
                    <Close />
                </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ padding: 2 }}>
                {/* Left Column: Document List */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ padding: 1 }}>
                        {documentList.map((doc) => (
                            <Paper
                                key={doc.id}
                                elevation={0}
                                sx={{
                                    padding: 1,
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                                onClick={() => handleDocumentClick(doc)}
                            >
                                <Typography variant="body1">{doc.name}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Grid>

                {/* Right Column: PDF Viewer */}
                <Grid size={{ xs: 12, sm: 8 }}>
                    {selectedDocument && (
                        <Box sx={{ padding: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {selectedDocument.name}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <IconButton
                                        title={t('contractor.download-document')}
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                        onClick={() => handleDownloadClick(selectedDocument.url)}
                                    >
                                        <Download />
                                    </IconButton>
                                    <IconButton
                                        title={t('contractor.copy-document-link')}
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                        onClick={() => handleCopyLinkClick(selectedDocument.url)}
                                    >
                                        <Link />
                                    </IconButton>
                                    <IconButton
                                        title={t('contractor.copy-document-link')}
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                        onClick={() => handleCopyLinkClick(selectedDocument.url)}
                                    >
                                        <Launch />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Row with Document Name, Download, and Copy Link Buttons */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                        {selectedDocument.type} <GreyDotIcon />
                                        {selectedDocument.size} <GreyDotIcon />
                                        {selectedDocument.lastUpdatedAt}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                                    >
                                        <u>{t('contractor.file-info')}</u>
                                    </Typography>
                                </Box>
                            </Box>

                            {/* PDF Display */}
                            <embed
                                src={selectedDocument.url}
                                width="100%"
                                height="600px"
                                title={selectedDocument.name}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentList;
