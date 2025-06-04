import { Fragment, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Collapse,
    Drawer,
    List,
    ListItem,
    ListSubheader,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    IconButton,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExpandLess, ExpandMore, SvgIconComponent } from '@mui/icons-material';
import ViewSidebarSharpIcon from '@mui/icons-material/ViewSidebarSharp';
import { DRAWER_WIDTH, COLLAPSED_WIDTH } from '../../constants';
import pageLinks from './pagesLinks';

interface DrawerStyledProps {
    isExpanded: boolean;
}

interface LinkItem {
    type: 'link';
    to: string;
    icon: SvgIconComponent;
    text: string;
}

interface CollapsibleItem {
    type: 'collapsible';
    open: boolean;
    onclick: () => void;
    icon: SvgIconComponent;
    text: string;
    items: LinkItem[];
}

type Child = LinkItem | CollapsibleItem;

const DrawerStyled = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== 'isExpanded', // Prevent isExpanded from being passed to the underlying Drawer component
})<DrawerStyledProps>(({ theme, isExpanded }) => ({
    width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
    flexShrink: 0,
    transition: 'width 0.3s ease',
    '& .MuiDrawer-paper': {
        width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        top: theme.mixins.toolbar.minHeight,
        height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        borderRight: isExpanded ? '1px solid #9FA6AD' : 'none',
    },
}));

