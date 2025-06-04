import { FormControl, TextField, FormHelperText } from '@mui/material';

interface FileNameFieldProps {
    fileName: string;
    error: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    helperText: string;
}

const FileNameField = ({ fileName, error, onChange, helperText }: FileNameFieldProps) => {
    return (
        <FormControl fullWidth error={error}>
            <TextField
                error={error}
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ marginTop: '20px' }}
                value={fileName}
                onChange={onChange}
            />
            {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default FileNameField;
