import React, { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    List,
    ListItem,
    Avatar,
    ListItemText,
    Typography,
    Tabs,
    Tab,
    IconButton,
    Container,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Divider from '@mui/material/Divider';

interface NotificationSidebarProps {
    data: any[];
    onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ data, onClose }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(0);

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
                        {t('common.notifications')}
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
                        aria-label="basic tabs example"
                        sx={{
                            minHeight: 30,
                        }}
                    >
                        <Tab
                            label="All"
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                        <Tab
                            label="Mention"
                            sx={{
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                minWidth: 80,
                                minHeight: 30,
                            }}
                        />
                    </Tabs>
                </Box>
                <List>
                    {data.map((notification) => (
                        <ListItem
                            key={notification.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        >
                            {/* Avatar */}
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    fontSize: '0.75rem',
                                    marginRight: 2,
                                    color: 'black',
                                    backgroundColor: notification.avatar ? '#f0f0f0' : '#e0e0e0', // Background color for text or icon
                                }}
                            >
                                {notification.avatar ? (
                                    notification.avatar // Show the avatar text (e.g., 'L', 'S', 'T')
                                ) : notification.icon === 'check' ? (
                                    <CheckIcon fontSize="small" />
                                ) : notification.icon === 'edit' ? (
                                    <EditIcon fontSize="small" />
                                ) : notification.icon === 'plus' ? (
                                    <AddIcon fontSize="small" />
                                ) : (
                                    <span>{notification.avatarFallbackText || '?'}</span> // Optional fallback
                                )}
                            </Avatar>

                            {/* Notification Message */}
                            <ListItemText
                                sx={{ fontSize: '0.95rem' }}
                                primary={
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: notification.message,
                                        }}
                                    />
                                }
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    sx: {
                                        whiteSpace: 'normal',
                                        overflow: 'hidden',
                                        fontSize: '0.75rem',
                                        wordBreak: 'break-word',
                                    },
                                }}
                            />

                            {/* Time */}
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
                            >
                                {notification.time}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default NotificationSidebar;
