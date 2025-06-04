import {
    Typography,
    Box,
    Container,
    ButtonGroup,
    Button,
    Autocomplete,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Switch,
    FormControlLabel,
    IconButton,
    Select,
    Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { AddCircle, Close } from '@mui/icons-material';

interface EmailReportDataprops {
    id?: number | null;
    fromMail: string;
    subject: string;
    message: string;
    mailTo: any;
    mailCC: any;
    mailBCC: any;
    frequency: any;
    timezoneFields: any;
    checkedDays: any;
    expiryTimes: any;
    selectedTimezones: any;
}

interface EmailReportProps {
    // data?: EmailReportDataprops;
    onSubmit: any;
    onCancel: any;
    isEdit?: boolean;
}

interface FrequencyProps {
    id: number;
    name: string;
}

// type TimezoneOption = 'UTC' | 'PST' | 'EST' | 'CST';
interface TimezoneField {
    id: number;
    selectedTime: Date | null;
    selectedTimezone: any;
}
interface FieldGroup {
    dayOfMonth: number | '';
    time: Date | null;
    timezone: string;
}

const emailToList = [{ mail: 'info@sample.com' }];
const emailCCList = [{ mail: 'alex.dixon@gmail.com' }, { mail: 'a-smith@hotmail.co.uk' }];
const emailBCCList = [{ mail: 'jonathan.smith@google.mail.com' }];

const timezoneList = [
    { id: 'America/New_York', name: 'Eastern Standard Time (EST)' },
    { id: 'America/Chicago', name: 'Central Standard Time (CST)' },
    { id: 'America/Los_Angeles', name: 'Pacific Standard Time (PST)' },
    { id: 'Europe/London', name: 'Greenwich Mean Time (GMT)' },
];

const weekdays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
];

