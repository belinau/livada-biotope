import { useTranslations as useNextIntlTranslations } from 'next-intl';
import { AbstractIntlMessages } from 'next-intl';

type Namespace = string;

// Helper type to get nested keys from an object
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & (string | number)];

type UseTranslationsReturn<Namespace extends string> = (
  key: NestedKeyOf<{
    [K in Namespace]: AbstractIntlMessages[K] extends object
      ? AbstractIntlMessages[K]
      : never;
  }> | string,
  values?: Record<string, any>
) => string;

/**
 * A wrapper around next-intl's useTranslations hook that provides type safety
 * and a consistent API for our application.
 * 
 * @param namespace - The namespace to use for translations
 * @returns The translation function
 */
export function useTranslations<ObjectType extends object>(
  namespace?: string
): UseTranslationsReturn<string> {
  const t = useNextIntlTranslations(namespace);
  
  return (key: NestedKeyOf<ObjectType> | string, values?: Record<string, any>) => 
    t(key as string, values);
}

// Helper function to get translations with a specific namespace
export function createTranslations<NS extends string>(namespace: NS) {
  return function useNsTranslations() {
    return useTranslations(namespace);
  };
}

export default useTranslations;
