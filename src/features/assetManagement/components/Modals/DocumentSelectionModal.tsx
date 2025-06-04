import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Autocomplete,
    Checkbox,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

interface DocumentMetadata {
    filename: string;
    checksum: string;
    filesize: number;
    mediaType: string;
}

interface DocumentCentre {
    id: string;
    type: string;
    attributes: {
        name: string;
    };
}

interface DocumentTag {
    type: string;
    id: string;
    attributes: {
        name: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface Document {
    type: string;
    id: string;
    attributes: {
        type: string;
        name: string;
        description?: string;
        expiresAt?: string;
        public: boolean;
        status: string;
        location: string;
        metadata: DocumentMetadata;
        createdAt: string;
        updatedAt: string;
    };
    relationships: {
        centre: {
            data: {
                type: string;
                id: string;
            };
        };
        tags: Array<{
            data: {
                type: string;
                id: string;
            };
        }>;
        contractor?: {
            data: {
                type: string;
                id: string;
            };
        };
    };
    includes?: {
        centre: DocumentCentre;
        tags: {
            data: DocumentTag[];
        };
    };
}

interface DocumentSelectionModalProps {
    open: boolean;
    onClose: () => void;
    documents: Document[];
    selectedDocuments: string[];
    onDocumentsSelect: (documents: string[]) => void;
    error?: Error;
    initialSelectedDocumentName?: string | null;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Filters {
    status: string;
    contractor: string;
}

// Empty state SVG component
const EmptyStateIcon = () => (
    <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="100" cy="100" r="100" fill="#F5F5F5" />
        <rect
            x="60"
            y="50"
            width="80"
            height="100"
            rx="4"
            fill="white"
            stroke="#E0E0E0"
            strokeWidth="2"
        />
        <line x1="70" y1="70" x2="130" y2="70" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="110" x2="130" y2="110" stroke="#E0E0E0" strokeWidth="2" />
        <line x1="70" y1="130" x2="100" y2="130" stroke="#E0E0E0" strokeWidth="2" />
    </svg>
);

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`document-tabpanel-${index}`}
            aria-labelledby={`document-tab-${index}`}
            style={{ height: '100%', display: value === index ? 'block' : 'none' }}
            {...other}
        >
            {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
        </div>
    );
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function DocumentSelectionModal({
    open,
    onClose,
    documents,
    selectedDocuments,
    onDocumentsSelect,
    error,
    initialSelectedDocumentName,
}: DocumentSelectionModalProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({
        status: '',
        contractor: '',
    });
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [multiSelectedDocuments, setMultiSelectedDocuments] = useState<string[]>([]);
    const [tabValue, setTabValue] = useState(0);

    // Initialize selected documents when modal opens
    useEffect(() => {
        if (open) {
            setMultiSelectedDocuments(selectedDocuments || []);
        }
    }, [open, selectedDocuments]);

    // Effect to set the selected document based on initialSelectedDocumentName
    useEffect(() => {
        if (open && initialSelectedDocumentName) {
            // Find the document by name
            const docToSelect = documents.find(
                (doc) => doc.attributes.name === initialSelectedDocumentName,
            );
            if (docToSelect) {
                setSelectedDocument(docToSelect);
            }
        }
    }, [open, initialSelectedDocumentName, documents]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            contractor: '',
        });
        setSearchQuery('');
    };

    const handleDocumentSelect = (document: Document) => {
        setSelectedDocument(document);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Toggle selection for a document
    const toggleDocumentSelection = (document: Document) => {
        const documentName = document.attributes.name;
        setMultiSelectedDocuments((prev) => {
            if (prev.includes(documentName)) {
                return prev.filter((name) => name !== documentName);
            }
            return [...prev, documentName];
        });
    };

    // Handle assigning selected documents
    const handleAssignDocuments = () => {
        onDocumentsSelect(multiSelectedDocuments);
        onClose();
    };

    // Get unique statuses from actual documents
    const documentStatuses = Array.from(
        new Set(documents.map((doc) => doc.attributes.status).filter(Boolean)),
    );

    // Get unique contractors from actual documents
    const contractors = Array.from(
        new Set(
            documents
                .filter((doc) => doc.relationships.contractor?.data)
                .map((doc) => ({
                    id: doc.relationships.contractor!.data.id,
                    name: doc.relationships.contractor!.data.type, // Using type as name for now
                })),
        ),
    );

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = (doc.attributes.metadata.filename || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = !filters.status || doc.attributes.status === filters.status;
        const matchesContractor =
            !filters.contractor || doc.relationships.contractor?.data.id === filters.contractor;

        return matchesSearch && matchesStatus && matchesContractor;
    });