const EmailReport = ({
    // data,
    onCancel,
    onSubmit,
    isEdit = false,
}: EmailReportProps) => {
    const { t } = useTranslation();
    const [activeButton, setActiveButton] = useState(false);
    const [isSchedule, setIsSchedule] = useState(false);
    const [fromMail, setFromMail] = useState<string>('');
    const [selectedMailTo, setSelectedMailTo] = useState<string[]>([emailToList[0].mail]);
    const [selectedMailCC, setSelectedMailCC] = useState<string[]>([
        emailCCList[0].mail,
        emailCCList[1].mail,
    ]);
    const [selectedMailBCC, setSelectedMailBCC] = useState<string[]>([emailBCCList[0].mail]);
    const [mailSubject, setMailSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [selectedFrequency, setSelectedFrequency] = useState<FrequencyProps | null>(null);
    const [frequencyList, setFrequencyList] = useState<FrequencyProps[]>([]);
    // const [expiryTime, setExpiryTime] = useState<Date>(new Date());
    // const [selectedTimezone, setSelectedTimezone] = useState(
    //     'America/Los_Angeles',
    // );
    const [checkedDays, setCheckedDays] = useState<{ [key: string]: boolean }>({});
    const [expiryTimes, setExpiryTimes] = useState<{
        [key: string]: Date | null;
    }>({});
    const [selectedTimezones, setSelectedTimezones] = useState<{
        [key: string]: string;
    }>({});

    const [timezoneFields, setTimezoneFields] = useState<TimezoneField[]>([
        { id: 1, selectedTime: null, selectedTimezone: 'America/New_York' }, // Default value is one of the valid timezones
    ]);

    const [fields, setFields] = useState<FieldGroup[]>([
        { dayOfMonth: '', time: null, timezone: '' },
    ]);

    // const timeZoneOptions: TimezoneOption[] = ['UTC', 'PST', 'EST', 'CST'];

    useEffect(() => {
        getFrequencies();
    }, []);

    useEffect(() => {
        if (selectedFrequency) {
            setTimezoneFields([{ id: 1, selectedTime: null, selectedTimezone: '' }]);
        }
    }, [selectedFrequency]);

    useEffect(() => {
        if (frequencyList?.length) setSelectedFrequency(frequencyList[1]); // default
        setTimezoneFields([
            {
                id: 1,
                selectedTime: null,
                selectedTimezone: 'UTC',
            },
        ]);
    }, [frequencyList]);

    const handleButtonClick = (index: any, schedule: boolean) => {
        setActiveButton(index);
        setIsSchedule(schedule);
    };

    const submitForm = () => {
        // Create a JSON object with all form data
        const contractorData: EmailReportDataprops = {
            fromMail: fromMail,
            subject: mailSubject,
            message: message,
            mailTo: selectedMailTo,
            mailCC: selectedMailCC,
            mailBCC: selectedMailBCC,
            frequency: selectedFrequency,
            timezoneFields: timezoneFields,
            checkedDays: checkedDays,
            expiryTimes: expiryTimes,
            selectedTimezones: selectedTimezones,
        };

        onSubmit(contractorData);
    };

    const getFrequencies = () => {
        // api here to fetch all required frequencies
        setFrequencyList([
            { id: 1, name: 'Daily' },
            { id: 2, name: 'Weekly' },
            { id: 3, name: 'Monthly' },
        ]);
    };

    const handleSwitchChange = (day: any) => (event: any) => {
        setCheckedDays({
            ...checkedDays,
            [day]: event.target.checked,
        });
    };

    const handleTimeChange = (day: string) => (newValue: Date | null) => {
        setExpiryTimes({
            ...expiryTimes,
            [day]: newValue,
        });
    };

    const handleTimezoneChange = (day: string, event: any) => {
        setSelectedTimezones((prevState) => ({
            ...prevState,
            [day]: event.target.value as string, // Use the event to get the new selected value
        }));
    };

    // Handle Time Change
    const handleTimeChange2 = (id: number, newTime: Date | null) => {
        const updatedFields = timezoneFields.map((field) =>
            field.id === id ? { ...field, selectedTime: newTime } : field,
        );
        setTimezoneFields(updatedFields);
    };

    // Handle Timezone Change
    const handleTimezoneChange2 = (id: number, event: any) => {
        const updatedFields = timezoneFields.map((field) =>
            field.id === id ? { ...field, selectedTimezone: event.target.value } : field,
        );
        setTimezoneFields(updatedFields);
    };

    const handleFieldChange = (index: number, field: keyof FieldGroup, value: any) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = value;
        setFields(updatedFields);
    };

    const addNewField = () => {
        const newField: TimezoneField = {
            id: Date.now(),
            selectedTime: null,
            selectedTimezone: '',
        };
        setTimezoneFields([...timezoneFields, newField]);
    };

    const handleAddRow = () => {
        setFields([...fields, { dayOfMonth: '', time: null, timezone: '' }]);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ padding: '1px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '60px',
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                        {isEdit
                            ? t('report.productivityReport')
                            : t('reporting.send-report-as-email')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onCancel}>
                        <Close />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2, mx: -5 }} />

                <form>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <ButtonGroup
                                disableElevation
                                variant="contained"
                                aria-label="Button group"
                            >
                                <Button
                                    onClick={() => handleButtonClick(0, false)}
                                    style={{
                                        backgroundColor: !activeButton ? '#e0e0e0' : 'white',
                                        color: !activeButton ? 'black' : 'black',
                                        textTransform: 'none',
                                    }}
                                >
                                    {t('reporting.send-email-now')}
                                </Button>
                                <Button
                                    onClick={() => handleButtonClick(1, true)}
                                    style={{
                                        backgroundColor: activeButton ? '#e0e0e0' : 'white',
                                        color: activeButton ? 'black' : 'black',
                                        textTransform: 'none',
                                    }}
                                >
                                    {t('reporting.create-a-schedule')}
                                </Button>
                            </ButtonGroup>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <TextField
                                id="reporting.from"
                                label={t('reporting.from')}
                                fullWidth
                                value={fromMail}
                                placeholder="Default will appear as from “Mallcomm”"
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                onChange={(e) => {
                                    setFromMail(e.target.value);
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <Autocomplete
                                multiple
                                id="tags-email-to"
                                options={emailToList.map((option) => option.mail)}
                                value={selectedMailTo}
                                onChange={(_, newValue) => {
                                    setSelectedMailTo(newValue);
                                }}
                                freeSolo // Allow free typing
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => {
                                        const { key, ...tagProps } = getTagProps({
                                            index,
                                        });
                                        return (
                                            <Chip
                                                avatar={
                                                    <Avatar
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {option.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                }
                                                variant="outlined"
                                                label={option}
                                                key={key}
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('reporting.email-to')}
                                        placeholder=""
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <Autocomplete
                                multiple
                                id="tags-email-cc"
                                options={emailCCList.map((option) => option.mail)}
                                value={selectedMailCC}
                                onChange={(_, newValue) => {
                                    setSelectedMailCC(newValue);
                                }}
                                freeSolo // Allow free typing
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => {
                                        const { key, ...tagProps } = getTagProps({
                                            index,
                                        });
                                        return (
                                            <Chip
                                                avatar={
                                                    <Avatar
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {option.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                }
                                                variant="outlined"
                                                label={option}
                                                key={key}
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('reporting.email-cc')}
                                        placeholder=""
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <Autocomplete
                                multiple
                                id="tags-email-bcc"
                                options={emailBCCList.map((option) => option.mail)}
                                value={selectedMailBCC}
                                onChange={(_, newValue) => {
                                    setSelectedMailBCC(newValue);
                                }}
                                freeSolo // Allow free typing
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => {
                                        const { key, ...tagProps } = getTagProps({
                                            index,
                                        });
                                        return (
                                            <Chip
                                                avatar={
                                                    <Avatar
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {option.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                }
                                                variant="outlined"
                                                label={option}
                                                key={key}
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('reporting.email-bcc')}
                                        placeholder=""
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} sx={{ marginBottom: 2 }}>
                            <TextField
                                id="reporting.subject"
                                label={t('reporting.subject')}
                                fullWidth
                                value={mailSubject}
                                placeholder=""
                                onChange={(e) => {
                                    setMailSubject(e.target.value);
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                            <TextField
                                label={t('reporting.message')}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                            />
                        </Grid>

                        {isSchedule && (
                            <>
                                <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                                    {/* <p>create schedule here..</p> */}
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ marginBottom: 2 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="frequency-name-label">
                                                {t('reporting.frequency')}
                                            </InputLabel>
                                            <Select
                                                labelId="frequency-name-select"
                                                value={selectedFrequency?.id || ''}
                                                label={t('reporting.frequency')}
                                                onChange={(e) => {
                                                    setSelectedFrequency(
                                                        frequencyList.find(
                                                            (frequency) =>
                                                                frequency.id === e.target.value,
                                                        ) || null,
                                                    );
                                                }}
                                            >
                                                {frequencyList.map((frequency) => (
                                                    <MenuItem
                                                        key={frequency.id}
                                                        value={frequency.id}
                                                    >
                                                        {frequency.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>{' '}
                                    </Grid>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                                    {selectedFrequency && selectedFrequency.name === 'Weekly' && (
                                        <Grid container spacing={2}>
                                            {weekdays.map((weekday: any) => (
                                                <Grid size={{ xs: 12 }} key={weekday.id}>
                                                    <Grid display="flex" alignItems="center">
                                                        <Grid
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            {' '}
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={
                                                                            checkedDays[
                                                                                weekday.id
                                                                            ] || false
                                                                        }
                                                                        onChange={handleSwitchChange(
                                                                            weekday.id,
                                                                        )}
                                                                        inputProps={{
                                                                            'aria-label': `controlled-${weekday.id}`,
                                                                        }}
                                                                    />
                                                                }
                                                                label={weekday.label}
                                                            />{' '}
                                                        </Grid>

                                                        {/* {checkedDays[
                                                                    weekday.id
                                                                ] && ( */}
                                                        <Grid
                                                            marginLeft={2}
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterDateFns}
                                                            >
                                                                <DesktopTimePicker
                                                                    label={t('reporting.set-time')}
                                                                    views={['hours', 'minutes']}
                                                                    ampm={false}
                                                                    value={
                                                                        expiryTimes[weekday.id] ||
                                                                        null
                                                                    }
                                                                    onChange={handleTimeChange(
                                                                        weekday.id,
                                                                    )}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>

                                                        <Grid
                                                            marginLeft={2}
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <FormControl fullWidth>
                                                                <InputLabel
                                                                    id={`timezone-label-${weekday.id}`}
                                                                >
                                                                    {t('reporting.timezone')}
                                                                </InputLabel>
                                                                <Select
                                                                    labelId={`timezone-select-${weekday.id}`}
                                                                    value={
                                                                        selectedTimezones[
                                                                            weekday.id
                                                                        ] || ''
                                                                    } // Fallback to empty string if not selected
                                                                    label={t('reporting.timezone')}
                                                                    onChange={(event) =>
                                                                        handleTimezoneChange(
                                                                            weekday.id,
                                                                            event,
                                                                        )
                                                                    }
                                                                >
                                                                    {timezoneList.map(
                                                                        (timezone) => (
                                                                            <MenuItem
                                                                                key={timezone.id}
                                                                                value={timezone.id}
                                                                            >
                                                                                {timezone.name}
                                                                            </MenuItem>
                                                                        ),
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        {/* )} */}
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}

                                    {/* Daily selection UI */}
                                    {selectedFrequency && selectedFrequency.name === 'Daily' && (
                                        <Grid container spacing={2} sx={{ width: '75%' }}>
                                            {timezoneFields.map((field) => (
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    key={field.id}
                                                    size={{ xs: 12 }}
                                                >
                                                    <Grid
                                                        sx={{ width: 500 }}
                                                        size={{
                                                            xs: 12,
                                                            sm: 6,
                                                            md: 6,
                                                            lg: 6,
                                                        }}
                                                    >
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDateFns}
                                                        >
                                                            <DesktopTimePicker
                                                                label={t('reporting.set-time')}
                                                                ampm={false}
                                                                value={field.selectedTime}
                                                                onChange={(newTime) =>
                                                                    handleTimeChange2(
                                                                        field.id,
                                                                        newTime,
                                                                    )
                                                                }
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                    },
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6,
                                                            md: 6,
                                                            lg: 6,
                                                        }}
                                                        sx={{ width: 500 }}
                                                    >
                                                        <FormControl fullWidth>
                                                            <InputLabel>Time Zone</InputLabel>
                                                            <Select
                                                                value={field.selectedTimezone}
                                                                onChange={(e) =>
                                                                    handleTimezoneChange2(
                                                                        field.id,
                                                                        e,
                                                                    )
                                                                }
                                                                label="Time Zone"
                                                            >
                                                                {timezoneList.map((timezone) => (
                                                                    <MenuItem
                                                                        key={timezone.id}
                                                                        value={timezone.id}
                                                                    >
                                                                        {timezone.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                            <Grid
                                                size={{ xs: 12 }}
                                                container
                                                justifyContent="flex-start"
                                            >
                                                <IconButton
                                                    style={{
                                                        color: '#757575',
                                                    }}
                                                    onClick={addNewField}
                                                >
                                                    <AddCircle fontSize="large" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {/* Monthly selection UI */}
                                    {selectedFrequency && selectedFrequency.name === 'Monthly' && (
                                        <Grid container spacing={2}>
                                            {/* Fields Rendering */}
                                            {fields.map((field, index) => (
                                                <Grid
                                                    size={{ xs: 12 }}
                                                    spacing={2}
                                                    key={index}
                                                    // sx={{
                                                    //     marginBottom: 2,
                                                    // }}
                                                >
                                                    <Grid display="flex" alignItems="center">
                                                        {/* Day of the Month Selector */}
                                                        <Grid
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <TextField
                                                                select
                                                                label="Day of Month"
                                                                fullWidth
                                                                value={field.dayOfMonth}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        'dayOfMonth',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                variant="outlined"
                                                            >
                                                                {[...Array(31)].map((_, i) => (
                                                                    <MenuItem key={i} value={i + 1}>
                                                                        {i + 1}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </Grid>

                                                        {/* Time Picker */}
                                                        <Grid
                                                            marginLeft={2}
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <LocalizationProvider
                                                                dateAdapter={AdapterDateFns}
                                                            >
                                                                <DesktopTimePicker
                                                                    label="Set Time"
                                                                    value={field.time}
                                                                    ampm={false}
                                                                    onChange={(newTime) =>
                                                                        handleFieldChange(
                                                                            index,
                                                                            'time',
                                                                            newTime,
                                                                        )
                                                                    }
                                                                    // renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                                                />{' '}
                                                            </LocalizationProvider>
                                                        </Grid>

                                                        {/* Timezone Selector */}
                                                        <Grid
                                                            marginLeft={2}
                                                            size={{
                                                                xs: 2,
                                                                sm: 4,
                                                                md: 4,
                                                            }}
                                                        >
                                                            <FormControl
                                                                fullWidth
                                                                variant="outlined"
                                                            >
                                                                <InputLabel>Time zone</InputLabel>
                                                                <Select
                                                                    value={field.timezone}
                                                                    onChange={(e) =>
                                                                        handleFieldChange(
                                                                            index,
                                                                            'timezone',
                                                                            e.target.value,
                                                                        )
                                                                    }
                                                                    label="Timezone"
                                                                >
                                                                    {timezoneList.map(
                                                                        (timezone) => (
                                                                            <MenuItem
                                                                                key={timezone.id}
                                                                                value={timezone.id}
                                                                            >
                                                                                {timezone.name}
                                                                            </MenuItem>
                                                                        ),
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            ))}

                                            {/* Add Row Button */}
                                            <Grid container justifyContent="flex-start">
                                                <Grid>
                                                    <IconButton
                                                        style={{
                                                            color: '#757575',
                                                        }}
                                                        onClick={handleAddRow}
                                                    >
                                                        <AddCircle fontSize="large" />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </>
                        )}

                        {/* Divider before Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ marginY: 2 }} />
                        </Grid>

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }} textAlign="right" marginBottom={5}>
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2, textTransform: 'none' }}
                                onClick={onCancel}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ marginRight: 2, textTransform: 'none' }}
                                onClick={submitForm}
                            >
                                {isEdit ? t('buttons.update') : t('buttons.send')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default EmailReport;
