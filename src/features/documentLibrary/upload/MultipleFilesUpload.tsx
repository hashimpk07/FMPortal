import { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography, IconButton, Modal, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AxiosError } from 'axios';
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import snackbar from '../../../utils/ts/helper/snackbar';
import HTTP from '../../../utils/api/helpers/axios';
import { API_BASE_URL, API_VERSION } from '../../../constants';
import Lists from './ListItems';
import AlertDialogSlide from './AlertDialogSlide';
import FileNameField from './FileNameField';
import FileDescriptionField from './FileDescriptionField';
import FileAlert from './FileAlert';

import { ALLOWED_FILE_TYPES, MAX_SIZE } from '../../../constants/fileValidation';

import {
    ErrorResponse,
    TabPanelProps,
    TransformedCentres,
    PropertyData,
    TransformedType,
    Type,
    DocumentTypeData,
    UploadFileItem,
    UploadFileList,
    UploadInfo,
} from './types/index';
import fetchCentresList, { CentreData } from '../../../services/centres';

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const PENDING = 'INCOMPLETE';
const READY = 'READY';

export default function MultipleFilesUpload({
    files: propFiles,
    closeFileUploader,
}: {
    files: UploadFileList;
    closeFileUploader: (reload?: boolean) => void;
}) {
    const [tabIndex, setTabIndex] = useState(0);
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentTypeData[]>([]);
    const { t } = useTranslation();
    const [files, setFiles] = useState<any>([]);
    const [editingIndex, setEditingIndex] = useState<number>(0);
    const [uploadInfo, showUploadInfo] = useState<UploadInfo | null>(null);

    useEffect(() => {
        if (propFiles && propFiles.length > 0) {
            const mappedFiles = propFiles.map(
                ({ file, preview }: { file: File; preview: string }) => ({
                    file,
                    preview,
                    name: file.name,
                    description: '',
                    size: formatFileSize(file.size),
                    type: file.type,
                    status: PENDING,
                    isValid: validation(file),
                    sizeInBytes: file.size,
                }),
            );
            setFiles(mappedFiles);
            getProperties();
            getType();
        }
    }, [propFiles]);

    const addDocuments = (selectedFiles: FileList | null) => {
        if (selectedFiles?.length) {
            const newFiles: UploadFileList = [];
            Array.from(selectedFiles).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newFiles.push({
                        file,
                        preview: reader.result as string,
                        name: file.name,
                        description: '',
                        size: formatFileSize(file.size),
                        type: file.type,
                        status: PENDING,
                        isValid: validation(file),
                        sizeInBytes: file.size,
                    });

                    // After reading all files, update the state
                    if (newFiles.length === selectedFiles.length) {
                        setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const updateDocStatus = (obj: UploadFileItem): string => {
        // Check for non-empty fields
        const hasRequiredFields =
            obj.name?.trim() && obj.propertyId?.toString().trim() && obj.typeId?.toString().trim();

        // Check file size and type
        const isSizeValid = typeof obj.sizeInBytes === 'number' && obj.sizeInBytes < MAX_SIZE;
        const isTypeValid = ALLOWED_FILE_TYPES.includes(obj.type || '');

        // Return appropriate status based on the checks
        return hasRequiredFields && isSizeValid && isTypeValid ? READY : PENDING;
    };

    const getProperties = async () => {
        try {
            const response = await fetchCentresList();
            const centresData = response.data;
            if (Array.isArray(centresData)) {
                const transformedData: TransformedCentres[] = centresData.map(
                    (item: CentreData) => ({
                        id: String(item.id),
                        name: item.attributes.name,
                    }),
                );
                setProperties(transformedData);
            } else {
                console.error("Response data 'data' is not an array", centresData);
            }
        } catch (error) {
            console.error('Properties not fetch ', error);
        }
    };
    const getType = async () => {
        try {
            const response = await HTTP.get(`${API_BASE_URL}/${API_VERSION}/documents/types`);
            const typesData = response.data.data;

            if (Array.isArray(typesData)) {
                const transformedData: TransformedType[] = typesData.map((item: Type) => ({
                    id: String(item.id),
                    name: item.attributes.name,
                }));
                setDocumentTypes(transformedData);
            } else {
                console.error("Response data 'data' is not an array", typesData);
            }
        } catch (error) {
            console.error('Type not fetch ', error);
        }
    };

    function formatFileSize(sizeInBytes: number): string {
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB >= 1) {
            return `${sizeInMB.toFixed(3)} MB`;
        }
        const sizeInKB = sizeInBytes / 1024;
        return `${sizeInKB.toFixed(3)} KB`;
    }

    const validation = (file: File) => {
        const sizeInKB = file.size / 1024;
        return {
            type: ALLOWED_FILE_TYPES.includes(file.type) ? true : false,
            size: sizeInKB < MAX_SIZE ? true : false,
        };
    };
    const fieldValidation = (item: UploadFileItem) => {
        const requiredFields: (keyof UploadFileItem)[] = ['name', 'propertyId', 'typeId'];
        const count = requiredFields.reduce((count, field) => {
            if (
                item?.[field] === undefined ||
                (typeof item[field] === 'string' && item[field].trim() === '')
            ) {
                return count + 1;
            }
            return count;
        }, 0);
        if (count === 0) return 'Invalid file type';
        return `${count} required field${count > 1 ? 's' : ''} missing`;
    };

    const handleUpdate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string,
    ) => {
        if (editingIndex !== null) {
            const updatedFiles = [...files];
            updatedFiles[editingIndex][field] = e.target.value;
            updatedFiles[editingIndex].status = updateDocStatus(updatedFiles[editingIndex]);
            setFiles(updatedFiles);
        }
    };

    const handleUpdateOnSelect = (e: SelectChangeEvent, field: string) => {
        if (editingIndex !== null) {
            const updatedFiles = [...files];
            updatedFiles[editingIndex][field] = e.target.value;

            updatedFiles[editingIndex].status = updateDocStatus(updatedFiles[editingIndex]);
            setFiles(updatedFiles);
        }
    };

    const handleDelete = (name: string | undefined) => {
        if (files.length > 0) {
            setEditingIndex(0);
        }
        const index = files.findIndex((file: File) => file.name === name);

        setFiles((prevFiles: any) => {
            const updatedItems = [...prevFiles];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
    };

    const generateFileChecksum = async function generateFileChecksum(file: any) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (e: any) => {
                try {
                    const arrayBuffer = e.target.result;
                    const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map((byte) => byte.toString(16).padStart(2, '0'))
                        .join('');
                    resolve(hashHex);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadDocuments = async (from: string) => {
        const isValidStatus = ['CONFIRM', 'REVERT', 'AGREED', 'PROGRESS'].includes(from);
        if (!isValidStatus || !files.length) return;

        const ready = files.filter((doc: UploadFileItem) => doc.status === READY).length;
        const inComplete = files.filter((doc: UploadFileItem) => doc.status === PENDING).length;
        const all = files.length;

        // Helper to show upload info
        const showInfo = (status: string) => {
            showUploadInfo({
                status,
                ready,
                inComplete,
                ...(status !== 'PROGRESS' && { all }),
            });
        };

        if (from === 'AGREED') {
            showInfo('PROGRESS');
            const filesToUpload = files.filter((doc: UploadFileItem) => doc.status === READY);
            for (const doc of filesToUpload) {
                //  console.log("documents", doc.preview);
                const mediaType = doc.file.type || 'application/octet-stream';
                const checksum = await generateFileChecksum(doc.file);
                const documentData = {
                    data: {
                        type: 'document',
                        attributes: {
                            type: doc.typeId,
                            name: doc.name,
                            description: doc.description,
                            metadata: {
                                filename: doc.name,
                                checksum,
                                filesize: Number(Math.trunc(doc.file.size)),
                                mediaType,
                            },
                        },
                        relationships: {
                            centre: {
                                data: {
                                    type: 'centre',
                                    id: parseInt(doc.propertyId, 10),
                                },
                            },
                            tags: [],
                        },
                    },
                };

                try {
                    const response = await HTTP.post(
                        `${API_BASE_URL}/${API_VERSION}/documents`,
                        documentData,
                    );
                    const lastInsertId = response.data.data.id;
                    await HTTP.put(
                        `${API_BASE_URL}/${API_VERSION}/documents/${lastInsertId}`,
                        doc.file,
                        {
                            headers: {
                                'Content-Type': mediaType,
                            },
                        },
                    );

                    setTimeout(() => {
                        snackbar(
                            t('snackbar.documents-have-been-uploaded'),
                            'default',
                            { horizontal: 'center', vertical: 'bottom' },
                            null,
                        );
                        showUploadInfo({
                            status: 'DONE',
                            ready,
                            inComplete,
                            all,
                        });
                        closeFileUploader(true);
                        setTabIndex(0);
                    }, 1000);
                } catch (uploadError: unknown) {
                    setTimeout(() => {
                        showUploadInfo({
                            status: 'Error',
                            ready,
                            inComplete,
                            all,
                        });
                        setTabIndex(0);
                        closeFileUploader();
                    }, 1000);
                    if (uploadError instanceof AxiosError) {
                        const error = uploadError as AxiosError<ErrorResponse>;
                        const errorDetail = error.response?.data?.errors?.[0]?.detail;

                        if (errorDetail?.includes('checksum has already been taken')) {
                            snackbar(
                                t('snackbar.document-checksum-already-exists'),
                                'error',
                                { horizontal: 'center', vertical: 'bottom' },
                                null,
                            );
                        } else {
                            snackbar(
                                `An error occurred: ${errorDetail}`,
                                'error',
                                { horizontal: 'center', vertical: 'bottom' },
                                null,
                            );
                        }
                    } else {
                        snackbar(
                            t('snackbar.unknown-error-occurred-while-uploading-the-document'),
                            'default',
                            { horizontal: 'center', vertical: 'bottom' },
                            null,
                        );
                    }
                }
            }
        } else {
            // For other statuses: show info
            showInfo(from);
        }
    };

    const boxStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: 24,
        width: '65%',
        height: '90%',
        overflow: 'auto',
    };

    const handleFileClick = (name: string | undefined) => {
        const index = files.findIndex((file: File) => file.name === name);
        setEditingIndex(index);
    };

    return (
        <div>
            <Modal
                open={propFiles.length === 0 ? false : true}
                onClose={() => closeFileUploader()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={boxStyle}>
                    <AlertDialogSlide uploadInfo={uploadInfo} uploadDocuments={uploadDocuments} />
                    <Box
                        sx={{
                            display: 'flex',
                            backgroundColor: '#f6f6f6',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h3" sx={{ ml: 2 }}>
                            {t('common.import-document-items')}
                        </Typography>
                        <IconButton
                            edge="end"
                            color="inherit"
                            sx={{ marginRight: '5px' }}
                            onClick={() => {
                                closeFileUploader();
                                setTabIndex(0);
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Grid container size={{ sm: 12, md: 6 }} sx={{ minHeight: '80%' }}>
                        <Grid
                            size={{ sm: 12, md: 6 }}
                            sx={{ padding: '2px', borderRight: '1px solid #dcdcdc' }}
                        >
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={tabIndex}
                                    onChange={(_, value) => setTabIndex(value)}
                                    sx={{ marginLeft: '25px' }}
                                >
                                    <Tab
                                        sx={{ textTransform: 'none' }}
                                        label={
                                            t('common.all-upload') +
                                            '(' +
                                            (files.length && files.length) +
                                            ')'
                                        }
                                    />
                                    <Tab
                                        sx={{ textTransform: 'none' }}
                                        label={
                                            t('common.ready') +
                                            '(' +
                                            (files.length &&
                                                files.filter(
                                                    (doc: UploadFileItem) => doc.status === READY,
                                                ).length) +
                                            ')'
                                        }
                                    />
                                    <Tab
                                        sx={{ textTransform: 'none' }}
                                        label={
                                            t('common.incomplete') +
                                            '(' +
                                            (files.length &&
                                                files.filter(
                                                    (doc: UploadFileItem) => doc.status === PENDING,
                                                ).length) +
                                            ')'
                                        }
                                    />
                                </Tabs>
                            </Box>
                            {tabIndex === 0 ? (
                                <Button
                                    component="label"
                                    variant="contained"
                                    size="medium"
                                    color="inherit"
                                    //    onClick={handleResetFilters}
                                    sx={{
                                        fontSize: '10px',
                                        marginLeft: 'auto',
                                        marginRight: '10px',
                                        top: '15px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        width: '110px',
                                    }}
                                >
                                    {t('common.add-documents')}

                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => addDocuments(event.target.files)}
                                        multiple
                                    />
                                </Button>
                            ) : (
                                ''
                            )}
                            <CustomTabPanel value={tabIndex} index={0}>
                                <Lists
                                    files={files}
                                    handleFileClick={(name) => handleFileClick(name)}
                                    editingIndex={editingIndex}
                                    handleDelete={(name) => handleDelete(name)}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={tabIndex} index={1}>
                                <Lists
                                    files={
                                        files.length &&
                                        files.filter((doc: UploadFileItem) => doc.status === READY)
                                    }
                                    handleFileClick={(name) => handleFileClick(name)}
                                    editingIndex={editingIndex}
                                    handleDelete={(name) => handleDelete(name)}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={tabIndex} index={2}>
                                <Lists
                                    files={
                                        files.length &&
                                        files.filter(
                                            (doc: UploadFileItem) => doc.status === PENDING,
                                        )
                                    }
                                    handleFileClick={(name) => handleFileClick(name)}
                                    editingIndex={editingIndex}
                                    handleDelete={(name) => handleDelete(name)}
                                />
                            </CustomTabPanel>
                        </Grid>
                        {files.length
                            ? (() => {
                                  const file = files[editingIndex];
                                  return (
                                      <Grid size={{ sm: 12, md: 6 }} sx={{ padding: '12px' }}>
                                          <FileAlert
                                              file={file}
                                              fieldValidation={fieldValidation}
                                          />

                                          <FileNameField
                                              fileName={file.name}
                                              error={!file.name}
                                              onChange={(e) => handleUpdate(e, 'name')}
                                              helperText="Please select a valid name"
                                          />
                                          <FileDescriptionField
                                              description={file.description}
                                              onChange={(e) => handleUpdate(e, 'description')}
                                          />
                                          <FormControl
                                              sx={{ mt: 2 }}
                                              size="small"
                                              fullWidth
                                              error={!files[editingIndex]?.propertyId}
                                          >
                                              <InputLabel id="demo-select-small-label">
                                                  {t('common.property')}
                                              </InputLabel>
                                              <Select
                                                  labelId="demo-select-small-label"
                                                  id="demo-select-small"
                                                  value={files[editingIndex]?.propertyId || ''}
                                                  label="Property"
                                                  onChange={(e) =>
                                                      handleUpdateOnSelect(e, 'propertyId')
                                                  }
                                              >
                                                  {properties.map((property, index) => (
                                                      <MenuItem key={index} value={property.id}>
                                                          {property.name}
                                                      </MenuItem>
                                                  ))}
                                              </Select>
                                              {!files[editingIndex]?.propertyId && (
                                                  <FormHelperText>
                                                      {t('common.please-select-valid0property')}
                                                  </FormHelperText>
                                              )}
                                          </FormControl>
                                          <FormControl
                                              sx={{ mt: 2 }}
                                              size="small"
                                              fullWidth
                                              error={!files[editingIndex]?.typeId}
                                          >
                                              <InputLabel id="demo-select-small-label">
                                                  {t('common.type')}
                                              </InputLabel>
                                              <Select
                                                  labelId="demo-select-small-label"
                                                  id="demo-select-small"
                                                  value={files[editingIndex]?.typeId || ''}
                                                  label="Type"
                                                  onChange={(e) =>
                                                      handleUpdateOnSelect(e, 'typeId')
                                                  }
                                              >
                                                  {documentTypes.map((type, index) => (
                                                      <MenuItem key={index} value={type.id}>
                                                          {type.name}
                                                      </MenuItem>
                                                  ))}
                                              </Select>
                                              {!files[editingIndex]?.typeId && (
                                                  <FormHelperText>
                                                      {t(
                                                          'common.please-select-valid-document-type',
                                                      )}
                                                  </FormHelperText>
                                              )}
                                          </FormControl>
                                      </Grid>
                                  );
                              })()
                            : null}
                    </Grid>

                    <Grid container size={{ sm: 12, md: 6 }}>
                        <Grid size={{ sm: 6, md: 3 }}>
                            <Button
                                onClick={() => {
                                    closeFileUploader();
                                    setTabIndex(0);
                                }}
                                sx={{
                                    marginBottom: '10px',
                                    marginLeft: '15px',
                                    padding: '3px',
                                    backgroundColor: '#f5f5f5',
                                    color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                            >
                                {t('common.close')}
                            </Button>
                        </Grid>
                        <Grid
                            size={{ sm: 6, md: 3 }}
                            sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={
                                    files.filter((doc: UploadFileItem) => doc.status === READY)
                                        .length === 0
                                }
                                onClick={() => uploadDocuments('CONFIRM')}
                                sx={{
                                    marginBottom: '10px',
                                    marginRight: '15px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                }}
                            >
                                {t('common.import-document')} (
                                {JSON.stringify(
                                    files.filter((doc: UploadFileItem) => doc.status === READY)
                                        .length,
                                )}
                                )
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}
