import translations from '../locales/translations';

export const useTranslation = () => {
  const language = 'en';
  const t = (key) => translations[language][key] || key;
  return { t, language };
};
