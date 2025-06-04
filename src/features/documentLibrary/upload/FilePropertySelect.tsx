import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface FilePropertySelectProps {
    propertyId: string | null;
    properties: { id: string; name: string }[];
    onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
    error: boolean;
    helperText: string;
}

const FilePropertySelect = ({
    propertyId,
    properties,
    onChange,
    error,
    helperText,
}: FilePropertySelectProps) => {
    return (
        <FormControl sx={{ mt: 2 }} size="small" fullWidth error={error}>
            <InputLabel id="demo-select-small-label">Property</InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={propertyId || ''}
                label="Property"
                onChange={() => onChange}
            >
                {properties.map((property, index) => (
                    <MenuItem key={index} value={property.id}>
                        {property.name}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default FilePropertySelect;
