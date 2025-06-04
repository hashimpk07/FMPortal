import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Switch,
    FormControlLabel,
    Typography,
    IconButton,
    Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import Divider from '@mui/material/Divider';

interface NotificationSidebarProps {
    data: any[];
    onClose: () => void;
}

const splitName = (name: string) => {
    if (!name) return { firstName: '', lastName: '' };

    const arrName = name.split(' ');
    const firstName = arrName[0];
    const lastName = arrName.slice(1).join(' ');

    return { firstName, lastName };
};

const SettingSidebar: React.FC<NotificationSidebarProps> = ({ data, onClose }) => {
    const [name, email] = data;
    const [value, setValue] = useState(0);

    // States for switches
    const [receiveMentionAlerts, setReceiveMentionAlerts] = useState(false);
    const [receiveStateUpdateAlerts, setReceiveStateUpdateAlerts] = useState(false);
    const { t } = useTranslation();
    // Handler for tab change
    const handleChange = (_: any, newValue: number) => {
        setValue(newValue);
    };

    // Handler for switch change
    const handleSwitchChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
        setter(event.target.checked);
    };
    const { firstName, lastName } = splitName(name);

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
                        {t('common.settings')}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2, mx: -5 }} />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label=""
                        sx={{
                            minHeight: 30,
                        }}
                    >
                        <Tab
                            label={t('navbar.personal')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                        <Tab
                            label={t('common.privacy')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                    </Tabs>
                </Box>

                <Box sx={{ margin: 3 }}>
                    <TextField
                        label={t('common.first-name')}
                        fullWidth
                        variant="outlined"
                        value={firstName}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                            },
                        }}
                    />
                </Box>

                <Box sx={{ margin: 3 }}>
                    <TextField
                        label={t('common.last-name')}
                        fullWidth
                        variant="outlined"
                        value={lastName}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                            },
                        }}
                    />
                </Box>

                <Box sx={{ margin: 3 }}>
                    <TextField
                        label={t('common.email')}
                        fullWidth
                        variant="outlined"
                        value={email}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                            },
                        }}
                    />
                </Box>

                {/* Switch for Receive Alerts about Mentions */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Vertically align items
                        justifyContent: 'space-between', // Space between text and switch
                        margin: 3,
                    }}
                >
                    <Typography sx={{ marginRight: 2 }}>
                        {t('navbar.receive-alerts-on-about-mention')}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={receiveMentionAlerts}
                                onChange={(e) => handleSwitchChange(e, setReceiveMentionAlerts)}
                            />
                        }
                        label=""
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Vertically align items
                        justifyContent: 'space-between', // Space between text and switch
                        margin: 3,
                    }}
                >
                    <Typography sx={{ marginRight: 2 }}>
                        {t('navbar.receive-alerts-on-state-update')}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={receiveStateUpdateAlerts}
                                onChange={(e) => handleSwitchChange(e, setReceiveStateUpdateAlerts)}
                            />
                        }
                        label=""
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default SettingSidebar;
