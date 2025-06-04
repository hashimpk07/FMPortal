import { useEffect, useMemo, useRef, useState } from 'react';
//import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { DataGridPro, GridSortModel } from '@mui/x-data-grid-pro';
import {
    Box,
    Drawer,
    Tab,
    Tabs,
    Typography,
    IconButton,
    Backdrop,
    CircularProgress,
    SvgIconProps,
} from '@mui/material';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import {
    Circle,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
    WorkspacePremium as WordIcon,
    FormatColorText as TextIcon,
    InsertDriveFile as DefaultIcon,
    TableChart as ExcelIcon,
} from '@mui/icons-material';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import columns from '../../columnDefinitions/documents';
import Controls from './Controls';
import CustomFileUpload from '../../components/common/CustomFileUpload';
import ViewDetails from './ViewDetails';
import EditDetails from './EditDetails';
import { API_BASE_URL, API_VERSION } from '../../constants';
import HTTP from '../../utils/api/helpers/axios';
import type { DocumentsData as DocumentsDataType } from '../../types/pageTypes';
import MultipleFilesUpload from './upload/MultipleFilesUpload';
import DownloadButton from './upload/DownloadButton';
import extractSortParams from '../../utils/api/helpers/sortHelpers';
import mimeTypeMap from '../../constants/fileMimeTypes';
import { downloadTypes } from '../../constants/fileValidation';
import snackbar from '../../utils/ts/helper/snackbar';
import filesize from '../../utils/api/helpers/filesize';

interface DocumentDetailsProps {
    id: string;
    setRows: React.Dispatch<React.SetStateAction<any>>;
    setDocumentDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEditCount: React.Dispatch<React.SetStateAction<number>>;
    setDeleteCount: React.Dispatch<React.SetStateAction<number>>;
}

interface Tag {
    id: string;
    name: string;
}

interface DocData {
    id: string;
    type: string;
    typeId: string;
    name: string;
    description: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    file: string;
    tags: string[];
    tagIds: Tag[];
    property: string;
    propertyId: string;
    updatedPeriod: string;
    expiryDateIso: string;
}

const initialDocData: DocData = {
    id: '',
    type: '',
    typeId: '',
    name: '',
    description: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    file: '',
    tags: [],
    tagIds: [],
    property: '',
    propertyId: '',
    updatedPeriod: '',
    expiryDateIso: '',
};

export interface DocumentData {
    id: number;
    type: string;
    name: string;
    metadata: {
        filename: string;
        checksum: string;
        filesize: string;
        mediaType: string;
    };
    property: string;
    modified: string;
    expires: string;
    relationships: {
        centre: {
            data: {
                type: string;
                id: number;
            };
        };
        tags: {
            data: {
                type: string;
                id: string;
            };
        }[];
    };
}

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const getFileType = (fileName: string) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase() || '';
    let fileType = '';

    switch (extension) {
        case 'pdf':
            fileType = 'application/pdf';
            break;
        case 'txt':
            fileType = 'text/plain';
            break;
        case 'doc':
        case 'docx':
            fileType = 'application/doc';
            break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'svg':
            fileType = 'application/image';
            break;
        case 'xlsx':
        case 'xls':
        case 'ods':
            fileType = 'application/spreadsheet';
            break;
        default:
            fileType = '';
    }

    return fileType;
};

