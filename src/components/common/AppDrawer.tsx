import { ReactNode } from 'react';
import { Box, Typography, IconButton, Drawer, DrawerProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

interface AppDrawerProps extends Omit<DrawerProps, 'children'> {
    title: string;
    onClose: () => void;
    children: ReactNode;
    actions?: ReactNode;
    headerContent?: ReactNode;
    footerContent?: ReactNode;
    width?: string | number;
    disabled?: boolean;
}

// Styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: '52rem',
        maxWidth: '100%',
        transition: theme.transitions.create(['width', 'max-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const DrawerContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const DrawerHeader = styled(Box)(({ theme }) => ({
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '16px 32px',
}));

const HeaderContent = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const DrawerTitle = styled(Typography)(({ theme }) => ({
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: theme.typography.h1.fontWeight,
}));

const ContentArea = styled(Box)({
    flex: 1,
    overflow: 'auto',
});

const FooterArea = styled(Box)(({ theme }) => ({
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: '#fff',
    position: 'sticky',
    bottom: 0,
    padding: '16px',
    zIndex: 1,
}));

/**
 * Standardized drawer component for use throughout the application
 */
function AppDrawer({
    title,
    onClose,
    children,
    actions,
    headerContent,
    footerContent,
    width = '52rem',
    disabled = false,
    ...drawerProps
}: AppDrawerProps) {
    return (
        <StyledDrawer
            anchor="right"
            onClose={disabled ? undefined : onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width,
                },
            }}
            {...drawerProps}
        >
            <DrawerContainer>
                {/* Header */}
                <DrawerHeader>
                    <HeaderContent>
                        <DrawerTitle variant="h1">{title}</DrawerTitle>
                        <IconButton onClick={onClose} size="small" disabled={disabled}>
                            <CloseIcon />
                        </IconButton>
                    </HeaderContent>

                    {/* Optional content below the title (tabs, actions, etc.) */}
                    {headerContent && <Box sx={{ pt: 1 }}>{headerContent}</Box>}
                </DrawerHeader>

                {/* Content */}
                <ContentArea>{children}</ContentArea>

                {/* Footer - optional */}
                {footerContent && <FooterArea>{footerContent}</FooterArea>}
            </DrawerContainer>
        </StyledDrawer>
    );
}

export default AppDrawer;
