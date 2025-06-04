import React from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from './FormBuilder';
import FormInputProp from './FormInputProp';

interface FormCreatorProps {
    formData: any;
    centreConfig: any;
    currentData: any;
    setUpdatedFormValues?: any;
    t?: any;
    centreId: number;
    onSubmit: (e: any) => void;
    buttonName?: string;
    hasSubmit?: boolean;
    formCreatorSubmitRef?: React.RefObject<HTMLButtonElement>;
    showDetails?: boolean;
    setFileUploading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormCreator = ({
    formData,
    centreConfig = {
        default_currency_symbol: '',
        default_currency_divider: '',
    },
    currentData = undefined,
    setUpdatedFormValues,
    centreId = 1,
    onSubmit,
    buttonName = 'Submit',
    formCreatorSubmitRef,
    showDetails = false,
    setFileUploading,
}: FormCreatorProps) => {
    const { t } = useTranslation();

    // Validate formData to ensure no undefined field types
    const validatedFormData = React.useMemo(() => {
        if (!formData) return [];

        // Filter out any fields with undefined types
        return formData.filter((field: FormInputProp) => {
            if (!field.type) {
                console.warn(
                    `Removing field with name "${field.name || 'unknown'}" - type is undefined`,
                );
                return false;
            }
            return true;
        });
    }, [formData]);

    const { RenderForm, runValidateForm, prepareDataToSubmit } = FormBuilder({
        form: validatedFormData || [],
        centreConfig: centreConfig,
        currentData: currentData,
        setUpdatedFormValues: setUpdatedFormValues,
        centreId: centreId,
        t: t,
        showDetails: showDetails,
        setFileUploading: setFileUploading,
    });

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    return (
        <div>
            <div>
                {RenderForm && RenderForm()}

                <button
                    ref={formCreatorSubmitRef}
                    type="button"
                    hidden
                    onClick={() => {
                        if (runValidateForm()) {
                            // need to fix this
                            prepareDataToSubmit().then((r) => {
                                handleFormSubmit(r);
                            });
                        } else {
                            prepareDataToSubmit().then((r) => {
                                // after fix of runValidateForm() plz remove this else part
                                handleFormSubmit(r);
                            });
                        }
                    }}
                >
                    {buttonName}
                </button>
            </div>
        </div>
    );
};

export default FormCreator;
