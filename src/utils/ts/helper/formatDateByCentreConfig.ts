import { CentreConfig } from '../../../services/centres';

/**
 * Formats a date according to the centre's locale configuration
 *
 * @param dateString The date string to format
 * @param centreConfig The centre configuration
 * @param formatType The type of format to use (date, time, datetime)
 * @returns Formatted date string according to locale
 */
export function formatDateByCentreConfig(
    dateString: string | null | undefined,
    centreConfig: CentreConfig | null,
    formatType: 'date' | 'time' | 'datetime' = 'date',
): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return '-';

        // Get locale from centre config, default to en-GB
        // First try config.locale, then fall back to centreConfig attributes directly (if available)
        const locale = centreConfig?.locale || 'en-GB';

        // Define format options based on locale and format type
        if (formatType === 'date') {
            return date.toLocaleDateString(locale);
        }
        if (formatType === 'time') {
            return date.toLocaleTimeString(locale);
        }
        return date.toLocaleString(locale);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

export default formatDateByCentreConfig;
