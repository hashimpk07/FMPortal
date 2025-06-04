import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import FormBuilder from './FormBuilder.tsx';
import mockForm from './mockForm.ts';

const MUIFormBuilderIndex = () => {
    const { t } = useTranslation();

    const { RenderForm, runValidateForm, isValid } = FormBuilder({
        form: mockForm,
        centreConfig: {
            default_currency_symbol: '£',
        },
        centreId: 1,
        t: t,
    });

    return (
        <Box sx={{ p: 4 }}>
            {/*@TODO CHECK WITH ALEX WHY THIS CANT BE <RENDERFORM> IT BREAKS IF IT IS THAT WAY*/}
            {RenderForm()}
            <Button
                fullWidth
                color={isValid() ? 'success' : 'error'}
                onClick={() => {
                    runValidateForm();
                }}
                variant="outlined"
            >
                Submit
            </Button>
        </Box>
    );
};

export default MUIFormBuilderIndex;
