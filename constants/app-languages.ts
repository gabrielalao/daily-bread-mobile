export type AppLanguage = {
  id: string; // BCP-47 language tag used for translations
  name: string; // English name
  nativeName: string; // Local/native name
  locale: string; // Locale for dates/times
};

export const appLanguages: AppLanguage[] = [
  { id: "en", name: "English", nativeName: "English", locale: "en-US" },
  { id: "fr", name: "French", nativeName: "Français", locale: "fr-FR" },
  { id: "da", name: "Danish", nativeName: "Dansk", locale: "da-DK" },
  { id: "es", name: "Spanish", nativeName: "Español", locale: "es-ES" },
  { id: "de", name: "German", nativeName: "Deutsch", locale: "de-DE" },
];

export const DEFAULT_APP_LANGUAGE = "en";

export function getAppLanguageById(id: string): AppLanguage | undefined {
  return appLanguages.find((l) => l.id === id);
}

