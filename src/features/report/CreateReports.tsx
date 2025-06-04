import {
    Button,
    Divider,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormControlLabel,
    Switch,
    Checkbox,
    ListItemText,
    Autocomplete,
    Drawer,
    Container,
    Stack,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
} from '@mui/material';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { t } from 'i18next';
import { Close, ExpandMore } from '@mui/icons-material';

interface CreateReportsProps {
    open: boolean;
    onClose: any;
}

const CreateReports = ({ open, onClose }: CreateReportsProps) => {
    const [selectedReportsTypeValue, setSelectedReportsTypeValue] = useState<string | number>('');
    const [isStatusChecked, setIsStatusChecked] = useState<boolean>(false);
    const [ispriorityChecked, setIspriorityChecked] = useState<boolean>(false);
    const [isCentreChecked, setIsCentreChecked] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [isDueDateChecked, setIsDueDateChecked] = useState<boolean>(false);
    const [isCreatedDateChecked, setIsCreatedDateChecked] = useState<boolean>(false);
    const [isLastUpdatedChecked, setIsLastUpdatedChecked] = useState<boolean>(false);
    const [isCompletionChecked, setIsCompletionChecked] = useState<boolean>(false);

    const types = [
        { id: '1', label: 'Activity report' },
        { id: '2', label: 'Performance report' },
    ];

    const options = [
        { id: 'Open Tickets Count', label: 'Open Tickets Count' },
        { id: 'Total Tickets Created', label: 'Total Tickets Created' },
        { id: 'Tickets Resolved Count', label: 'Tickets Resolved Count' },
        { id: 'Overdue Tickets Count', label: 'Overdue Tickets Count' },
        {
            id: 'Percentage Overdue Tickets',
            label: 'Percentage Overdue Tickets',
        },
        { id: 'Average Resolution Time', label: 'Average Resolution Time' },
    ];

    const [tags] = useState([
        { id: '1', name: 'Open Tickets Count' },
        { id: '2', name: 'Total Tickets Created' },
        { id: '3', name: 'Tickets Resolved Count' },
        { id: '4', name: 'Overdue Tickets Count' },
        { id: '5', name: 'Percentage Overdue Tickets' },
        { id: '6', name: 'Average Resolution Time' },
    ]);

    const [priority] = useState([
        { id: '1', name: 'Open' },
        { id: '2', name: 'Inprogress' },
        { id: '3', name: 'Completed' },
    ]);

    const [days] = useState([
        { id: '1', name: 'Last 3 days' },
        { id: '2', name: 'Last 7 days' },
        { id: '3', name: 'Last 15 days' },
        { id: '4', name: 'Last 31 days' },
        { id: '5', name: 'Last 90 days' },
        { id: '6', name: 'Last 180 days' },
        { id: '7', name: 'Last 360 days' },
        { id: '8', name: 'Last 360 days' },
    ]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedDueDate, setSelectedDueDate] = useState<{ id: string; name: string }[]>([]);
    const [selectedCreatedDate, setSelectedCreatedDate] = useState<{ id: string; name: string }[]>(
        [],
    );
    const [selectedLastUpdated, setSelectedLastUpdated] = useState<{ id: string; name: string }[]>(
        [],
    );
    const [selectedCompletionDate, setSelectedCompletionDate] = useState<
        { id: string; name: string }[]
    >([]);
    const [selectedPriority, setselectedPriority] = useState<{ id: string; name: string }[]>([]);
    const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<{ id: string; name: string }[]>([]);

    const handleChangepriority = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIspriorityChecked(event.target.checked);
    };

    const handleChangeDueDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsDueDateChecked(event.target.checked);
    };

    const handleChangeCreatedDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCreatedDateChecked(event.target.checked);
    };

    const handleChangeCompletion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCompletionChecked(event.target.checked);
    };

    const handleChangeLastUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLastUpdatedChecked(event.target.checked);
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsStatusChecked(event.target.checked);
    };

    const handleChangeCentre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCentreChecked(event.target.checked);
    };
    /*
    const handleButtonClick = () => {
        navigate('/productivity-landing');
    };
*/

    return (
        <Drawer anchor="right" open={open} onClose={() => onClose(false)}>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                        {t('report.create-report')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={() => onClose(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <Grid container sx={{ mx: 2 }}>
                    {/* <Grid size={{ xs: 6, sm: 12 }}>
                        <Typography
                            sx={{ fontSize: '20px', fontWeight: 'bold', pt: 2 }}
                            gutterBottom
                        >
                            {t('report.create-report')}
                        </Typography>
                        <IconButton
                            edge="end"
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 16,
                                zIndex: 1000,
                                color: 'text.primary',
                            }}
                            onClick={() => onClose(false)}
                        >
                            <Close />
                        </IconButton>
                        <Divider sx={{ mx: -6 }} />
                    </Grid> */}

                    <Accordion sx={{ width: '100%', mt: 2 }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                                {t('report.report-modal-subtitle-1')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container rowGap={4}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            select
                                            label={t('report.report-type')}
                                            value={selectedReportsTypeValue}
                                            onChange={(e) =>
                                                setSelectedReportsTypeValue(e.target.value)
                                            }
                                            variant="outlined"
                                            sx={{ width: '100%' }}
                                        >
                                            {types.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="reports-name"
                                        label={t('report.name')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <TextField
                                        label={t('contractor.description')}
                                        variant="outlined"
                                        multiline
                                        rows={1}
                                        fullWidth
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isCentreChecked}
                                                onChange={handleChangeCentre}
                                                name="isCentre"
                                                color="primary"
                                            />
                                        }
                                        label={t('common.centre')}
                                        labelPlacement="end"
                                        sx={{
                                            padding: '10px',
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="multi-select-label">
                                            {t('common.options')}
                                        </InputLabel>
                                        <Select
                                            labelId="multi-select-label"
                                            label={t('common.options')}
                                            variant="outlined"
                                            multiple
                                            value={selectedOptions}
                                            //       onChange={handleSelectChange}
                                            onChange={(event) => {
                                                setSelectedOptions(event.target.value as string[]);
                                            }}
                                            renderValue={(selected) =>
                                                (selected as string[]).join(', ')
                                            }
                                        >
                                            {options.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    <Stack
                                                        alignItems="center"
                                                        width="100%"
                                                        justifyContent="space-between"
                                                        direction="row"
                                                    >
                                                        <ListItemText primary={option.label} />
                                                        <Checkbox
                                                            checked={
                                                                selectedOptions.indexOf(option.id) >
                                                                -1
                                                            }
                                                        />
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ width: '100%' }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                                {t('report.report-modal-subtitle-2')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container rowGap={4}>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Autocomplete
                                        multiple
                                        options={tags}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedTags}
                                        onChange={(
                                            _,
                                            newValue:
                                                | {
                                                      id: string;
                                                      name: string;
                                                  }[]
                                                | null,
                                        ) => {
                                            setSelectedTags(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.columns')}
                                                placeholder={t('common.columns')}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ width: '100%' }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                                {t('report.report-modal-subtitle-3')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container rowGap={4}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isStatusChecked}
                                                onChange={handleChangeStatus}
                                                name="isCenter"
                                                color="primary"
                                            />
                                        }
                                        label={t('select.status')}
                                        labelPlacement="end"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={tags}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedStatus}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setSelectedStatus(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={ispriorityChecked}
                                                onChange={handleChangepriority}
                                                name="ispriority"
                                                color="primary"
                                            />
                                        }
                                        label={t('report.priority')}
                                        labelPlacement="end"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={priority}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedPriority}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setselectedPriority(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ width: '100%' }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                {t('report.report-modal-subtitle-4')}
                            </Typography>
                            <Divider sx={{ opacity: 1, my: 2 }} />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container rowGap={4}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isDueDateChecked}
                                                onChange={handleChangeDueDate}
                                                name="isDueDate"
                                                color="primary"
                                            />
                                        }
                                        label={t('report.due-date')}
                                        labelPlacement="end"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={days}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedDueDate}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setSelectedDueDate(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isCreatedDateChecked}
                                                onChange={handleChangeCreatedDate}
                                                name="isCreatedDate"
                                                color="primary"
                                            />
                                        }
                                        label={t('report.created-date')}
                                        labelPlacement="end"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={days}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedCreatedDate}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setSelectedCreatedDate(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isLastUpdatedChecked}
                                                onChange={handleChangeLastUpdate}
                                                name="isLastUpdate"
                                                color="primary"
                                            />
                                        }
                                        label={t('report.last-updated')}
                                        labelPlacement="end"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={days}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedLastUpdated}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setSelectedLastUpdated(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isCompletionChecked}
                                                onChange={handleChangeCompletion}
                                                name="isCompletion"
                                                color="primary"
                                            />
                                        }
                                        label={t('report.completion-date')}
                                        labelPlacement="end"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Autocomplete
                                        multiple
                                        options={days}
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={selectedCompletionDate}
                                        onChange={(
                                            _,
                                            newValue: { id: string; name: string }[] | null,
                                        ) => {
                                            setSelectedCompletionDate(newValue || []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('common.options')}
                                                placeholder={t('common.options')}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Grid size={{ xs: 12, sm: 12 }} sx={{ mb: 2 }} textAlign="right">
                        <Divider sx={{ mx: -6, my: 2 }} />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#F5F5F5',
                                width: 'auto',
                                color: 'black',
                                mr: 2,
                            }}
                            onClick={() => onClose(false)}
                        >
                            {t('buttons.cancel')}
                        </Button>

                        <Button variant="contained" size="medium" onClick={() => onClose(false)}>
                            {t('buttons.save')}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Drawer>
    );
};

export default CreateReports;