    if (error) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {t('asset.error')}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error">{error.message}</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{t('asset.close')}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    maxHeight: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {t('asset.select_documents')}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {multiSelectedDocuments.length} {t('asset.documents_selected')}
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Stack spacing={2} sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: '50%',
                            gap: 2,
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextField
                            label={t('asset.search')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: '25rem',
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                },
                            }}
                        />
                        <Button
                            variant="text"
                            onClick={handleClearFilters}
                            disabled={!filters.status && !filters.contractor && !searchQuery}
                            sx={{ ml: 2 }}
                        >
                            {t('buttons.clear-filter')}
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, maxWidth: '50%' }}>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">
                                {t('asset.select_status')}
                            </InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                label={t('asset.select_status')}
                                sx={{
                                    borderRadius: 1,
                                }}
                            >
                                {documentStatuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            fullWidth
                            options={contractors}
                            getOptionLabel={(option) => option.name}
                            value={contractors.find((c) => c.id === filters.contractor) || null}
                            onChange={(_, newValue) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    contractor: newValue?.id || '',
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label={t('asset.select_contractor')} />
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                },
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flex: 1,
                            minHeight: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <Paper
                            sx={{
                                width: '40%',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            variant="outlined"
                        >
                            {filteredDocuments.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        p: 3,
                                    }}
                                >
                                    <EmptyStateIcon />
                                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                                        {t('asset.no_documents_found')}
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ flex: 1, overflow: 'auto' }}>
                                    {filteredDocuments.map((document) => {
                                        const isSelected = multiSelectedDocuments.includes(
                                            document.attributes.name,
                                        );
                                        return (
                                            <ListItem key={document.id} disablePadding>
                                                <ListItemButton
                                                    selected={selectedDocument?.id === document.id}
                                                    onClick={() => handleDocumentSelect(document)}
                                                    sx={{ pr: 6 }}
                                                >
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleDocumentSelection(document)
                                                        }
                                                        tabIndex={-1}
                                                        disableRipple
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <ListItemText
                                                        primary={document.attributes.name}
                                                        secondary={
                                                            <Stack component="span" spacing={1}>
                                                                <Typography
                                                                    variant="body2"
                                                                    component="span"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        document.attributes
                                                                            .description
                                                                    }
                                                                </Typography>
                                                                <Box
                                                                    component="span"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        color: 'text.secondary',
                                                                        '& .separator': {
                                                                            width: 4,
                                                                            height: 4,
                                                                            borderRadius: '50%',
                                                                            backgroundColor:
                                                                                'text.secondary',
                                                                        },
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        component="span"
                                                                    >
                                                                        {document.attributes.type}
                                                                    </Typography>
                                                                    <span className="separator" />
                                                                    <Typography
                                                                        variant="body2"
                                                                        component="span"
                                                                    >
                                                                        {
                                                                            document.includes
                                                                                ?.centre?.attributes
                                                                                .name
                                                                        }
                                                                    </Typography>
                                                                    {document.attributes
                                                                        .expiresAt && (
                                                                        <>
                                                                            <span className="separator" />
                                                                            <Typography
                                                                                variant="body2"
                                                                                component="span"
                                                                            >
                                                                                {t(
                                                                                    'common.expires',
                                                                                )}
                                                                                :{' '}
                                                                                {format(
                                                                                    new Date(
                                                                                        document.attributes.expiresAt,
                                                                                    ),
                                                                                    'dd/MM/yyyy',
                                                                                )}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Paper>

                        <Paper
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                            variant="outlined"
                        >
                            {selectedDocument ? (
                                <>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                px: 2,
                                            }}
                                        >
                                            <Tabs
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                sx={{ flex: 1 }}
                                            >
                                                <Tab label={t('asset.details')} />
                                                <Tab label={t('asset.preview')} />
                                            </Tabs>
                                            <Checkbox
                                                checked={multiSelectedDocuments.includes(
                                                    selectedDocument.attributes.name,
                                                )}
                                                onChange={() =>
                                                    toggleDocumentSelection(selectedDocument)
                                                }
                                                title={t('asset.toggle_selection')}
                                            />
                                            {/* <IconButton size="small" title={t('asset.edit')}>
                                                <EditIcon />
                                            </IconButton> */}
                                            {/* <IconButton
                                                size="small"
                                                title={t('asset.delete')}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton> */}
                                        </Box>
                                    </Box>

                                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                                        <TabPanel value={tabValue} index={0}>
                                            <Stack spacing={2} sx={{ p: 2 }}>
                                                <Box
                                                    sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 1fr',
                                                        gap: 2,
                                                        mb: 3,
                                                    }}
                                                >
                                                    {Object.entries(selectedDocument.attributes)
                                                        .filter(
                                                            ([key]) =>
                                                                ![
                                                                    'metadata',
                                                                    'createdAt',
                                                                    'updatedAt',
                                                                    'location',
                                                                ].includes(key),
                                                        )
                                                        .map(([key, value]) => (
                                                            <Box key={key}>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="bold"
                                                                >
                                                                    {t(
                                                                        `${capitalizeFirstLetter(key)}`,
                                                                    )}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {typeof value === 'boolean'
                                                                        ? t(
                                                                              value
                                                                                  ? 'common.yes'
                                                                                  : 'common.no',
                                                                          )
                                                                        : typeof value === 'object'
                                                                          ? JSON.stringify(value)
                                                                          : value ||
                                                                            t('asset.no-value')}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                </Box>
                                                {/* Add metadata section */}
                                                {selectedDocument.attributes.metadata && (
                                                    <Box sx={{ mt: 4, p: 2 }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="bold"
                                                        >
                                                            {t('asset.metadata')}
                                                        </Typography>
                                                        <Stack
                                                            spacing={1}
                                                            sx={{
                                                                p: 2,
                                                                mt: 1,
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            {Object.entries(
                                                                selectedDocument.attributes
                                                                    .metadata,
                                                            ).map(([key, value]) => (
                                                                <Box key={key}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        fontWeight="bold"
                                                                        color="text.secondary"
                                                                    >
                                                                        {t(
                                                                            `document.${capitalizeFirstLetter(key)}`,
                                                                        )}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        {value}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </TabPanel>

                                        <TabPanel value={tabValue} index={1}>
                                            {selectedDocument.attributes.location ? (
                                                <Box sx={{ height: 'calc(100% - 16px)' }}>
                                                    <DocumentPreview
                                                        location={
                                                            selectedDocument.attributes.location
                                                        }
                                                        mediaType={
                                                            selectedDocument.attributes.metadata
                                                                ?.mediaType
                                                        }
                                                    />
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                        p: 3,
                                                    }}
                                                >
                                                    <Typography color="text.secondary">
                                                        {t('asset.no_document_selected')}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TabPanel>
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        p: 3,
                                    }}
                                >
                                    <EmptyStateIcon />
                                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                                        {t('asset.no_document_selected')}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('asset.cancel')}</Button>
                <Button
                    onClick={handleAssignDocuments}
                    variant="contained"
                    disabled={multiSelectedDocuments.length === 0}
                >
                    {t('asset.assign_selected_documents', {
                        count: multiSelectedDocuments.length,
                    })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function getFileType(location: string, mediaType?: string): string {
    if (mediaType) {
        if (mediaType.includes('pdf')) return 'pdf';
        if (mediaType.startsWith('image/')) return 'image';
        if (mediaType.includes('word')) return 'word';
        if (mediaType.includes('excel') || mediaType.includes('spreadsheet')) return 'excel';
    }
    const ext = location.split('.').pop()?.toLowerCase();
    if (!ext) return 'unknown';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    return 'unknown';
}

function DocumentPreview({ location, mediaType }: { location: string; mediaType?: string }) {
    const type = getFileType(location, mediaType);
    if (!location) return <Typography color="text.secondary">No preview available</Typography>;

    if (type === 'pdf')
        return (
            <iframe
                src={location}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="PDF Preview"
            />
        );

    if (type === 'image')
        return (
            <img
                src={location}
                alt="Document Preview"
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    margin: '0 auto',
                }}
            />
        );

    if (type === 'word' || type === 'excel')
        return (
            <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(location)}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Office Document Preview"
            />
        );

    return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">
                Preview not available for this file type.
            </Typography>
            <Button
                href={location}
                target="_blank"
                rel="noopener"
                variant="outlined"
                sx={{ mt: 2 }}
            >
                Download / Open
            </Button>
        </Box>
    );
}

export default DocumentSelectionModal;
