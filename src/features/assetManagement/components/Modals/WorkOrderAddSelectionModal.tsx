import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    IconButton,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import WorkOrderSelectionModal from './WorkOrderSelectionModal';
import WorkOrderCreateForm from '../WorkOrderCreateForm';

interface WorkOrderAddSelectionModalProps {
    open: boolean;
    onClose: () => void;
    assetId: string;
    onWorkOrderAssign: (workOrderIds: string[]) => Promise<void>;
}

const WorkOrderAddSelectionModal: React.FC<WorkOrderAddSelectionModalProps> = ({
    open,
    onClose,
    assetId,
    onWorkOrderAssign,
}) => {
    const { t } = useTranslation();
    const [selectedMode, setSelectedMode] = useState<'select' | 'create' | null>(null);
    const [mode, setMode] = useState<'select' | 'create' | 'choose'>('choose');

    const handleModeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMode(event.target.value as 'select' | 'create');
    };

    const handleContinue = () => {
        if (selectedMode) setMode(selectedMode);
        else setMode('select'); // fallback
    };

    const handleBack = () => {
        setMode('choose');
    };

    const handleClose = () => {
        setMode('choose');
        setSelectedMode(null);
        onClose();
    };

    return (
        <>
            {mode === 'choose' && (
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{t('asset.add-work-order')}</Typography>
                            <IconButton onClick={handleClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ p: 2 }}>
                            <RadioGroup
                                aria-label="work-order-mode"
                                name="work-order-mode"
                                value={selectedMode || ''}
                                onChange={handleModeSelect}
                            >
                                <FormControlLabel
                                    value="create"
                                    control={<Radio />}
                                    label={t('asset.create-new-work-order')}
                                />
                                <FormControlLabel
                                    value="select"
                                    control={<Radio />}
                                    label={t('asset.use-existing-work-order')}
                                />
                            </RadioGroup>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleClose} variant="outlined">
                            {t('asset.cancel')}
                        </Button>
                        <Button
                            onClick={handleContinue}
                            variant="contained"
                            color="primary"
                            disabled={!selectedMode}
                        >
                            {t('asset.continue')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {mode === 'select' && (
                <WorkOrderSelectionModal
                    open={true}
                    onClose={handleBack}
                    assetId={assetId}
                    onWorkOrderAssign={async (workOrderIds) => {
                        await onWorkOrderAssign(workOrderIds);
                        setMode('choose');
                        onClose();
                    }}
                />
            )}

            {mode === 'create' && (
                <Dialog open={true} onClose={handleBack} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{t('asset.create-new-work-order')}</Typography>
                            <IconButton onClick={handleBack} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <WorkOrderCreateForm
                            assetId={assetId}
                            onSuccess={() => {
                                setMode('choose');
                                onClose();
                            }}
                            onCancel={handleBack}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default WorkOrderAddSelectionModal;
