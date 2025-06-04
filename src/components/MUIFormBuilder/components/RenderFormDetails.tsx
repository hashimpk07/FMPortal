import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import FormInputProp from '../FormInputProp.ts';
import { showField } from '../validation.ts';
import { getSumField, getTaxFieldValue } from '../extraFieldsMaths.tsx';
import renderValue from '../../../utils/ts/helper/renderValue';

type FieldData = Record<string, any>;

interface RenderFormDetailsProps {
    form: FormInputProp[];
    data: FieldData;
    handleUpdateValue: (value: any, key: string) => void;
    centreConfig: {
        default_currency_symbol?: string;
        [key: string]: any;
    };
}

const formattedDate = (date: string) => {
    try {
        const parsedDate = parseISO(date);

        // Check if it's a valid date
        if (isValid(parsedDate)) {
            return format(parsedDate, 'dd/MM/yyyy');
        }
        return 'Invalid date';
    } catch (err) {
        console.log('err in date value', err);
        return 'Invalid date';
    }
};

function RenderFormDetails({
    form,
    data,
    handleUpdateValue,
    centreConfig,
}: RenderFormDetailsProps) {
    const shouldShow = (input: FormInputProp): boolean => {
        return showField(input, form, data);
    };

    const getFormLabel = (input: FormInputProp): string | undefined => {
        return input?.label;
    };

    const currencySymbol = centreConfig?.default_currency_symbol || '$';

    // This function handles file upload callbacks from the native app
    const setupFileUploadCallback = () => {
        // Create a new callback handler for each render to avoid global state issues
        const fileUploadHandler = (file: any) => {
            if (!file?.pluginAttributes?.pluginAttributes?.inputName) return;

            const { inputName, inputType } = file.pluginAttributes.pluginAttributes;

            if (inputType === 'attachment') {
                handleUpdateValue(file, inputName);
            } else if (inputType === 'multi-attachment') {
                const newData = data[inputName] || [];
                handleUpdateValue([...newData, file], inputName);
            }
        };

        // Safely assign the callback
        if (typeof window !== 'undefined') {
            // Store previous handler if it exists
            const previousHandler = (window as any).fileUploadToThread;

            // Assign new handler
            (window as any).fileUploadToThread = fileUploadHandler;

            // Return a cleanup function that restores the previous handler
            return () => {
                (window as any).fileUploadToThread = previousHandler;
            };
        }

        return undefined;
    };

    // Setup the callback when component is mounted
    useState(setupFileUploadCallback);

    return (
        <Box
            sx={{
                display: 'flex',
                flexFlow: 'column',
                gap: 2,
            }}
        >
            {form
                .filter((item) => shouldShow(item))
                .map((item, index) => (
                    <Box key={`form-input-section--${index}`}>
                        <ReadOnlyField
                            input={item}
                            data={data}
                            currencySymbol={currencySymbol}
                            getFormLabel={getFormLabel}
                        />
                    </Box>
                ))}
        </Box>
    );
}

interface ReadOnlyFieldProps {
    input: FormInputProp;
    data: FieldData;
    currencySymbol: string;
    getFormLabel: (input: FormInputProp) => string | undefined;
}

function ReadOnlyField({ input, data, currencySymbol, getFormLabel }: ReadOnlyFieldProps) {
    // Safety check for undefined or null type
    if (!input.type) {
        console.warn('Field with undefined type:', input);
        return (
            <>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {getFormLabel(input) || 'Unnamed Field'}
                </Typography>
                <Typography variant="body1" color="error">
                    (Field type undefined)
                </Typography>
            </>
        );
    }

    // Read data safely
    const fieldName = input.name ?? '';
    const fieldValue = data[fieldName];
    const displayValue = typeof fieldValue !== 'object' && fieldValue ? fieldValue : '';

    switch (input.type) {
        case 'hidden-input':
            return null;

        case 'header':
            return <Typography variant="h6">{input.header}</Typography>;

        case 'subheader':
            return <Typography variant="subtitle1">{input.subheader}</Typography>;

        case 'itext':
            return (
                <Box>
                    <Typography variant="subtitle2">{input.itext}</Typography>
                </Box>
            );

        case 'currency':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">
                        {currencySymbol}
                        {renderValue(displayValue)}
                    </Typography>
                </>
            );

        case 'number':
        case 'text':
        case 'textarea':
        case 'checkbox-dynamic-fields':
        case 'radio-group-dynamic-fields':
        case 'select':
        case 'checkbox-group':
        case 'radio-group':
        case 'file':
        case 'document':
        case 'attachment':
        case 'multi-attachment':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">{renderValue(displayValue)}</Typography>
                </>
            );

        case 'datepicker':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">{formattedDate(fieldValue)}</Typography>
                </>
            );

        case 'datetimepicker':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">
                        {fieldValue ? format(parseISO(fieldValue), 'dd/MM/yyyy HH:mm') : ''}
                    </Typography>
                </>
            );

        case 'tax-field-input':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">
                        {currencySymbol}
                        {getTaxFieldValue(input, data)}
                    </Typography>
                </>
            );

        case 'sum-field-input':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">
                        {currencySymbol}
                        {getSumField(input, data)}
                    </Typography>
                </>
            );

        case 'due_date':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">
                        {fieldValue ? new Date(fieldValue).toLocaleDateString() : ''}
                    </Typography>
                </>
            );

        case 'checkbox':
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input)}
                    </Typography>
                    <Typography variant="body1">{fieldValue ? 'Yes' : 'No'}</Typography>
                </>
            );

        case 'priority':
            return null; // A dropdown is used to update 'priority' field in ViewCaseInfo page
        default:
            // Graceful fallback for unimplemented field types
            console.warn(`Unimplemented field type: '${input.type}'`, input);
            return (
                <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {getFormLabel(input) || input.type || 'Unknown Field'}
                    </Typography>
                    <Typography variant="body1">{displayValue}</Typography>
                    {process.env.NODE_ENV === 'development' && (
                        <Typography variant="caption" color="error">
                            (Unimplemented field type: {input.type})
                        </Typography>
                    )}
                </>
            );
    }
}

export default RenderFormDetails;
