import { Fragment, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    ListItem,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { DRAWER_WIDTH } from '../../constants';
import pageLinks from './pagesLinks';

const DrawerStyled = styled(Drawer)(({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH,
        top: theme.mixins.toolbar.minHeight,
        height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
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
    });

    const isActive = (path: string) => location.pathname === path;

    enum linkType {
        section = 'section', // Section is a divider with a title
        collapsible = 'collapsible', // Collapsible is a list item that can be expanded
        link = 'link', // Link is a simple list item
    }

    return (
        <DrawerStyled variant="permanent">
            <List>
                {links.map((link, index) => {
                    if (link.type === linkType.section) {
                        return (
                            <Fragment key={index}>
                                <Divider />
                                <ListItem disablePadding>
                                    <ListSubheader component="div">{link.text}</ListSubheader>
                                </ListItem>
                            </Fragment>
                        );
                    }

                    if (link.type === linkType.collapsible) {
                        return (
                            <Fragment key={index}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={link.onclick}>
                                        <ListItemIcon sx={{ minWidth: 42 }}>
                                            {link.icon ? <link.icon /> : null}
                                        </ListItemIcon>

                                        <ListItemText primary={link.text} />
                                        {link?.open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={link?.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {link?.items?.map((sublink) => (
                                            <ListItem disablePadding key={sublink.to}>
                                                <ListItemButton
                                                    component={Link}
                                                    to={sublink.to as string}
                                                    selected={isActive(sublink.to as string)}
                                                >
                                                    <ListItemText
                                                        primary={sublink.text}
                                                        sx={{ pl: 5.4 }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Fragment>
                        );
                    }

                    return (
                        <ListItem disablePadding key={link.to}>
                            <ListItemButton
                                component={Link}
                                to={link.to as string}
                                selected={isActive(link.to as string)}
                            >
                                <ListItemIcon sx={{ minWidth: 42 }}>
                                    {link.icon ? <link.icon /> : null}
                                </ListItemIcon>

                                <ListItemText primary={link.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </DrawerStyled>
    );
};

export default PageNavigation;

export { DrawerStyled };
