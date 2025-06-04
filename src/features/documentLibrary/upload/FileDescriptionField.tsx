import { TextField } from '@mui/material';

interface FileDescriptionFieldProps {
    description: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileDescriptionField = ({ description, onChange }: FileDescriptionFieldProps) => {
    return (
        <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            sx={{ marginTop: '20px' }}
            value={description}
            onChange={onChange}
        />
    );
};

export default FileDescriptionField;
