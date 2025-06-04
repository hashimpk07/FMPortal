import {
    Typography,
    Box,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createWorkOrder } from '../../services/workOrders/ticketWorkOrderService';

interface CreateWorkOrderFormProps {
    assetId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

function CreateWorkOrderForm({ assetId, onCancel, onSuccess }: CreateWorkOrderFormProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(new Date());
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('');
    const [contractor, setContractor] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Mock data for categories, contractors, specialists
    const categories = [
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'cleaning', name: 'Cleaning' },
        { id: 'security', name: 'Security' },
        { id: 'electrical', name: 'Electrical' },
        { id: 'plumbing', name: 'Plumbing' },
    ];

    const contractors = [
        { id: 'safetyFirst', name: 'SafetyFirst Ltd' },
        { id: 'cleanCo', name: 'CleanCo' },
        { id: 'elevateServices', name: 'ElevateServices' },
        { id: 'supplyChain', name: 'SupplyChain Inc' },
        { id: 'brightLights', name: 'BrightLights' },
        { id: 'pestAway', name: 'PestAway' },
    ];

    const specialists = [
        { id: 'john_smith', name: 'John Smith' },
        { id: 'maria_johnson', name: 'Maria Johnson' },
        { id: 'robert_chen', name: 'Robert Chen' },
        { id: 'sarah_williams', name: 'Sarah Williams' },
        { id: 'michael_davis', name: 'Michael Davis' },
        { id: 'thomas_brown', name: 'Thomas Brown' },
    ];

    const statuses = [
        { id: 'pending', name: 'Pending' },
        { id: 'in_progress', name: 'In Progress' },
        { id: 'completed', name: 'Completed' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !dueDate) {
            setError(t('validation.required-fields-missing'));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createWorkOrder({
                title: name,
                details: description,
                reserved_due_date:
                    dueDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                reserved_priority:
                    status === 'pending' ? '4' : status === 'in_progress' ? '3' : '2',
                assetId,
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            console.error('Error creating work order:', err);
            setError(err instanceof Error ? err.message : t('errors.unknown'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Alert severity="success" sx={{ mb: 2 }}>
                    {t('work-order.create-success')}
                </Alert>
                <Typography>{t('work-order.redirecting')}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h6" gutterBottom>
                {t('work-order.create-new')}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('asset.name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                required
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('asset.description')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('work-order.due-date')}
                                    value={dueDate}
                                    onChange={(newValue) => setDueDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            disabled: loading,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth disabled={loading}>
                                <InputLabel id="status-label">{t('asset.status')}</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={status}
                                    label={t('asset.status')}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    {statuses.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth disabled={loading}>
                                <InputLabel id="category-label">{t('asset.category')}</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={category}
                                    label={t('asset.category')}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>{t('asset.none')}</em>
                                    </MenuItem>
                                    {categories.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth disabled={loading}>
                                <InputLabel id="contractor-label">
                                    {t('asset.contractor')}
                                </InputLabel>
                                <Select
                                    labelId="contractor-label"
                                    value={contractor}
                                    label={t('asset.contractor')}
                                    onChange={(e) => setContractor(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>{t('asset.none')}</em>
                                    </MenuItem>
                                    {contractors.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth disabled={loading}>
                                <InputLabel id="specialist-label">
                                    {t('asset.specialist')}
                                </InputLabel>
                                <Select
                                    labelId="specialist-label"
                                    value={specialist}
                                    label={t('asset.specialist')}
                                    onChange={(e) => setSpecialist(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>{t('asset.none')}</em>
                                    </MenuItem>
                                    {specialists.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label={t('asset.email')}
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                fullWidth
                                type="email"
                                disabled={loading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label={t('asset.phone')}
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                fullWidth
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 3,
                        }}
                    >
                        <Button variant="outlined" onClick={onCancel} disabled={loading}>
                            {t('asset.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={loading || !name || !dueDate}
                        >
                            {loading ? <CircularProgress size={24} /> : t('buttons.create')}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Container>
    );
}

export default CreateWorkOrderForm;
