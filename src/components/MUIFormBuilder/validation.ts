import FormInputProp from './FormInputProp.ts';

const showField = (input: FormInputProp, form: FormInputProp[], data: any) => {
    if (!input.groupId) return true;

    const groupController = form.filter((inputChecking) => {
        if (inputChecking.type === 'checkbox-dynamic-fields') {
            return input.groupId === inputChecking?.groupToggleIds;
        }

        if (inputChecking.type === 'radio-group-dynamic-fields') {
            const hasFound = inputChecking.options?.find((radio) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return radio?.value.split(',').includes(input.groupId);
            });

            if (hasFound) {
                return true;
            }
        }
        return false;
    });

    if (!groupController) return false;

    const shouldShow = groupController.filter((controller) => {
        if (controller.type === 'checkbox-dynamic-fields') {
            if (
                controller?.name &&
                data[controller?.name]?.length > 0 &&
                controller?.toggleAction === 'show'
            ) {
                return false;
            }
            if (
                controller?.name &&
                data[controller?.name]?.length === 0 &&
                controller?.toggleAction === 'hide'
            ) {
                return false;
            }
        }

        if (controller.type === 'radio-group-dynamic-fields') {
            const findOption = controller.options?.find((i: any) => {
                return i?.value.split(',').includes(input.groupId);
            }) as any; // @TODO FIX THIS TO NOT BE ANY

            if (findOption && data[controller?.name || ''] === findOption?.label) {
                return false;
            }
        }

        return true;
    });

    return shouldShow.length === 0;
};

const isInputInvalid = (input: FormInputProp, form: FormInputProp[], data: any) => {
    if (!input?.name) return false;

    // If Field is invalid
    if (
        input?.required &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        input?.required !== 'false' &&
        showField(input, form, data) &&
        (!data[input.name] || data[input.name].length === 0)
    ) {
        return true;
    }

    if (!data[input.name]) return false;

    // Check Max Length
    if (input?.validationRules && input?.validationRules['data-parsley-maxlength']) {
        const dataParseInt = parseInt(data[input.name], 10);
        if (
            dataParseInt &&
            dataParseInt.toString().length >
                parseInt(input?.validationRules['data-parsley-maxlength'], 10)
        ) {
            return true;
        }
    }

    // Pattern Match
    if (input?.validationRules && input?.validationRules['data-parsley-pattern']) {
        const match = input?.validationRules['data-parsley-pattern'].match(/^\/(.*?)\/([gimy]*)$/);

        if (match) {
            const pattern = new RegExp(match[1], match[2] || 'm');

            const doesMatch = pattern.test(data[input.name]);

            if (!doesMatch) {
                return true;
            }
        }
    }

    if (input?.type === 'attachment') {
        if (data[input.name].error) {
            return true;
        }
    }

    if (input?.type === 'multi-attachment') {
        let hasError = false;
        const keys = Object.keys(data[input.name]);

        if (data[input.name]) {
            keys.forEach((index: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const val = data[input.name][index];
                if (val.error) {
                    hasError = true;
                }
            });
        }

        if (hasError) {
            return true;
        }
    }

    return false;
};

const isFormValid = (form: FormInputProp[], data: any) => {
    let isValid = true;

    form.forEach((input) => {
        if (isInputInvalid(input, form, data)) {
            isValid = false;
        }
    });

    return isValid;
};

export { isInputInvalid, isFormValid, showField };
