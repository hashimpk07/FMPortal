import FormInputProp from './FormInputProp.ts';

const getTaxFieldValue = (input: FormInputProp, data: any) => {
    if (data[input?.fieldToCalculate || ''] && input?.taxRate != null) {
        const taxRate = 1 + parseFloat(input?.taxRate) / 100;

        if (input?.taxOperation === '+') {
            return (parseFloat(data[input?.fieldToCalculate || '']) * taxRate).toFixed(2); // @TODO FIX THIS SOMEHOW TO NOT BE FIXED
        }
        if (input?.taxOperation === '-') {
            return (parseFloat(data[input?.fieldToCalculate || '']) / taxRate).toFixed(2); // @TODO FIX THIS SOMEHOW TO NOT BE FIXED
        }
    }

    return '';
};

const getSumField = (input: FormInputProp, data: any) => {
    let value = 0;

    input?.fieldsToSum?.forEach((field) => {
        value =
            field.operation === '+'
                ? value + parseFloat(data[field?.field || ''] || '0')
                : value - parseFloat(data[field?.field || ''] || '0');
    });

    return value.toFixed(parseInt(input?.decimalPlaces as string, 10) || 2);
};

export { getTaxFieldValue, getSumField };
