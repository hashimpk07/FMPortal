import { Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { UploadFileItem } from './types';

interface FileAlertProps {
    file: UploadFileItem;
    fieldValidation: (file: UploadFileItem) => string;
}

const FileAlert: React.FC<FileAlertProps> = ({ file, fieldValidation }) => {
    const READY = 'READY';

    return (
        <Alert
            severity={file?.status === READY ? 'success' : 'warning'}
            iconMapping={{
                success: <CheckCircleOutlineIcon />,
                warning:
                    !file?.isValid?.size || !file?.isValid?.type ? (
                        <WarningIcon sx={{ color: 'red' }} />
                    ) : (
                        <ErrorOutlinedIcon sx={{ color: '#FED86F' }} />
                    ),
            }}
            sx={{
                marginLeft: '25px',
                bgcolor: file?.status === READY ? 'rgb(237, 247, 237)' : '#FCF1D5',
                borderLeft: file?.status === READY ? '4px solid #0d47a1' : '4px solid #FED86F',
            }}
        >
            {file?.status === READY ? 'Ready to import' : fieldValidation(file)}
        </Alert>
    );
};

export default FileAlert;
