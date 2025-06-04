import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FileInputImage = ({
    imageUrl,
    fileName,
    handleDelete,
}: {
    imageUrl: string;
    fileName: string;
    handleDelete: () => void;
}) => {
    return (
        <Card
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
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
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={imageUrl}
                alt={fileName} // data?.fileObject?.name
            />
        </Card>
    );
};

export default FileInputImage;
