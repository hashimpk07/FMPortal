import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Circle, Close, Download, Launch, Link as LinkIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Define the document type
interface Document {
    id: number;
    name: string;
    pdfUrl: string;
}

// Sample document data with type
const documents: Document[] = [
    {
        id: 1,
        name: 'Building Invoice',
        pdfUrl: 'https://example.com/document2.pdf',
    },
];
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

interface DocumentPreviewProps {
    setDocumentPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InvoiceDocument = ({ setDocumentPreviewModal }: DocumentPreviewProps) => {
    const { t } = useTranslation();
    // State to hold the selected document
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);

    // Handle document click to select a document
    const handleDocumentClick = (document: Document): void => {
        setSelectedDocument(document);
    };

    // Handle the download action for a PDF
    const handleDownloadClick = (pdfUrl: string): void => {
        const a = document.createElement('a');
        //a.href = pdfUrl;
        //a.download = pdfUrl.split('/').pop() || 'document.pdf'; // Extract file name from URL
        a.href = 'sample.pdf'; // temp
        a.download = 'sample.pdf';

        a.click();
        console.log('pdfUrl', pdfUrl);
    };

    // Handle copying the document link to the clipboard
    const handleCopyLinkClick = (pdfUrl: string): void => {
        navigator.clipboard.writeText(pdfUrl);
        console.log('Link copied to clipboard!');
    };

    return (
        <Box sx={boxStyle}>
            <Box sx={headerStyle}>
                <Typography variant="h6" sx={{ textAlign: 'left', flexGrow: 1 }}>
                    {t('common.view-documents')}
                </Typography>
                <IconButton
                    onClick={() => setDocumentPreviewModal(false)}
                    sx={{ color: 'black' }}
                    title="Close"
                >
                    <Close />
                </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ padding: 2 }}>
                {/* Left Column: Document List */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ padding: 2 }}>
                        {documents.map((doc) => (
                            <Paper
                                key={doc.id}
                                sx={{
                                    padding: 2,
                                    marginBottom: 2,
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
                        <Box>
                            {/* Row with Document Name, Download, and Copy Link Buttons */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        pt: 1,
                                        ml: 1,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            {selectedDocument.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            PDF <Circle sx={{ height: 5 }} />
                                            3MB <Circle sx={{ height: 5 }} />
                                            Modified 5 mintues ago
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                marginLeft: '10px',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            File info
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton
                                        title="Download document"
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                        onClick={() => handleDownloadClick(selectedDocument.pdfUrl)}
                                    >
                                        <Download />
                                    </IconButton>
                                    <IconButton
                                        title="Copy document link"
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                        onClick={() => handleCopyLinkClick(selectedDocument.pdfUrl)}
                                    >
                                        <LinkIcon />
                                    </IconButton>
                                    <IconButton
                                        title="Copy document link"
                                        sx={{
                                            background: '#F4F4F4',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Link
                                            to={selectedDocument.pdfUrl}
                                            style={{ color: 'inherit' }}
                                            target="_blank"
                                        >
                                            <Launch />
                                        </Link>
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* PDF Display */}
                            <embed
                                src={selectedDocument.pdfUrl}
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

export default InvoiceDocument;
