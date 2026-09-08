import { useApp } from '../context/AppContext';
import type { TranslationDict } from '../constants/translations';

export function useLanguage() {
  const { language, setLanguage, t } = useApp();

  const translate = (key: keyof TranslationDict): string => {
    return t[key] ?? String(key);
  };

  return {
    language,
    setLanguage,
    t: translate,
    dictionary: t,
  };
}
