import { ReactNode } from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SliderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
    titleTypographyProps?: React.ComponentProps<typeof Typography>;
    sx?: React.ComponentProps<typeof Box>['sx'];
    drawerSx?: object; // Custom styles for the Drawer
}

const SliderModal = ({
    isOpen,
    onClose,
    title,
    children,
    anchor = 'right',
    titleTypographyProps = {},
    sx = {},
    drawerSx = {},
}: SliderModalProps) => {
    return (
        <Drawer
            anchor={anchor}
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '300px',
                    height: '100%',
                    borderRadius: '10px',
                    ...drawerSx,
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative',
                    ...sx,
                }}
            >
                <IconButton
                    edge="end"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1000,
                        color: 'text.primary',
                    }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" sx={{ mb: 2 }} {...titleTypographyProps}>
                    {title}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>{children}</Box>
            </Box>
        </Drawer>
    );
};

export default SliderModal;
