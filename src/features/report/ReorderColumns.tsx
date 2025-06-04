import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Modal,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface ReorderColumnsProps {
    open: boolean;
    onClose: any;
}

const ReorderColumns = ({ open, onClose }: ReorderColumnsProps) => {
    const fields = [
        { id: 1, label: 'Centre' },
        { id: 2, label: 'Total cases opened' },
        { id: 3, label: 'Total cases completed' },
        { id: 4, label: 'Total work orders created' },
        { id: 5, label: 'Total work orders closed' },
        { id: 6, label: 'Inspections completed' },
    ];

    const [columns, setColumns] = useState<{ id: number; label: string }[]>(fields);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;

        const reorderedColumns = [...columns];
        const [draggedItem] = reorderedColumns.splice(draggedIndex, 1);
        reorderedColumns.splice(index, 0, draggedItem);

        setColumns(reorderedColumns);
        setDraggedIndex(null);
    };

    const handleCancel = () => {
        setColumns(fields); // Reset to initial state
        onClose(false);
    };

    const handleUpdate = () => {
        onClose(false);
    };

    const handleClose = () => onClose(false);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h6">{t('reporting.reorder-columns')}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List>
                    {columns.map((field, index) => (
                        <ListItem
                            key={field.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'grab',
                                opacity: draggedIndex === index ? 0.5 : 1,
                            }}
                        >
                            <ListItemIcon>
                                <DragIndicatorIcon />
                            </ListItemIcon>
                            <ListItemText primary={field.label} />
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleCancel} variant="outlined" sx={{ mr: 2 }}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        disabled={JSON.stringify(columns) === JSON.stringify(fields)}
                    >
                        {t('buttons.update')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ReorderColumns;
