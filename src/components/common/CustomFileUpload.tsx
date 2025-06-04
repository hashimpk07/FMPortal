import React from 'react';
import { Box, Typography, Chip, Button, Avatar } from '@mui/material';
import { Stack } from '@mui/system';

interface CustomFileUploadProps {
    files: any[];
    setFiles: React.Dispatch<React.SetStateAction<any[]>>;
    label?: string;
    buttonLabel?: string;
    title?: string;
    fileTypeLabel?: string;
    multiple?: boolean;
    showUploadedFiles?: boolean;
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({
    files,
    setFiles,
    label = 'Drop a file',
    buttonLabel = 'Choose files',
    title = 'Drag and drop your files here',
    fileTypeLabel = 'Supported files: PDF, DOC, JPG, PNG',
    multiple = true,
    showUploadedFiles = true,
}) => {
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles?.length) {
            let newFiles: any[] = [];
            Array.from(droppedFiles).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newFiles.push({ file, preview: reader.result as string });
                    if (newFiles.length === droppedFiles.length) {
                        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDelete = (fileName: string) => {
        setFiles((prevFiles) => prevFiles.filter((doc) => doc.file.name !== fileName));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;

        if (selectedFiles?.length) {
            const newFiles: any[] = [];
            Array.from(selectedFiles).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newFiles.push({ file, preview: reader.result as string });

                    // After reading all files, update the state
                    if (newFiles.length === selectedFiles.length) {
                        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    return (
        <>
            <Box sx={{ width: '98%' }}>
                {/* Drag and Drop Box */}
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        position: 'relative',
                        width: '98%',
                        height: 100,
                        border: '2px dotted',
                        borderColor: 'text.secondary',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        transition: 'border-color 0.3s ease, color 0.3s ease',

                        '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                        },

                        '&:focus-within': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                        },
                    }}
                >
                    {/* Label */}
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            backgroundColor: 'white',
                            paddingLeft: 1,
                            paddingRight: 1,
                            position: 'absolute',
                            top: -8,
                            left: 16,
                            transition: 'top 0.2s, font-size 0.2s, color 0.2s',
                            '&:hover': {
                                color: 'primary.main',
                            },
                            '&:focus-within': {
                                color: 'primary.main',
                                top: -8,
                                fontSize: '0.75rem',
                            },
                        }}
                    >
                        {label}
                    </Typography>

                    {/* Drag and Drop Text */}
                    <Typography
                        sx={{
                            textAlign: 'center',
                            fontSize: '1rem', // Increased size for better readability
                            marginBottom: 1,
                            fontWeight: 'bold',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                            '&:focus-within': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Supported Files Text */}
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: '0.875rem', // Slightly smaller font
                            marginBottom: 2,
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: 'primary.main',
                            },
                            '&:focus-within': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {showUploadedFiles && fileTypeLabel}
                    </Typography>

                    {/* File Upload Button */}
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderColor: '#bdbdbd',
                            color: 'black',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        component="label"
                    >
                        {buttonLabel}
                        <input multiple={multiple} type="file" hidden onChange={handleFileChange} />
                    </Button>
                </Box>
            </Box>
            {/* Display selected files */}
            {files.length > 0 && showUploadedFiles && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', // Increased minimum width for columns
                        gap: 1,
                        marginTop: 2,
                        justifyItems: 'start',
                        maxWidth: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {files.map((doc, index) => (
                        <Chip
                            key={index}
                            label={
                                <Stack
                                    direction={'row'}
                                    gap={2}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    {doc.preview && (
                                        <Avatar
                                            sx={{
                                                width: 55,
                                                height: 35,
                                                borderRadius: 2,
                                            }}
                                            src={doc.preview}
                                        />
                                    )}
                                    {doc?.file?.name || ''}
                                </Stack>
                            }
                            onDelete={() => handleDelete(doc?.file?.name)}
                            sx={{
                                marginBottom: 1,
                                height: 40,
                                width: 'auto', // Adjust width to accommodate text
                                minWidth: 160, // Ensure a minimum width to fit content
                                maxWidth: '100%', // Allow flexibility in width
                            }}
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default CustomFileUpload;
