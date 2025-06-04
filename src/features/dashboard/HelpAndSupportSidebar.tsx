import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Typography,
    InputAdornment,
    Button,
    Divider,
    IconButton,
    Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTranslation } from 'react-i18next';
import { Close, OpenInNewOutlined } from '@mui/icons-material';

interface HelpSupportSidebarProps {
    onClose: () => void;
}

const HelpAndSupportSidebar: React.FC<HelpSupportSidebarProps> = ({ onClose }) => {
    const [value, setValue] = useState(0);
    const { t } = useTranslation();

    // Handler for tab change
    const handleChange = (_: any, newValue: number) => {
        setValue(newValue);
    };

    return (
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
                        {t('navbar.help-and-support')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'right',
                            alignItems: 'center',
                            padding: '2px',
                        }}
                    >
                        <IconButton edge="end" color="inherit" style={{ paddingRight: '25px' }}>
                            <OpenInNewOutlined />
                        </IconButton>

                        <IconButton edge="end" color="inherit" onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                {/* Search Bar */}
                <Box>
                    <TextField
                        fullWidth
                        placeholder={t('navbar.search-knowledge-base')}
                        variant="outlined"
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label={t('navbar.help-and-support-tabs')}
                        sx={{
                            minHeight: 30,
                        }}
                    >
                        <Tab
                            label={t('navbar.whats-new')}
                            sx={{
                                fontSize: '0.75rem', // Reduces font size
                                padding: '6px 12px', // Adjust padding
                                minWidth: 80, // Adjust minimum width of each tab
                                minHeight: 30, // Matches the height of the Tabs container
                            }}
                        />
                        <Tab
                            label={t('navbar.keyboard-shortcuts')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                        <Tab
                            label={t('navbar.ask-a-question')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                        <Tab
                            label={t('navbar.give-feedback')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ padding: 4 }}>
                    {value === 0 && (
                        <>
                            {/* Overview Section */}
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    marginBottom: 1,
                                }}
                            >
                                Overview: What Are Automated Chase Messages?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Automated chase messages are a powerful tool for property managers
                                to streamline communication with tenants and store managers. These
                                messages can be sent via email or push notifications to remind
                                tenants to submit their sales data or to update them about key
                                deadlines and actions.
                            </Typography>

                            {/* How-To Section */}
                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                How to Create and Manage Automated Chase Messages?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                On this page you will see a list of all of your scheduled sales
                                collection notifications. You can see their status and type and
                                click into them to edit, or create a duplicate.
                            </Typography>

                            {/* Tip of the Day Section */}
                            <Box
                                sx={{
                                    backgroundColor: 'grey.100',
                                    padding: 2,
                                    borderRadius: 1,
                                    marginTop: 4,
                                    margin: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                    {t('navbar.tip-of-the-day')}
                                </Typography>
                                <Typography sx={{ color: 'grey.700' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            marginBottom: 1,
                                            color: '#000000',
                                            opacity: '0.8',
                                        }}
                                    >
                                        Can I customize the timing of automated messages?
                                    </Typography>
                                    Automated chase messages make it easy to keep tenants informed
                                    and ensure they stay on top of their data submission
                                    requirements, all without manual intervention. Whether you’re
                                    managing a single property or multiple centres, this feature
                                    ensures efficient communication and reduces the burden on
                                    property managers.
                                </Typography>
                            </Box>
                        </>
                    )}
                    {value === 1 && (
                        <>
                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>

                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>
                        </>
                    )}
                    {value === 2 && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    marginBottom: 3,
                                }}
                            >
                                {/* Icon Box */}
                                <Box
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="small" />
                                </Box>

                                {/* Text */}
                                <Typography
                                    sx={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('navbar.What-new')}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>

                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>

                            <Typography sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Lorem ipsum dolor sit amet consectetur?
                            </Typography>
                            <Typography sx={{ color: 'grey.700', marginBottom: 3 }}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
                                accusamus, magni impedit est minus voluptates soluta quo nihil
                                dolore beatae veritatis odit commodi cumque, accusantium vitae
                                tenetur qui error quia.
                            </Typography>
                        </>
                    )}
                    {value === 3 && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    marginBottom: 3,
                                }}
                            >
                                {/* Icon Box */}
                                <Box
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="small" />
                                </Box>

                                {/* Text */}
                                <Typography
                                    sx={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('navbar.give-feedback')}
                                </Typography>
                            </Box>
                            <Typography sx={{ marginBottom: 1 }}>
                                {t('navbar.give-feedback-contnet')}
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                placeholder="Enter your message here"
                                sx={{
                                    marginTop: 2,
                                    marginBottom: 1,
                                }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginBottom: 5,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: 'grey.300',
                                        color: 'black',
                                        padding: '8px 16px',
                                    }}
                                >
                                    {t('buttons.send')}
                                </Button>
                            </Box>
                        </>
                    )}

                    <Divider sx={{ marginY: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            padding: 1,
                            borderRadius: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'grey.800',
                                cursor: 'pointer',
                            }}
                        >
                            {t('navbar.privacy-policy')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'grey.800',
                                cursor: 'pointer',
                            }}
                        >
                            {t('navbar.terms-and-conditions')}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default HelpAndSupportSidebar;
