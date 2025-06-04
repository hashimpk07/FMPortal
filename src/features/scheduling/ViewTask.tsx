import { Close } from '@mui/icons-material';
import { Box, Button, Container, Divider, Drawer, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { Fragment, useState } from 'react';
import EditTask from './EditTask';

const ViewTask = ({ onClose }: any) => {
    const [showEditModal, setEditModal] = useState(false);
    const { t } = useTranslation();

    const taskData = {
        taskType: 'Inspection',
        button: 'Bathroom Inspection',
        scheduleData: [
            { date: '17/04/2024', time: '09:00 pm' },
            { date: '11/08/2024', time: '02:00 am' },
            { date: '09/03/2024', time: '10:00 pm' },
            { date: '01/04/2024', time: '11:00 am' },
        ],
        tolerance: '15 minutes',
        frequency: 'Repeats daily',
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
                            {t('scheduling.view-task-content')}
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2, mx: -5 }} />

                    <Grid>
                        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: 'black',
                                    borderColor: 'white',
                                    backgroundColor: 'grey.100',
                                }}
                                onClick={() => setEditModal(true)}
                            >
                                {t('buttons.edit')}
                            </Button>
                        </Box>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {t('scheduling.task-type')}
                            </Typography>
                            <Typography variant="body2">{taskData.taskType}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {t('common.button')}
                            </Typography>
                            <Typography variant="body2">{taskData.button}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ md: 12 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {t('scheduling.schedule')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 4 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {t('scheduling.frequency')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 4 }}>
                            <Typography variant="body2">{taskData.frequency}</Typography>
                        </Grid>
                        <Grid size={{ md: 4 }}></Grid>

                        {taskData.scheduleData.map((data, index) => (
                            <Fragment key={index}>
                                <Grid size={{ md: 4 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {t('scheduling.due-date')}
                                    </Typography>
                                </Grid>
                                <Grid size={{ md: 4 }}>
                                    <Typography variant="body2">{data.date}</Typography>
                                </Grid>
                                <Grid size={{ md: 4 }}>
                                    <Typography variant="body2">{data.time}</Typography>
                                </Grid>
                            </Fragment>
                        ))}

                        <Grid size={{ md: 4 }} sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {t('scheduling.tolerance')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 4 }} sx={{ mt: 2 }}>
                            <Typography variant="body2">{taskData.tolerance}</Typography>
                        </Grid>
                        <Grid size={{ md: 4 }} sx={{ mt: 2 }}></Grid>
                    </Grid>
                </Box>
            </Container>
            <Drawer
                anchor="right"
                open={showEditModal}
                onClose={() => setEditModal(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                {showEditModal && <EditTask isEdit={true} onClose={() => setEditModal(false)} />}
            </Drawer>
        </>
    );
};

export default ViewTask;
