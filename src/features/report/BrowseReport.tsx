import Grid from '@mui/material/Grid2';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Controls from './BrowseControls';
import CreateReports from './CreateReports';

const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    borderRadius: 2,
    boxShadow: 1,
    maxWidth: 300,
};
const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};
const avatarStyle = {
    bgcolor: 'grey.400',
    width: 40,
    height: 40,
};
const viewBtnStyle = {
    textTransform: 'none',
    bgcolor: 'grey.100',
    color: 'text.primary',
    '&:hover': {
        bgcolor: 'grey.200',
    },
};

const StyledPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`;

const ReportCard = ({ name }: { name: string }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const viewReport = (name: string) => {
        navigate('/view-report', { state: { name } });
    };

    return (
        <Card sx={cardStyle}>
            {/* Top section: Icon and actions */}
            <Box sx={boxStyle}>
                <Avatar sx={avatarStyle}>
                    <TrendingUpIcon sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                    <IconButton aria-label="Star">
                        <StarBorderIcon />
                    </IconButton>
                    <IconButton aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Copy">
                        <ContentCopyIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Content section */}
            <CardContent sx={{ padding: 0, mt: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('reporting.report-about-performance')}
                </Typography>
            </CardContent>

            {/* Action section */}
            <CardActions sx={{ padding: 0 }}>
                <Button variant="contained" sx={viewBtnStyle} onClick={() => viewReport(name)}>
                    {t('buttons.view')}
                </Button>
            </CardActions>
        </Card>
    );
};
const BrowseReport = () => {
    const [search, setSearch] = useState('');
    const { t } = useTranslation();
    const [hasData, setHasData] = useState<boolean>(true);
    const [showAddReportModal, setShowAddReportModal] = useState<boolean>(false);

    const showCreateReport = () => {
        setShowAddReportModal(true);
    };

    const searchedData = (search: string) => {
        if (search) {
            setHasData(false);
            return setSearch(search);
        }
        setSearch('');
        return setHasData(true);
    };

    return (
        <Box>
            <StyledPage>
                <Typography variant="h1">{t('page-titles.reporting')}</Typography>

                <Controls
                    search={search}
                    setSearch={searchedData}
                    showCreateModal={showCreateReport}
                />
                {!hasData ? (
                    <div>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '5em',
                                marginTop: '1%',
                                padding: '1em',
                            }}
                        >
                            <img
                                src="/reports/Illustrations.png"
                                alt="Landing"
                                style={{
                                    width: '100%',
                                    maxWidth: '250px',
                                    height: 'auto',
                                    marginLeft: '37%',
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                            align="center"
                        >
                            {t('report.no-reports-created')}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: '#68727D',
                            }}
                            align="center"
                        >
                            {t('report.no-reports-created-submit')}
                        </Typography>

                        <Box sx={{ textAlign: 'center', padding: '1em' }}>
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={() => {
                                    setShowAddReportModal(true);
                                }}
                            >
                                {t('buttons.get-started')}
                            </Button>
                        </Box>
                    </div>
                ) : (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ md: 4, sm: 12 }}>
                                <ReportCard name={'Cases report'} />
                            </Grid>
                            <Grid size={{ md: 4, sm: 12 }}>
                                <ReportCard name={'Inspections report'} />
                            </Grid>
                            <Grid size={{ md: 4, sm: 12 }}>
                                <ReportCard name={'Maintenance report'} />
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </StyledPage>

            {showAddReportModal && (
                <CreateReports
                    open={showAddReportModal}
                    onClose={() => setShowAddReportModal(false)}
                />
            )}
        </Box>
    );
};

export default BrowseReport;