const PageNavigation: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const [inspectionsOpen, setInspectionsOpen] = useState(false);

    const [audtingInspectionsOpen, setAuditiongInspectionsOpen] = useState(false);
    const [complianceOpen, setComplianceOpen] = useState(false);

    const [propertyComplianceOpen, setPropertyComplianceOpen] = useState(false);
    const [tenantComplianceOpen, setTenantComplianceOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [activeTitle, setActiveTitle] = useState('Home');

    const UppercaseListSubheader = styled(ListSubheader)`
        font-size: 10px;
    `;

    const links = pageLinks({
        t,
        inspectionsOpen,
        setInspectionsOpen,

        audtingInspectionsOpen,
        setAuditiongInspectionsOpen,

        complianceOpen,
        setComplianceOpen,

        propertyComplianceOpen,
        setPropertyComplianceOpen,
        tenantComplianceOpen,
        setTenantComplianceOpen,

        setActiveSection,
        setActiveTitle,
    });

    const isActive = (path: string) => location.pathname === path;
    const [isDrawerExpanded, setIsDrawerExpanded] = useState(false); // Track whether drawer is expanded or collapsed

    const toggleDrawer = () => {
        setIsDrawerExpanded(!isDrawerExpanded); // Toggle the drawer width on button click
    };

    enum linkType {
        section = 'section', // Section is a divider with a title
        collapsible = 'collapsible', // Collapsible is a list item that can be expanded
        link = 'link', // Link is a simple list item
    }

    return (
        <DrawerStyled variant="permanent" isExpanded={isDrawerExpanded}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row', // Set to 'row' for side-by-side layout
                    height: '100%',
                }}
            >
                {/* Left BOX */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid #9FA6AD',
                    }}
                >
                    <Box
                        sx={{
                            flex: '0 1 7%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img src="common/LOGO.png" alt="" />
                    </Box>
                    <Box
                        sx={{
                            flex: '0 1 86%',
                            overflowY: 'auto',
                        }}
                    >
                        <List>
                            {links.map((link) => {
                                if (link.type === linkType.section) {
                                    return (
                                        <ListItemButton
                                            key={link.to || link.text}
                                            component={Link}
                                            onClick={link.onclick}
                                            to={link.to as string}
                                            selected={isActive(link.to as string)}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {link.icon ? (
                                                    <link.icon
                                                        fontSize="small"
                                                        sx={{
                                                            color: '#1C1B1F',
                                                        }}
                                                    />
                                                ) : null}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={link.text}
                                                sx={{
                                                    textAlign: 'center',
                                                    marginTop: 0,
                                                    fontSize: '8px',
                                                    '& .MuiTypography-root': {
                                                        fontSize: '8px',
                                                    },
                                                }}
                                            />
                                        </ListItemButton>
                                    );
                                }
                                return null;
                            })}
                        </List>
                    </Box>
                    <Box
                        sx={{
                            flex: '0 1 7%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton aria-label="ViewSidebarSharpIcon" onClick={toggleDrawer}>
                            <ViewSidebarSharpIcon sx={{ color: '#1C1B1F' }} />
                        </IconButton>
                    </Box>
                </Box>
                {/* Right BOX */}
                {isDrawerExpanded && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Box>
                            <List
                                dense
                                subheader={
                                    <UppercaseListSubheader>{activeTitle}</UppercaseListSubheader>
                                }
                            >
                                {links.map(({ name, children }: any) => {
                                    if (activeSection === name) {
                                        return children.map((child: Child, index: number) => {
                                            if (child.type === 'link') {
                                                return (
                                                    <ListItem disablePadding key={child.to}>
                                                        <ListItemButton
                                                            key={`${child.to}-button`}
                                                            component={Link}
                                                            to={child.to as string}
                                                            selected={isActive(child.to as string)}
                                                            sx={{
                                                                marginTop: 0,
                                                                fontSize: '8px',
                                                                '& .MuiTypography-root': {
                                                                    fontSize: '8px',
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                {child.icon ? (
                                                                    <child.icon
                                                                        sx={{
                                                                            color: '#1C1B1F',
                                                                        }}
                                                                    />
                                                                ) : null}
                                                            </ListItemIcon>
                                                            <ListItemText primary={child.text} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            }
                                            if (child.type === 'collapsible') {
                                                return (
                                                    <Fragment key={index}>
                                                        <ListItem disablePadding>
                                                            <ListItemButton
                                                                key={`${child.text}-${index}`}
                                                                onClick={child.onclick}
                                                            >
                                                                <ListItemIcon>
                                                                    {child.icon ? (
                                                                        <child.icon
                                                                            sx={{
                                                                                color: '#1C1B1F',
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                </ListItemIcon>

                                                                <ListItemText
                                                                    primary={child.text}
                                                                    sx={{
                                                                        marginTop: 0,
                                                                        fontSize: '8px',
                                                                        '& .MuiTypography-root': {
                                                                            fontSize: '8px',
                                                                        },
                                                                    }}
                                                                />
                                                                {child?.open ? (
                                                                    <ExpandLess />
                                                                ) : (
                                                                    <ExpandMore />
                                                                )}
                                                            </ListItemButton>
                                                        </ListItem>
                                                        <Collapse
                                                            in={child?.open}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <List component="div" disablePadding>
                                                                {child?.items?.map(
                                                                    (sublink: any) => (
                                                                        <ListItem
                                                                            disablePadding
                                                                            key={sublink.to}
                                                                        >
                                                                            <ListItemButton
                                                                                component={Link}
                                                                                to={
                                                                                    sublink.to as string
                                                                                }
                                                                                selected={isActive(
                                                                                    sublink.to as string,
                                                                                )}
                                                                            >
                                                                                <ListItemText
                                                                                    primary={
                                                                                        sublink.text
                                                                                    }
                                                                                    sx={{
                                                                                        textAlign:
                                                                                            'center',
                                                                                        marginTop: 0,
                                                                                        fontSize:
                                                                                            '8px',
                                                                                        '& .MuiTypography-root':
                                                                                            {
                                                                                                fontSize:
                                                                                                    '8px', // Adjust the font size here
                                                                                            },
                                                                                    }}
                                                                                />
                                                                            </ListItemButton>
                                                                        </ListItem>
                                                                    ),
                                                                )}
                                                            </List>
                                                        </Collapse>
                                                    </Fragment>
                                                );
                                            }
                                            return null;
                                        });
                                    }
                                    return null;
                                })}
                            </List>
                        </Box>
                    </Box>
                )}
            </Box>
        </DrawerStyled>
    );
};

export default PageNavigation;

export { DrawerStyled };
