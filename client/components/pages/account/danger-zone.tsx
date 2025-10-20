import DeleteAccountBtn from "@/components/ui/delete-account-btn";
import { useTranslations } from "next-intl";


export default function DangerZone() {
  const t = useTranslations("AccountPage.dangerZone")
  return (
    <div className="rounded-md p-4 space-y-6 shadow-sm bg-primary border">
      <div>
        <div className="text-2xl font-semibold text-destructive">{t("title")}</div>
        <div className="text-muted text-sm font-light">{t("description")}</div>
      </div>

      <div className="flex justify-between sm:flex-row flex-col sm:gap-8 gap-4 bg-destructive/5 border border-destructive/20 p-4 rounded-md">
        <div>
          <div className="text-destructive font-semibold">{t("deleteAccount.title")}</div>
          <div className="text-sm text-muted font-light">{t("deleteAccount.description")}</div>
        </div>
        <DeleteAccountBtn>
          {t("deleteAccount.buttons.delete")}
        </DeleteAccountBtn>
      </div>
    </div>
  )
}