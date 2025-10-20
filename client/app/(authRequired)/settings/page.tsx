'use client'

import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectTrigger, SelectLabel } from "@/components/ui/select";
import { LuPalette, LuShield } from "react-icons/lu";
import { GoSignOut } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import LogoutButton from "@/components/ui/logout-btn";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DeleteAccountBtn from "@/components/ui/delete-account-btn";

export default function Settigs() {
  const t = useTranslations("SettingsPage")

  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const locale = useLocale()

  const handleThemeChange = (value: string) => setTheme(value)
  const handleLanguageChange = (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 h-full w-full">
      <div className="flex flex-col gap-8 max-w-4xl w-full">
        <div>
          <div className="text-3xl font-bold">{t("title")}</div>
          <div className="text-muted">{t("description")}</div>
        </div>

        <div className="flex gap-8 w-full">
          <div className="bg-primary border p-6 rounded-md flex-1">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <LuPalette size={24} />
                  {t("cards.region.title")}
                </div>
                <div className="text-muted text-sm">{t("cards.region.description")}</div>
              </div>

              <div className="flex flex-col gap-1 mt-auto">
                <div className="font-semibold text-sm">{t("cards.region.language.label")}</div>
                <Select defaultValue={locale} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full cursor-pointer bg-background">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pl">{t("cards.region.language.options.pl")}</SelectItem>
                      <SelectItem value="en">{t("cards.region.language.options.en")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-primary border p-6 rounded-md flex-1">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <LuPalette size={24} />
                  {t("cards.appearance.title")}
                </div>
                <div className="text-muted text-sm">{t("cards.appearance.description")}</div>
              </div>

              <div className="flex flex-col gap-1 mt-auto">
                <div className="font-semibold text-sm">{t("cards.appearance.theme.label")}</div>
                <Select defaultValue={theme || "system"} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-full cursor-pointer bg-background">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="system">{t("cards.appearance.theme.options.system")}</SelectItem>
                      <SelectItem value="light">{t("cards.appearance.theme.options.light")}</SelectItem>
                      <SelectItem value="dark">{t("cards.appearance.theme.options.dark")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-primary border p-6 rounded-md">
          <div className="space-y-1">
            <div className="flex gap-1 items-center">
              <div><LuShield size={20} /></div>
              <div className="text-xl font-semibold">{t("cards.accountActions.title")}</div>
            </div>
            <div className="text-muted text-sm">{t("cards.accountActions.description")}</div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-background rounded-md not-dark:border">
              <div>
                <div className="font-semibold">{t("cards.accountActions.sections.logout.title")}</div>
                <div className="text-sm text-muted">{t("cards.accountActions.sections.logout.description")}</div>
              </div>
              <LogoutButton>
                <div className="flex items-center justify-center text-sm py-2 font-semibold gap-2 px-3 border bg-primary rounded-md cursor-pointer hover:bg-primary-foreground duration-200">
                  <GoSignOut strokeWidth={1} />
                  {t("cards.accountActions.sections.logout.buttons.logout")}
                </div>
              </LogoutButton>
            </div>

            <Separator></Separator>

            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md flex items-center justify-between gap-8">
              <div>
                <div className="text-destructive font-semibold">{t("cards.accountActions.sections.deleteAccount.title")}</div>
                <div className="text-sm text-muted">{t("cards.accountActions.sections.deleteAccount.description")}</div>
              </div>

              <DeleteAccountBtn>
                {t("cards.accountActions.sections.deleteAccount.buttons.delete")}
              </DeleteAccountBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
