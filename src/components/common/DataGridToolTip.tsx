import { Tooltip, Typography } from '@mui/material';

const DataGridToolTip = ({ text }: { text: string; bold?: boolean }) => (
    <Tooltip title={<span>{text}</span>} arrow enterTouchDelay={0} disableInteractive>
        <Typography variant="customTableHeaderTitle">{text}</Typography>
    </Tooltip>
);

export default DataGridToolTip;
