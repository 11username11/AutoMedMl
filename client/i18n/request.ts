import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { merge } from "lodash-es"

export default getRequestConfig(async () => {
  const supported = ['en', 'pl'];

  const acceptLang = (await headers()).get('accept-language')?.slice(0, 2) ?? "en";
  const locale = (await cookies()).get("locale")?.value ?? (supported.includes(acceptLang) ? acceptLang : "en");
  const enMessages = (await import(`../messages/en.json`)).default;
  
  let localeMessages = {};
  try {
    localeMessages = (await import(`../messages/${locale}.json`)).default;
  } catch { }

  return {
    locale,
    messages: merge({}, enMessages, localeMessages)
  };
});