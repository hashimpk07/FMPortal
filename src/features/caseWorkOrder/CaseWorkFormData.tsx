import { useRef } from 'react';
import FormCreator from '../../components/MUIFormBuilder/FormCreator';

const CaseWorkFormData = () => {
    const formCreatorSubmitRef = useRef<HTMLButtonElement>(null);

    const formData: any = [
        {
            type: 'attachment',
            label: 'Upload - Image',
            groupId: '',
            required: 'true',
            acceptedMimeTypes: 'image/*',
            acceptedMimeTypesCustom: '',
            name: 'attachment',
            max_file_size: '4',
            image: {
                // aspectRatio: { width: '3', height: '2' },
                // maximumDimensions: {
                //     width: '3000',
                //     height: '2000',
                //     method: 'resize',
                // },
                // minimumDimensions: { width: '1500', height: '1000' },
            },
        },
        {
            type: 'attachment',
            label: 'Upload - Custom',
            groupId: '',
            required: 'true',
            acceptedMimeTypes: 'custom',
            acceptedMimeTypesCustom: 'image/png,image/gif',
            name: 'upload_attachment',
            max_file_size: '14',
        },
        {
            type: 'attachment',
            label: 'Upload Documents',
            groupId: '',
            required: 'true',
            acceptedMimeTypes: 'application/*',
            acceptedMimeTypesCustom: 'image/png,image/gif',
            name: 'upload_documents',
            max_file_size: '',
        },
        {
            type: 'multi-attachment',
            label: 'Multi Upload',
            groupId: '',
            required: 'true',
            acceptedMimeTypes: 'image/*',
            acceptedMimeTypesCustom: '',
            name: 'multi-attachment',
            max_file_size: '',
            max_attachments: '3',
            image: {
                // aspectRatio: { width: '2', height: '1' },
                // maximumDimensions: {
                //     width: '1500',
                //     height: '750',
                //     method: 'error',
                // },
            },
        },
        { type: 'hidden-input', name: 'hidden_input', value: 'Hidden value' },
        {
            name: 'currency',
            type: 'currency',
            label: 'Currency',
            labelStyle: 'stacked',
            placeholder: '10',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
            validationRules: {
                'data-parsley-maxlength': '',
                'data-greater-zero-dependency': 'number,must_be_great_than_zero',
                'data-cannot-be-greater-than': 'is_bigger_than_currency',
                'data-parsley-pattern': '',
            },
        },
        {
            name: 'number',
            type: 'number',
            label: 'Number Field',
            labelStyle: 'stacked',
            placeholder: '1',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
            validationRules: {
                'data-parsley-maxlength': '3',
                'data-greater-zero-dependency': '',
                'data-cannot-be-greater-than': '',
                'data-parsley-pattern': '',
            },
        },
        {
            name: 'is_bigger_than_currency',
            type: 'number',
            label: 'is_bigger_than_currency',
            labelStyle: 'stacked',
            placeholder: '',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
        },
        {
            name: 'must_be_great_than_zero',
            type: 'number',
            label: 'must_be_great_than_zero',
            labelStyle: 'stacked',
            placeholder: '',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
        },
        {
            name: 'text',
            type: 'text',
            label: 'Pattern check',
            labelStyle: 'stacked',
            placeholder: 'test',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
            validationRules: {
                'data-parsley-maxlength': '',
                'data-greater-zero-dependency': '',
                'data-cannot-be-greater-than': '',
                'data-parsley-pattern':
                    '/^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$/gm',
            },
        },
        {
            name: 'text_large',
            type: 'textarea',
            label: 'Text Large  Field',
            labelStyle: 'stacked',
            placeholder: 'text_large',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
        },
        {
            name: 'date',
            type: 'datepicker',
            label: 'Date',
            labelStyle: 'stacked',
            placeholder: '',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
        },
        {
            name: 'datetime',
            type: 'datetimepicker',
            label: 'Date Time Field',
            labelStyle: 'stacked',
            placeholder: 'datetime',
            class: 'col-xs-12',
            required: 'true',
            groupId: '',
        },
        {
            type: 'select',
            class: 'col-xs-12',
            label: 'Dropdown Field',
            groupId: '',
            name: 'dropdown',
            required: 'false',
            values: ['Option 1', 'Option 2', 'Option 3'],
        },
        {
            type: 'checkbox-group',
            class: 'col-xs-12',
            label: 'Checkbox Field',
            name: 'checkbox',
            required: 'false',
            groupId: '',
            options: ['checkbox #1', 'checkbox #2'],
        },
        {
            type: 'tax-field-input',
            name: 'tax',
            label: 'Tax Field',
            fieldToCalculate: 'currency',
            taxRate: '20',
            taxOperation: '+',
        },
        {
            type: 'sum-field-input',
            name: 'sum',
            label: 'Sum Field',
            fieldsToSum: [
                { field: 'number', operation: '+' },
                { field: 'number', operation: '+' },
            ],
            decimalPlaces: '2',
        },
        {
            type: 'radio-group',
            class: 'col-xs-12',
            groupId: '',
            label: 'Radio Field',
            name: 'radio',
            defaultOption: 'None',
            options: ['Radio #1', 'Radio #2', 'Radio #3'],
            required: 'true',
        },
        { type: 'header', header: 'Dynamic Field Below', groupId: '' },
        {
            type: 'checkbox-dynamic-fields',
            name: 'dynamic_checkbox',
            label: 'dynamic_checkbox',
            label_checkbox: 'dynamic_checkbox Field',
            label_style: 'stacked',
            groupId: '',
            groupToggleIds: 'dynamic_checkbox',
            toggleAction: 'hide',
            defaultState: 'ticked',
        },
        {
            name: 'dynamic_checkbox_text',
            type: 'datetimepicker',
            label: 'dynamic_checkbox_text Field',
            labelStyle: 'stacked',
            placeholder: 'dynamic_checkbox_text',
            class: 'col-xs-12',
            required: 'true',
            groupId: 'dynamic_checkbox',
        },
        {
            type: 'radio-group-dynamic-fields',
            class: 'col-xs-12',
            label: 'dynamic_radio Field',
            name: 'dynamic_radio',
            defaultOption: 'dynamic_radio_1',
            options: [
                { label: 'dynamic_radio_1', value: 'dynamic_radio_1_val' },
                { label: 'dynamic_radio_2', value: 'dynamic_radio_2_val' },
            ],
            required: 'true',
        },
        {
            name: 'dynamic_radio_2_text',
            type: 'text',
            label: 'dynamic_radio_2_text Field',
            labelStyle: 'stacked',
            placeholder: 'dynamic_radio_2_text',
            class: 'col-xs-12',
            required: 'true',
            groupId: 'dynamic_radio_2_val',
        },
        {
            name: 'dynamic_radio_1_text',
            type: 'text',
            label: 'dynamic_radio_1_text Field',
            labelStyle: 'stacked',
            placeholder: 'dynamic_radio_1_text',
            class: 'col-xs-12',
            required: 'true',
            groupId: 'dynamic_radio_1_val',
        },
        { type: 'header', header: 'Heading #1', groupId: '' },
        { type: 'subheader', subheader: 'Sub Heading', groupId: '' },
        { type: 'itext', itext: 'Do you need some help? ', groupId: '' },
    ];

    const handleSubmit = (data: any) => {
        console.log('FormCreator Submit data : ', data);
        // call API or any function here..
    };

    const currentData: any = {
        title: '',
        content: '',
        number_field: null,
        date_field: '2025-01-28',
        checkbox1: ['Option 2'],
        radio1: 'Radio1',
        datetime_field: '2025-01-27T20:17:00.000+05:30',
        dynamic_checkbox: [],
        dynamic_radio: 'Radio label2',
        currency_field: '48',
        tax_amount: '77',
        sum_amount: '88.20',
    };

    return (
        <FormCreator
            formData={formData || []}
            centreConfig={{
                default_currency_symbol: '',
                default_currency_divider: '',
            }}
            currentData={currentData}
            centreId={1}
            onSubmit={(e: any) => {
                handleSubmit(e);
            }}
            hasSubmit={false}
            formCreatorSubmitRef={formCreatorSubmitRef}
        />
    );
};

export default CaseWorkFormData;
