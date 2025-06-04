import { enUS, enGB } from 'date-fns/locale';

type Locale = { [key: string]: object | undefined };

const locales: Locale = { 'en-US': enUS, 'en-GB': enGB };
const clientLocale = navigator.language || 'en-GB'; // Default to 'UK' if not available
const locale = locales[clientLocale] || locales['en-GB']; // Default to 'en-GB' if locale not found

export default locale;
