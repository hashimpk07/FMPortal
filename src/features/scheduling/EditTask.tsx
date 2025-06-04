import { Close, Delete, Edit, LinkOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTranslation } from 'react-i18next';
import { Fragment, useEffect, useState } from 'react';
import AssignToAsset from './AssignToAsset';
import CustomFileUpload from '../../components/common/CustomFileUpload';

const EditTask = ({ onClose, isEdit }: any) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [assignToAsset, setAssignToAsset] = useState(false);
    const [taskTypes] = useState([
        { id: '1', name: 'Case' },
        { id: '2', name: 'Inspection' },
        { id: '3', name: 'Work Order' },
        { id: '4', name: 'Property Compliance' },
    ]);
    const [taskType, setTaskType] = useState('1');
    const [frequencies] = useState([
        { id: '1', name: 'Does not repeat' },
        { id: '2', name: 'Repeats daily' },
        { id: '3', name: 'Repeats weekly' },
        { id: '4', name: 'Repeats monthly' },
        { id: '5', name: 'Repeats yearly' },
    ]);
    const [monthlyFrqOptions] = useState([
        { id: 'on', label: 'On' },
        { id: 'every', label: 'Every' },
    ]);
    const [everyMonthFrqValues] = useState(['First', 'Second', 'Third', 'Fourth', 'Last']);
    const [everyMonthFrqTypes] = useState([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Day',
        'Weekday',
        'Weekend day',
    ]);
    const [selectedEveryMonthFrqValue, setSelectedEveryMonthFrqValue] = useState('First');
    const [selectedEveryMonthFrqType, setSelectedEveryMonthFrqType] = useState('Day');
    const [selectedMonthlyFrq, setSelectedMonthlyFrq] = useState('on');
    const [selectedDayInMonth, setSelectedDayInMonth] = useState('1');
    const [selectedDateInYear, setSelectedDateInYear] = useState<Date | null>(null);

    const [dueDates, setDueDates] = useState<{ date: Date | null; time: Date | null }[]>([
        {
            date: null,
            time: null,
        },
    ]);
    const [selectedFrq, setSelectedFrq] = useState('1');
    const [toleranceValue, setToleranceValue] = useState('0');
    const [toleranceFrqs] = useState([
        { id: '1', name: 'Minutes' },
        { id: '2', name: 'Hours' },
        { id: '3', name: 'Days' },
        { id: '4', name: 'Weeks' },
        { id: '5', name: 'Months' },
    ]);
    const [selectedToleranceFrq, setSelectedToleranceFrq] = useState('1');
    const [checkedDays, setCheckedDays] = useState<{ [key: string]: boolean }>({});

    const [showAssignAssetModal, setAssignAssetModal] = useState(false);

    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

    const [title, setTitle] = useState('');

    const [description, setDescription] = useState('');

    const [attachments, setAttachments] = useState<any[]>([]);
    const { t } = useTranslation();

    const weekdays = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' },
    ];

    useEffect(() => {
        const taskData = {
            taskTitle: 'Parents and infants bathroom daily inspection',
            assignToAsset: true,
            taskType: '2',
            selectButton: '1',
            selectedFrq: '2',
            scheduleData: [
                {
                    date: new Date(2024, 3, 17),
                    time: new Date(2024, 3, 17, 5, 25),
                },
                {
                    date: new Date(2024, 5, 4),
                    time: new Date(2024, 5, 4, 6, 0),
                },
                {
                    date: new Date(2024, 4, 12),
                    time: new Date(2024, 4, 12, 13, 10),
                },
                {
                    date: new Date(2024, 4, 27),
                    time: new Date(2024, 4, 27, 3, 15),
                },
            ],
            toleranceValue: '5',
            toleranceFrq: '1',
            selectedMonthlyFrq: 'on',
        };

        if (isEdit) {
            setTaskTitle(taskData.taskTitle);
            setTaskType(taskData.taskType);
            setSelectedFrq(taskData.selectedFrq);
            setDueDates(taskData.scheduleData);
            setSelectedToleranceFrq(taskData.toleranceFrq);
            setToleranceValue(taskData.toleranceValue);
        }
    }, [isEdit]);

    const handleDueDateChange = (index: number, field: string, value: any) => {
        const updatedFields = [...dueDates] as any;
        updatedFields[index][field] = value;
        setDueDates(updatedFields);
    };

    const removeDueDate = (removeIndex: number) => {
        setDueDates(dueDates.filter((_, index) => index !== removeIndex));
    };

    const addDueDate = () => {
        setDueDates([...dueDates, { date: null, time: null }]);
    };

    const cancelTask = () => {
        onClose();
    };

    const addTask = () => {
        onClose();
    };

    const editTask = () => {
        onClose();
    };

    const ApprovedTaskExtraFields = () => {
        return (
            <>
                <Grid size={{ md: 12 }}>
                    <TextField
                        label={t('common.title')}
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid size={{ md: 12 }}>
                    <TextField
                        label={t('common.description')}
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid size={{ md: 12 }}>
                    <CustomFileUpload files={attachments} setFiles={setAttachments} />
                </Grid>
            </>
        );
    };

    const DueDateList = () => {
        const handleSwitchChange = (day: any) => (event: any) => {
            setCheckedDays({
                ...checkedDays,
                [day]: event.target.checked,
            });
        };

        return (
            <>
                {['1', '2'].includes(selectedFrq) &&
                    dueDates.map((data, index) => (
                        <Fragment key={index}>
                            <Grid
                                size={{ md: 3 }}
                                alignItems="center"
                                display="flex"
                                justifyContent="start"
                            >
                                <Typography variant="body2" sx={{ ml: 4 }} fontWeight={600}>
                                    {t('common.dueDate')}
                                </Typography>
                            </Grid>
                            <Grid size={{ md: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label={t('common.date')}
                                        format="dd/MM/yyyy"
                                        value={data.date}
                                        onChange={(newValue) =>
                                            handleDueDateChange(index, 'date', newValue)
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ md: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label={t('common.time')}
                                        views={['hours', 'minutes', 'seconds']}
                                        ampm={false}
                                        value={data.time}
                                        onChange={(newValue) =>
                                            handleDueDateChange(index, 'time', newValue)
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ md: 1 }}>
                                <IconButton
                                    title={t('scheduling.remove-due-date')}
                                    onClick={() => removeDueDate(index)}
                                >
                                    <Delete />
                                </IconButton>
                            </Grid>
                        </Fragment>
                    ))}
                {selectedFrq === '2' && (
                    <>
                        <Grid size={{ md: 3 }}> </Grid>
                        <Grid size={{ md: 9 }}>
                            <Button variant="outlined" onClick={() => addDueDate()}>
                                {t('common.add')}
                            </Button>
                        </Grid>
                    </>
                )}

                {selectedFrq === '3' && (
                    <Grid container spacing={2}>
                        {weekdays.map((weekday: any, index: number) => (
                            <Grid size={{ xs: 12 }} key={weekday.id}>
                                <Grid display="flex" alignItems="center">
                                    <Grid
                                        size={{
                                            xs: 2,
                                            sm: 4,
                                            md: 4,
                                        }}
                                    >
                                        {index === 0 && (
                                            <Typography
                                                variant="body2"
                                                sx={{ ml: 4 }}
                                                fontWeight={600}
                                            >
                                                {t('common.weekday')}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 2,
                                            sm: 4,
                                            md: 4,
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={checkedDays[weekday.id] || false}
                                                    onChange={handleSwitchChange(weekday.id)}
                                                    inputProps={{
                                                        'aria-label': `controlled-${weekday.id}`,
                                                    }}
                                                />
                                            }
                                            label={weekday.label}
                                        />{' '}
                                    </Grid>

                                    <Grid
                                        marginLeft={2}
                                        size={{
                                            xs: 2,
                                            sm: 4,
                                            md: 4,
                                        }}
                                    ></Grid>
                                    {/* )} */}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {selectedFrq === '4' && (
                    <>
                        <Grid size={{ md: 12 }}>
                            <Grid container spacing={2} alignItems="stretch" sx={{ flexGrow: 1 }}>
                                {/* Radio Buttons Column */}
                                <Grid
                                    size={{ md: 3 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <RadioGroup
                                        value={selectedMonthlyFrq}
                                        onChange={(e) => setSelectedMonthlyFrq(e.target.value)}
                                    >
                                        {monthlyFrqOptions.map((option) => (
                                            <Grid key={option.id} size={{ md: 6 }}>
                                                <FormControlLabel
                                                    value={option.id}
                                                    control={<Radio />}
                                                    label={option.label}
                                                    sx={{ pb: 2 }}
                                                />
                                            </Grid>
                                        ))}
                                    </RadioGroup>
                                </Grid>

                                {/* TextFields Column */}
                                <Grid size={{ md: 4 }}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid>
                                            <TextField
                                                select
                                                label=""
                                                fullWidth
                                                value={selectedDayInMonth}
                                                onChange={(e) =>
                                                    setSelectedDayInMonth(e.target.value)
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
                                        <Grid>
                                            <TextField
                                                select
                                                label=""
                                                fullWidth
                                                value={selectedEveryMonthFrqValue}
                                                onChange={(e) =>
                                                    setSelectedEveryMonthFrqValue(e.target.value)
                                                }
                                                variant="outlined"
                                            >
                                                {everyMonthFrqValues.map((frq, index) => (
                                                    <MenuItem key={index} value={frq}>
                                                        {frq}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* 3rd Column for Days */}
                                <Grid
                                    size={{ md: 5 }}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around', // Center vertically
                                        alignItems: 'start', // Center horizontally
                                        // height: '100%'              // Ensure the grid takes full height
                                    }}
                                >
                                    <Grid
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{ paddingBottom: '10px' }}>day</div>
                                    </Grid>
                                    <Grid
                                        size={{ md: 10 }}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            alignItems: 'end',
                                            mb: '11px',
                                        }}
                                    >
                                        <TextField
                                            select
                                            label=""
                                            fullWidth
                                            value={selectedEveryMonthFrqType}
                                            onChange={(e) =>
                                                setSelectedEveryMonthFrqType(e.target.value)
                                            }
                                            variant="outlined"
                                        >
                                            {everyMonthFrqTypes.map((frq, index) => (
                                                <MenuItem key={index} value={frq}>
                                                    {frq}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}

                {selectedFrq === '5' && (
                    <>
                        {/* Fields Rendering */}
                        <Grid
                            size={{ md: 3 }}
                            alignItems="center"
                            display="flex"
                            justifyContent="start"
                        >
                            <Typography variant="body2" sx={{ ml: 4 }} fontWeight={600}>
                                {t('common.dueDate')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 9 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={'Date'}
                                    format="dd/MM/yyyy"
                                    value={selectedDateInYear}
                                    onChange={(newValue) => setSelectedDateInYear(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </>
                )}
            </>
        );
    };

    return (
        <>
            <Container maxWidth="sm">
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '60px',
                        }}
                    >
                        <Typography variant="h3" gutterBottom sx={{ marginBottom: '0px' }}>
                            {isEdit ? t('common.edit-task') : t('common.create-a-task')}
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2, mx: -5 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ md: 12 }}>
                            <TextField
                                label={t('scheduling.task-title')}
                                variant="outlined"
                                fullWidth
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ md: 6 }}>
                            <Typography variant="body1" sx={{ mt: 1 }} fontWeight={'bold'}>
                                {t('common.assignTaskToAsset')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 6 }} textAlign="right">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={assignToAsset}
                                        onChange={(e) => setAssignToAsset(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={''}
                                labelPlacement="start"
                                sx={{ ml: 0 }}
                            />
                        </Grid>
                        {assignToAsset && selectedAssets.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setAssignAssetModal(true)}
                                >
                                    {t('common.select-asset')}
                                </Button>
                            </Grid>
                        )}
                        {assignToAsset && selectedAssets.length > 0 && (
                            <>
                                <Grid size={{ md: 6 }}>
                                    <Stack direction="row" spacing={1}>
                                        {selectedAssets.map((asset) => (
                                            <Chip label={asset} />
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid size={{ md: 6 }} textAlign="right">
                                    <Button
                                        variant="outlined"
                                        onClick={() => setAssignAssetModal(true)}
                                        startIcon={<Edit />}
                                        sx={{ mr: 1 }}
                                    >
                                        {t('buttons.edit')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setSelectedAssets([])}
                                        startIcon={<LinkOff />}
                                    >
                                        {t('buttons.unassign')}
                                    </Button>
                                </Grid>
                            </>
                        )}
                        <Grid size={{ md: 12 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {t('scheduling.select-task-type')}
                            </Typography>
                        </Grid>

                        <FormControl>
                            <RadioGroup
                                value={taskType}
                                row
                                onChange={(e) => setTaskType(e.target.value)}
                            >
                                {taskTypes.map((type) => (
                                    <Grid key={type.id} size={{ md: 6 }}>
                                        <FormControlLabel
                                            value={type.id}
                                            control={<Radio />}
                                            label={type.name}
                                        />
                                    </Grid>
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {taskType === '1' ||
                            (taskType === '3' && (
                                <Grid size={{ md: 12 }}>
                                    <Card sx={{ bgcolor: 'grey.200' }}>
                                        <CardContent>
                                            <Typography variant="body1">
                                                This <b>case</b> will automatically receive
                                                "Approved" status.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                        {taskType === '1' || (taskType === '3' && <ApprovedTaskExtraFields />)}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ md: 12 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {t('common.schedule')}
                            </Typography>
                        </Grid>

                        <Grid
                            size={{ md: 3 }}
                            alignItems="center"
                            display="flex"
                            justifyContent="start"
                        >
                            <Typography variant="body2" fontWeight={600}>
                                {t('scheduling.frequency')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 9 }}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedFrq}
                                    onChange={(e) => setSelectedFrq(e.target.value)}
                                >
                                    {frequencies.map((frq) => (
                                        <MenuItem key={frq.id} value={frq.id}>
                                            {frq.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ md: 12 }}></Grid>

                        <DueDateList />

                        <Grid
                            size={{ md: 3 }}
                            sx={{ mt: 2 }}
                            alignItems="center"
                            display="flex"
                            justifyContent="start"
                        >
                            <Typography variant="body2" fontWeight={600} sx={{ ml: '25%' }}>
                                {t('scheduling.tolerance')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 4 }} sx={{ mt: 2 }}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={toleranceValue}
                                onChange={(e) => setToleranceValue(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ md: 4 }} sx={{ mt: 2 }}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedToleranceFrq}
                                    onChange={(e) => setSelectedToleranceFrq(e.target.value)}
                                >
                                    {toleranceFrqs.map((frq) => (
                                        <MenuItem key={frq.id} value={frq.id}>
                                            {frq.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ md: 12 }}></Grid>
                        <Grid size={{ xs: 12 }} sx={{ marginBottom: '25px' }} textAlign="right">
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={() => cancelTask()}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                                onClick={() => addTask()}
                            >
                                {isEdit
                                    ? t('buttons.save-as-new')
                                    : t('buttons.save-and-create-another')}
                            </Button>
                            <Button variant="contained" onClick={() => editTask()}>
                                {isEdit ? t('buttons.update') : t('buttons.save')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Modal open={showAssignAssetModal} onClose={() => setAssignAssetModal(false)}>
                <>
                    <AssignToAsset
                        selectedAssets={selectedAssets}
                        setSelectedAssets={setSelectedAssets}
                        onClose={() => setAssignAssetModal(false)}
                    />
                </>
            </Modal>
        </>
    );
};

export default EditTask;
