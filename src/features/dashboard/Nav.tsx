import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography as MuiTypography,
    Button,
    Drawer,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import NotificationsNoneIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import WebIcon from '@mui/icons-material/Web';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { userStore } from '@mallcomm/portals-auth';
import { useTranslation } from 'react-i18next';
import NotificationSidebar from './NotificationSidebar';
import SettingSidebar from './SettingSideBar';
import HelpAndSupportSidebar from './HelpAndSupportSidebar';
import useSyncAuthToken from '../../hooks/useSyncAuthToken';
import Avatar from '../../components/common/Avatar';

const Nav: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isSettingOpen, setSettingOpen] = useState(false);
    const [isHelpAndSupportOpen, setHelpAndSupportOpen] = useState(false);

    const { resetAuthState, userDetails } = userStore();

    // Sync auth tokens to ensure HTTP requests have proper authorization
    useSyncAuthToken();

    const name = userDetails?.attributes?.name || '';
    const email = userDetails?.attributes?.email || '';
    const firstLetter = name ? name.charAt(0).toUpperCase() : '';

    //  const { gatewayAuthToken, authToken } = userStore();

    // console.log('gatewayAuthToken ======', gatewayAuthToken);
    //  console.log('authToken ======', authToken);

    const open = Boolean(anchorEl);
    const { t } = useTranslation();

    const menuItems = [
        {
            icon: <WebIcon />,
            label: 'CMS',
            onClick: () => console.log('CMS clicked'),
        },
        {
            icon: <RoomPreferencesIcon />,
            label: 'Facilities Management Portal',
            onClick: () => console.log('Facilities Management clicked'),
        },
        {
            icon: <PointOfSaleIcon />,
            label: 'Sales Collection Portal',
            onClick: () => console.log('Sales Collection clicked'),
        },
        {
            icon: <EngineeringIcon />,
            label: 'Contractor Portal',
            onClick: () => console.log('Contractor Portal clicked'),
        },
    ];

    const notifications = [
        {
            id: 1,
            avatar: 'L',
            message: `
            <strong><a href="@Alex Tapper">@Alex Tapper</a></strong> Work order
            <strong>WO-1001-01</strong>
            status changed to "Completed" by
            <strong>Linda Park</strong>
        `,
            time: '10:30',
        },
        {
            id: 2,
            avatar: 'S',
            message: `Received <u>Summer sales report</u>   from Sarah Thompson `,
            time: '12 Jun',
        },
        {
            id: 3,
            avatar: 'T',
            message: `
            <strong><a href="@Alex Tapper">@Alex Tapper</a></strong> Work order
            <strong>WO-1001-01</strong>
            status changed to "Completed" by
            <strong>Tom Redding</strong>
        `,
            time: '10:30',
        },
        {
            id: 4,
            avatar: null,
            icon: 'check',
            message: `Work order status changed to <span style="color: green;">Completed</span> by <u><b>Alan Smith</b></u> on 17 May 2025`,
            time: '10:30',
        },
        {
            id: 5,
            avatar: null,
            icon: 'check',
            message: `Inspection  status changed to <span style="color: green;">Completed</span> by <u><b>Mary Jackson</b></u> on 17 May 2025`,
            time: '10:30',
        },
        {
            id: 6,
            avatar: null,
            icon: 'check',
            message: `Inspection  status changed to <span style="color: green;">Completed</span> by <u><b>Mary Jackson</b></u> on 17 May 2025`,
            time: '10:30',
        },
        {
            id: 7,
            avatar: null,
            icon: 'edit',
            message: `Work order title changed to <span style="color: black;"><b>"Completed site inspection"</b></span> by <u><b>Mary Jackson</b></u> on 17 May 2025`,
            time: '10:30',
        },
        {
            id: 7,
            avatar: null,
            icon: 'plus',
            message: `Work order created by <span style="color: black;"><u><b>Alan Smith</b><u></span> on 17 May 2025`,
            time: '17 May',
        },
        {
            id: 7,
            avatar: null,
            icon: 'plus',
            message: `Work order created by <span style="color: black;"><u><b>Maryann Boe</b><u></span> on 17 April 2025`,
            time: '10:30',
        },
    ];

    interface IprofileData {
        name: string;
        email: string;
        avatarInitial: string;
    }

    const userProfileData: {
        userProfile: IprofileData;
        otherProfiles: IprofileData[];
    }[] = [
        {
            userProfile: {
                name: name,
                email: email,
                avatarInitial: firstLetter,
            },
            otherProfiles: [],
        },
    ];

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const SwitchPortalMenuBar = ({
        menuItems,
        triggerIcon,
        menuHeader,
    }: {
        menuItems: {
            icon: React.ReactNode;
            label: string;
            onClick?: () => void;
        }[];
        triggerIcon: React.ReactNode;
        menuHeader?: string;
    }) => {
        return (
            <Box display="flex" alignItems="center" sx={{ marginLeft: '10px' }}>
                <IconButton color="inherit" onClick={handleMenuClick}>
                    {triggerIcon}
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 3,
                                minWidth: 300,
                                minHeight: 220,
                                marginLeft: 95,
                                marginTop: 6,
                            },
                        },
                    }}
                >
                    {menuHeader && (
                        <Box px={2} py={1}>
                            <MuiTypography
                                variant="subtitle2"
                                fontWeight="bold"
                                color="text.primary"
                            >
                                {menuHeader}
                            </MuiTypography>
                        </Box>
                    )}
                    {menuHeader && <Divider sx={{ marginBottom: '10px' }} />}

                    {/* Render Menu Items */}
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                handleCloseMenu();
                                item.onClick?.(); // Execute item's onClick handler if provided
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <MuiTypography sx={{ fontSize: '0.9rem' }}>{item.label}</MuiTypography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        );
    };

    const AccountMenuBar = ({
        triggerIcon,
        menuHeader,
    }: {
        triggerIcon: React.ReactNode;
        menuHeader?: string;
    }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);

        const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        const { userProfile, otherProfiles } = userProfileData[0]; // Assuming first object is used

        return (
            <Box display="flex" alignItems="center">
                {/* Trigger Icon */}
                <IconButton aria-label="user-profile" onClick={handleMenuClick}>
                    {triggerIcon}
                </IconButton>

                {/* Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 3,
                                minWidth: 300,
                                marginTop: 2,
                            },
                        },
                    }}
                >
                    {/* Optional Menu Header */}
                    {menuHeader && (
                        <Box px={2} py={1}>
                            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                                {menuHeader}
                            </Typography>
                        </Box>
                    )}
                    {menuHeader && <Divider sx={{ marginBottom: '10px' }} />}

                    {/* Account Information */}
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar name={userProfile.name} email={userProfile.email} size={30} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            {userProfile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userProfile.email}
                        </Typography>
                    </Box>
                    <Divider />

                    {/* Other Profiles */}
                    <Box sx={{ px: 2 }}>
                        <Typography variant="body2" sx={{ mt: 1, mb: 1 }} fontWeight="bold">
                            {t('navbar.other-profiles')}
                        </Typography>
                        {otherProfiles.map((profile, index) => (
                            <MenuItem key={index} onClick={handleMenuClose}>
                                <Avatar name={profile.name} email={profile.email} size={24} />
                                {profile.name}
                            </MenuItem>
                        ))}
                    </Box>
                    <Divider />

                    {/* Additional Options */}
                    <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
                    <MenuItem onClick={handleMenuClose}>My Centre Access</MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                        }}
                        sx={{ color: 'red' }}
                    >
                        <Box>
                            <Button
                                onClick={() => {
                                    handleMenuClose();
                                    resetAuthState();
                                    sessionStorage.clear();
                                }}
                                variant="outlined"
                                fullWidth
                                startIcon={<ExitToAppIcon fontSize="small" />}
                                sx={{
                                    color: 'black',
                                    borderColor: 'white',
                                    backgroundColor: 'grey.100',
                                    textTransform: 'none',
                                }}
                            >
                                {t('buttons.logout')}
                            </Button>
                        </Box>
                    </MenuItem>
                </Menu>
            </Box>
        );
    };

    return (
        <>
            <AppBar
                sx={{ mb: 3 }}
                style={{
                    backgroundColor: '#262626',
                    width: '100%',
                }}
            >
                <Toolbar>
                    <Box display="flex" alignItems="center">
                        <img
                            src="/assets/images/Logo.png"
                            alt="Logo"
                            style={{ width: 160, marginRight: 25 }}
                        />
                        <Typography variant="h6" color="inherit">
                            {t('navbar.property-management')}
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box display="flex" alignItems="center">
                        <SwitchPortalMenuBar
                            menuItems={menuItems}
                            triggerIcon={<GridViewIcon />}
                            menuHeader={t('navbar.switch-portal')}
                        />

                        {/* Divider */}
                        <Divider
                            orientation="vertical"
                            flexItem
                            style={{
                                height: '20px',
                                margin: '17px 16px',
                                backgroundColor: '#fff',
                            }}
                        />

                        {/* Other Icons */}
                        <IconButton
                            color="inherit"
                            aria-label={t('common.notifications')}
                            onClick={() => setNotificationOpen(true)}
                        >
                            <NotificationsNoneIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label={t('common.settings')}
                            onClick={() => setSettingOpen(true)} // Open the sidebar
                        >
                            <SettingsIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="info"
                            onClick={() => setHelpAndSupportOpen(true)}
                        >
                            <HelpOutlineOutlinedIcon />
                        </IconButton>

                        {/* User Profile Avatar */}

                        <AccountMenuBar
                            triggerIcon={<Avatar name={firstLetter} email={email} size={30} />}
                            menuHeader={t('navbar.account-information')}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={isNotificationOpen}
                onClose={() => setNotificationOpen(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                <NotificationSidebar
                    data={notifications}
                    onClose={() => setNotificationOpen(false)}
                />
            </Drawer>
            <Drawer
                anchor="right"
                open={isSettingOpen}
                onClose={() => setSettingOpen(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                <SettingSidebar data={[name, email]} onClose={() => setSettingOpen(false)} />
            </Drawer>
            <Drawer
                anchor="right"
                open={isHelpAndSupportOpen}
                onClose={() => setHelpAndSupportOpen(false)}
                sx={{
                    width: '620px',
                    '& .MuiDrawer-paper': {
                        width: '620px',
                        height: '100%',
                    },
                }}
            >
                <HelpAndSupportSidebar onClose={() => setHelpAndSupportOpen(false)} />
            </Drawer>
        </>
    );
};

export default Nav;
