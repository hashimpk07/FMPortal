import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from './english/lang.json';
import french from './french/lang.json';

const languages = {
    en: 'english',
    fr: 'french',
};

const languageFiles = {
    english,
    french,
};

const createResources = () => {
    const translations = {};

    for (const [code, lang] of Object.entries(languages)) {
        // @ts-expect-error  temp fix
        translations[code] = {
            // @ts-expect-error temp fix
            translation: { ...languageFiles[lang] },
        };
    }

    return translations;
};

i18next.use(initReactI18next).init({
    lng: navigator.language,
    fallbackLng: {
        default: ['en'],
    },
    resources: createResources(),
});
