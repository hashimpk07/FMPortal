interface FormInputOptionsProps {
    label: string;
    value: string;
}
interface FormInputFieldsToSumProps {
    field: string;
    operation: string;
}

interface FormInputValidationProps {
    'data-cannot-be-greater-than': string;
    'data-greater-zero-dependency': string;
    'data-parsley-maxlength': string;
    'data-parsley-pattern': string;
}

interface FormInputProp {
    type: string;
    name?: string;
    label?: string;
    groupId?: string;
    header?: string;
    subheader?: string;
    itext?: string;
    value?: string;
    placeholder?: string;
    groupToggleIds?: string;
    toggleAction?: string;
    defaultOption?: string;
    defaultState?: string;
    taxOperation?: string;
    taxRate?: string;
    fieldToCalculate?: string;
    decimalPlaces?: string;
    acceptedMimeTypes?: string;
    required?: string;
    acceptedMimeTypesCustom?: string;
    label_checkbox?: string;
    max_file_size?: number | string;
    max_attachments?: number | string;
    image?: any;
    options?: FormInputOptionsProps[] | string[];
    fieldsToSum?: FormInputFieldsToSumProps[];
    values?: string[];
    validationRules?: FormInputValidationProps;
}

export default FormInputProp;

export { type FormInputOptionsProps };
