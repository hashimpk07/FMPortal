import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ uploadInfo, uploadDocuments }: any) {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <Dialog
                open={['CONFIRMED', 'CONFIRM', 'PROGRESS'].includes(uploadInfo?.status)}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    uploadDocuments('REVERT');
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                {uploadInfo?.status === 'PROGRESS' && (
                    <>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <CircularProgress size={100} sx={{ mb: 3 }} />
                                <DialogTitle>{'Import documents'}</DialogTitle>

                                <DialogContentText id="alert-dialog-slide-description">
                                    {t('asset.applying-changes-content')}
                                </DialogContentText>
                            </Box>
                        </DialogContent>
                    </>
                )}
                {uploadInfo?.status === 'CONFIRM' && (
                    <>
                        <DialogTitle>{'Import documents'}</DialogTitle>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <DialogContentText id="alert-dialog-slide-description">
                                    {`Are you sure you want to import ${uploadInfo?.ready} of the ${uploadInfo?.all} uploaded documents?` +
                                        (uploadInfo?.inComplete
                                            ? ` The remaining ${uploadInfo?.inComplete} incomplete document items will be removed once you confirm or exit this window.`
                                            : '')}
                                </DialogContentText>
                            </Box>
                        </DialogContent>
                    </>
                )}
                {uploadInfo?.status === 'CONFIRM' && (
                    <DialogActions>
                        <Button
                            onClick={() => {
                                uploadDocuments('REVERT');
                            }}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                uploadDocuments('AGREED');
                            }}
                        >
                            {t('buttons.confirm')}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </React.Fragment>
    );
}
