/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Formats a date string into a human-readable format with time
 * @param dateString ISO date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date);
    } catch (error) {
        console.error('Error formatting date and time:', error);
        return dateString;
    }
}

/**
 * Formats a time period in days into a human-readable format
 * @param days Number of days
 * @returns Formatted time period string (e.g., "2 years, 3 months")
 */
export function formatTimePeriod(days: number): string {
    if (!days || days <= 0) return '0 days';

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = Math.floor(days % 30);

    const parts = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    if (remainingDays > 0 && years === 0) {
        parts.push(`${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`);
    }

    return parts.join(', ');
}
