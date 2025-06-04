import { Button, ButtonProps } from '@mui/material';

interface ActionButtonProps extends ButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label, ...props }: ActionButtonProps) {
    return (
        <Button
            startIcon={icon}
            variant="contained"
            sx={{
                borderRadius: 1,
                bgcolor: 'grey.200',
                color: 'black',
                '&.Mui-disabled': {
                    bgcolor: 'transparent',
                    color: 'grey.500',
                    border: '1px solid',
                    borderColor: 'grey.300',
                },
            }}
            {...props}
        >
            {label}
        </Button>
    );
}

export default ActionButton;