const DocumentDetails = ({
    id,
    setRows,
    setDocumentDetailModal,
    setEditCount,
    setDeleteCount,
}: DocumentDetailsProps) => {
    const [value, setValue] = useState(0);
    const [isEdit, setEdit] = useState(false);
    const [docData, setDocData] = useState<DocData>(initialDocData);
    const [isLoading, setLoading] = useState(true);
    const getUpdatedPeriod = (updatedAt: string) => {
        const diff = differenceInMinutes(new Date(), parseISO(updatedAt));

        let timeUnit = '';
        let uploadedPeriod = '';

        if (diff < 60) {
            timeUnit = `mintue${diff > 1 ? 's' : ''}`;
            uploadedPeriod = `${diff} ${timeUnit}`;
        } else if (diff >= 60 && diff < 60 * 24) {
            const hours = Math.round(diff / 60);
            timeUnit = `hour${hours > 1 ? 's' : ''}`;
            uploadedPeriod = `${hours} ${timeUnit}`;
        } else if (diff >= 60 * 24 && diff < 60 * 24 * 30) {
            const days = Math.round(diff / (60 * 24));
            timeUnit = `day${days > 1 ? 's' : ''}`;
            uploadedPeriod = `${days} ${timeUnit}`;
        } else if (diff >= 60 * 24 * 30 && diff < 60 * 24 * 365) {
            const months = Math.round(diff / (60 * 24 * 30));
            timeUnit = `month${months > 1 ? 's' : ''}`;
            uploadedPeriod = `${months} ${timeUnit}`;
        } else {
            const years = Math.round(diff / (60 * 24 * 365));
            timeUnit = `year${years > 1 ? 's' : ''}`;
            uploadedPeriod = `${years} ${timeUnit}`;
        }

        return uploadedPeriod;
    };

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                setLoading(true);
                const apiResponse = await HTTP.get(
                    `${API_BASE_URL}/${API_VERSION}/documents/${id}`,
                );
                const { attributes, includes } = apiResponse.data.data;
                const details: any = {};

                details.id = apiResponse.data.data.id;
                const centre = includes?.centre;
                const tags = includes?.tags;

                if (attributes.expiresAt) {
                    const [datePart] = attributes.expiresAt.split('T');
                    details.expiryDate = datePart;
                    // const localExpireDate = parseISO(attributes.expiresAt);
                    // console.log("localExpireDate", localExpireDate);

                    const utcDate = parseISO(attributes.expiresAt);

                    details.expiryDate = format(utcDate, 'dd/MM/yyyy');
                    details.expiryTime = format(utcDate, 'hh:mm');

                    //details.expiryTime = timePart?.slice(0, 5);
                    details.expiryDateTime = attributes.expiresAt;
                } else {
                    details.expiryDate = '';
                    details.expiryTime = '';
                    details.expiryDateTime = '';
                }

                details.type = attributes.type;
                details.name = attributes.name;
                details.description = attributes.description;
                details.fileName = attributes.metadata.filename;
                details.fileSize = attributes.metadata.filesize;
                details.fileType = attributes.metadata.mediaType.split('/')[1].toUpperCase();
                details.file = attributes.location;
                details.tags = tags.data.map((tag: any) => tag.attributes.name);
                details.tagIds = tags.data.map((tag: any) => ({
                    name: tag.attributes.name,
                    id: tag.id,
                }));
                details.property = centre.attributes.name;
                details.updatedPeriod = getUpdatedPeriod(attributes.updatedAt);
                details.propertyId = centre.id;

                details.typeId = attributes.type.toLowerCase();
                details.expiryDateIso = attributes.expiresAt;

                setDocData(details);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching document details:', error);
            }
        };

        if (id) {
            fetchDocumentDetails();
        }
    }, [id]);
    const { t } = useTranslation();

    const handleChange = (_: any, newValue: number) => {
        setValue(newValue);
    };

    const handleCopy = (url: string) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                snackbar(
                    t('snackbar.copy-document'),
                    'default',
                    { horizontal: 'right', vertical: 'top' },
                    null,
                );
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
            });
    };

    const DocPreview = ({ data: { file, fileType } }: any) => {
        const lowerFileTypee = fileType.toLowerCase();
        const isDownloadType = downloadTypes.includes(lowerFileTypee);

        return (
            <>
                {file ? (
                    isDownloadType ? (
                        <>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{ margin: 2 }}
                                align="center"
                            >
                                {t('common.please-click-below-download-file')}
                            </Typography>

                            <DownloadButton fileUrl={file} />
                        </>
                    ) : (
                        <embed src={file} width="600px" height="600px" title={fileType} />
                    )
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '60px',
                        }}
                    >
                        <span>{t('documentLibrary.no-document-content')}</span>
                    </Box>
                )}
            </>
        );
    };

    const handleClose = () => {
        setDocumentDetailModal(false);
    };

    const getFileTypeLabel = (mimeType: string): string => {
        const normalizedMimeType = mimeType.toLowerCase();
        return mimeTypeMap[normalizedMimeType] || mimeType;
    };

    return (
        <>
            {isLoading && (
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={isLoading}
                    onClick={() => setLoading(true)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <Box
                sx={{
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: 838,
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 16px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 1, ml: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px',
                                borderRadius: '6px',
                                filter: 'grayscale(100%)', // black and white effect
                            }}
                        >
                            {getFileTypeIcon(docData.type)}
                        </Typography>
                        <Box>
                            <Typography variant="body1" fontWeight="bold">
                                {docData.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getFileTypeLabel(docData.fileType)} <Circle sx={{ height: 5 }} />
                                {filesize(docData.fileSize)} <Circle sx={{ height: 5 }} />
                                {t('common.modified')} {docData.updatedPeriod} {t('common.ago')}
                            </Typography>

                            {/* <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ marginLeft: '10px', textDecoration: 'underline' }}
                            >
                                {t('common. file-info')}
                            </Typography> */}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                        <IconButton onClick={() => handleCopy(docData.file)}>
                            <LinkIcon />
                        </IconButton>
                        <IconButton onClick={handleClose} color="primary">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Tabs Section */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginLeft: 4 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label={t('common.basic-tabs-example')}
                    >
                        <Tab label={t('common.details')} />
                        <Tab label={t('common.preview')} />
                    </Tabs>
                </Box>

                {/* Content Based on Tab */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                    }}
                >
                    {value === 0 &&
                        (isEdit ? (
                            <EditDetails
                                setEditCount={setEditCount}
                                data={docData}
                                setEdit={setEdit}
                                setDocumentDetailModal={setDocumentDetailModal}
                            />
                        ) : (
                            <ViewDetails
                                setDeleteCount={setDeleteCount}
                                data={docData}
                                setEdit={setEdit}
                                setRows={setRows}
                                setDocumentDetailModal={setDocumentDetailModal}
                            />
                        ))}
                    {value === 1 && <DocPreview data={docData} />}
                </Box>
            </Box>
        </>
    );
};

const DocumentList = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<DocumentsDataType[]>([]);
    const [search, setSearch] = useState('');
    const [files, setFiles] = useState<any>([]);
    const [openDocumentDetailModal, setDocumentDetailModal] = useState(false);
    const [selectedDocumentId, setSelectedIDocumentId] = useState<number>(0);
    const [isLoading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [totalPages, setTotalPages] = useState(0);
    const [sortCol, setSortCol] = useState('');
    const [sortDirection, setSortDirection] = useState<string | null | undefined>('asc');

    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [selectedFileType, setSelectedFileType] = useState<string>('');
    const [selectedExpiry, setSelectedExpiry] = useState<string>('');
    const rowCountRef = useRef(0);
    const [editCount, setEditCount] = useState(0);
    const [deleteCount, setDeleteCount] = useState(0);

    const rowCount = useMemo(() => {
        if (totalPages) {
            rowCountRef.current = totalPages;
        }
        return rowCountRef.current;
    }, [totalPages]);

    const getExpiryDate = (id: string) => {
        const daysToSubtract = {
            1: 7,
            2: 14,
            3: 30,
            4: 90,
            5: 180,
        }[id];

        if (daysToSubtract !== undefined) {
            const today = new Date();
            const expiryDate = new Date(today);
            expiryDate.setDate(expiryDate.getDate() + daysToSubtract);
            const expiryDated = format(expiryDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
            return expiryDated;
        }
        return null;
    };

    const getData = async () => {
        setLoading(true);

        const today = new Date();
        const todayFormatted = format(today, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        const expireBefore = getExpiryDate(selectedExpiry);
        let sortValue = '';

        if (sortCol) {
            const sortDir = sortDirection === 'asc' ? '' : '-';
            sortValue = `${sortDir}${sortCol}`;
        }

        const queryString =
            `page[size]=${paginationModel.pageSize}&page[number]=${paginationModel.page + 1}&
            ${selectedExpiry ? `&filters[expiresAfter]=${todayFormatted}&filters[expiresBefore]=${expireBefore}` : ''}&
            ${selectedFileType ? `&filters[type]=${selectedFileType}` : ''}&filters[search]=${search}&filters[centre]=${selectedProperty}&
            sort=${sortValue}`.replace(/\s+/g, '');
        const apiResponse = await HTTP.get(
            `${API_BASE_URL}/${API_VERSION}/documents?${queryString}`,
        );

        const {
            data,
            meta: { total },
        } = apiResponse.data;

        setTotalPages(total);

        setRows(
            data.map((doc: any) => {
                return {
                    id: doc.id,
                    ...doc.attributes,
                    property: doc.includes.centre.attributes.name,
                    metadata: {
                        mediaType: getFileType(doc.attributes.metadata.filename),
                    },
                    tags: doc.relationships?.tags?.map((tag: any) => tag.data.type) || [],
                };
            }),
        );

        setLoading(false);
    };

    useEffect(() => {
        try {
            getData();
        } catch (err) {
            console.log('Error in document landing page API', err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        paginationModel,
        sortCol,
        sortDirection,
        selectedFileType,
        selectedProperty,
        selectedExpiry,
        editCount,
        deleteCount,
        search,
    ]);

    const onRowSelect = (params: any) => {
        setSelectedIDocumentId(params.row.id);
        setDocumentDetailModal(true);
    };
    const onSortChange = (model: GridSortModel) => {
        const { field, sort } = extractSortParams(model);
        const mappedField = field === 'property' ? 'centre.name' : field;

        setSortCol(mappedField);
        setSortDirection(sort);
    };

    return (
        <StyledPage>
            <Typography variant="h1">{t('page-titles.document-library')}</Typography>

            <CustomFileUpload showUploadedFiles={true} files={files} setFiles={setFiles} />
            <MultipleFilesUpload
                files={files}
                closeFileUploader={(bReload) => {
                    setFiles([]);
                    if (bReload) {
                        getData();
                    }
                }}
            />
            <Typography variant="h5" sx={{ fontSize: '32px', my: -3 }}>
                {t('page-titles.all-documents')}
            </Typography>

            <Controls
                selectedProperty={selectedProperty}
                setSelectedProperty={setSelectedProperty}
                selectedFileType={selectedFileType}
                setSelectedFileType={setSelectedFileType}
                selectedExpiry={selectedExpiry}
                setSelectedExpiry={setSelectedExpiry}
                search={search}
                setSearch={setSearch}
                setRows={setRows}
            />

            <DataGridPro
                onRowClick={onRowSelect}
                columns={columns({ t })}
                rows={rows || []}
                rowCount={rowCount}
                loading={isLoading}
                paginationModel={paginationModel}
                sortingMode="server"
                filterMode="server"
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={onSortChange}
                pageSizeOptions={[10]}
                pagination
                sx={{
                    // pointer cursor on ALL rows
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
            />

            <Drawer
                anchor="right"
                open={openDocumentDetailModal}
                onClose={() => setDocumentDetailModal(false)}
                sx={{
                    width: '620px',
                    position: 'absolute',
                }}
            >
                <DocumentDetails
                    setEditCount={setEditCount}
                    setDeleteCount={setDeleteCount}
                    id={selectedDocumentId.toString()}
                    setRows={setRows}
                    setDocumentDetailModal={setDocumentDetailModal}
                />
            </Drawer>
        </StyledPage>
    );
};

export default DocumentList;

export const getFileTypeIcon = (fileType: string): React.ReactElement<SvgIconProps> => {
    const type = fileType.toLowerCase();

    if (type.includes('image')) return <ImageIcon color="action" />;
    if (type === 'application/pdf') return <PdfIcon color="error" />;
    if (type.includes('word')) return <WordIcon color="primary" />;
    if (type.includes('excel') || type.includes('spreadsheet'))
        return <ExcelIcon color="success" />;
    if (type === 'text/plain') return <TextIcon color="disabled" />;

    return <DefaultIcon color="disabled" />;
};
