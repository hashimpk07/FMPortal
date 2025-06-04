import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FileInputAttachment = ({
    fileName,
    handleDelete,
    fileUrl,
}: {
    fileName: string;
    fileUrl?: string;
    handleDelete: () => void;
}) => {
    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent
                    sx={{
                        display: 'flex',
                        alignItems: 'space-between',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {fileName}
                    </Typography>
                </CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pl: 1,
                        pb: 1,
                    }}
                >
                    <IconButton onClick={() => handleDelete()}>
                        <DeleteIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    {fileUrl && (
                        <IconButton
                            onClick={() => {
                                window.open(fileUrl);
                            }}
                        >
                            <VisibilityIcon sx={{ height: 38, width: 38 }} />
                        </IconButton>
                    )}
                </Box>
            </Box>
            <Box sx={{ width: 50 }}>
                <InsertDriveFileIcon fontSize="large" />
            </Box>
        </Card>
    );
};

export default FileInputAttachment;
