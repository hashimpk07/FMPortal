import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface FileTypeSelectProps {
    typeId: string | null;
    documentTypes: { id: string; name: string }[];
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    error: boolean;
    helperText: string;
}

const FileTypeSelect = ({
    typeId,
    documentTypes,
    onChange,
    error,
    helperText,
}: FileTypeSelectProps) => {
    return (
        <FormControl sx={{ mt: 2 }} size="small" fullWidth error={error}>
            <InputLabel id="demo-select-small-label">Type</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={typeId || ''}
                label="Type"
                onChange={() => onChange}
            >
                {documentTypes.map((type, index) => (
                    <MenuItem key={index} value={type.id}>
                        {type.name}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default FileTypeSelect;
