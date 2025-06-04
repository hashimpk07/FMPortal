import { CentreConfig } from '../../../services/centres';

/**
 * Helper function to decode Unicode currency symbol from the API
 *
 * @param symbol The currency symbol from the API (e.g. "\u00A3")
 * @returns The decoded currency symbol (e.g. "£")
 */
function decodeCurrencySymbol(symbol?: string): string {
    if (!symbol) return '';

    try {
        // The API returns Unicode symbols like "\u00A3" (£)
        // We need to convert this to the actual symbol
        return JSON.parse(`"${symbol}"`);
    } catch (e) {
        console.error('Error decoding currency symbol:', e);
        return symbol;
    }
}

/**
 * Formats a currency value according to the centre's configuration
 *
 * @param value The currency value to format
 * @param centreConfig The centre configuration
 * @returns Formatted currency string
 */
export function formatCurrencyByCentreConfig(
    value: string | number | null | undefined,
    centreConfig: CentreConfig | null,
): string {
    if (value === null || value === undefined || value === '') return '-';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';

    if (centreConfig) {
        try {
            // Get currency code and symbol from config
            const currencyCode = centreConfig.default_currency_code || 'USD';

            // Create formatter using Intl.NumberFormat
            const formatter = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'symbol',
            });

            return formatter.format(numValue);
        } catch (error) {
            console.error('Error formatting currency:', error);

            // Fallback if formatting fails
            const currencySymbol = decodeCurrencySymbol(centreConfig.default_currency_symbol) || '';
            return `${currencySymbol}${numValue}`;
        }
    }

    // Simple fallback if no centre config
    return `${numValue}`;
}

export default formatCurrencyByCentreConfig;
