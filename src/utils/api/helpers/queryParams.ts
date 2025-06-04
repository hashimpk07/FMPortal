/**
 * Helper functions for working with query parameters
 */

/**
 * Appends a parameter to URLSearchParams if the value exists
 * @param params URLSearchParams instance
 * @param key Parameter key
 * @param value Parameter value
 * @param transform Optional transformation function for the value
 */
export function appendIfExists<T>(
    params: URLSearchParams,
    key: string,
    value: T | undefined | null,
    transform?: (val: T) => string,
): void {
    if (value !== undefined && value !== null && value !== '') {
        const stringValue = transform ? transform(value) : String(value);
        params.append(key, stringValue);
    }
}

/**
 * Appends array items as a comma-separated list if the array has items
 * @param params URLSearchParams instance
 * @param key Parameter key
 * @param values Array of values
 * @param transform Optional transformation function for each value
 */
export function appendArrayIfNotEmpty<T>(
    params: URLSearchParams,
    key: string,
    values: T[] | undefined | null,
    transform?: (val: T) => string,
): void {
    if (values && values.length > 0) {
        const stringValues = transform ? values.map(transform).join(',') : values.join(',');
        params.append(key, stringValues);
    }
}

/**
 * Builds pagination parameters
 * @param params URLSearchParams instance
 * @param page Page number
 * @param pageSize Page size
 * @param format Format of the pagination parameters (default: 'brackets')
 */
export function appendPagination(
    params: URLSearchParams,
    page: number = 1,
    pageSize: number = 10,
    format: 'brackets' | 'simple' = 'brackets',
): void {
    if (format === 'brackets') {
        params.append('page[number]', page.toString());
        params.append('page[size]', pageSize.toString());
    } else {
        params.append('page', page.toString());
        params.append('page_size', pageSize.toString());
    }
}

/**
 * Appends fields parameters for API field selection
 * @param params URLSearchParams instance
 * @param fields Object with field type as key and array of field names as value
 */
export function appendFields(params: URLSearchParams, fields: Record<string, string[]>): void {
    Object.entries(fields).forEach(([type, fieldList]) => {
        if (fieldList.length > 0) {
            params.append(`fields[${type}]`, fieldList.join(','));
        }
    });
}
