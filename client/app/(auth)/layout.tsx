import { getCurrentUser } from '@/lib/data/server/user';
import { CheckCircle, CircleCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import medicalHeroBg from "@/public/medical-hero-bg.jpg"
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  const t = await getTranslations("AuthPages")

  if (user) redirect("/")

  return (
    <div className='flex w-full min-h-fit h-full'>
      <div className='w-full min-h-fit h-full'>
        <div className="flex flex-col mx-auto gap-8 justify-center p-6 min-h-fit h-full max-w-md">
          <div className='flex flex-col items-center'>
            <Image
              src={"/logo.svg"}
              width={64}
              height={64}
              alt="logo"
              className="block mb-6"
            />
            <div className='font-bold text-xl'>{t("header.title")}</div>
            <div className='text-muted'>{t("header.description")}</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 w-full">
            {children}
          </div>
        </div>

      </div>
      <div
        className="hidden lg:flex shrink-0 w-5/12 p-8 bg-gradient-to-br from-secondary-foreground/90 to-secondary-foreground text-accent-foreground relative overflow-hidden"
        style={{
          backgroundImage: `url(${medicalHeroBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-foreground/90 to-secondary-foreground/80" />
        <div className="relative z-10 flex flex-col justify-center p-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">{t("sidebar.title")}</h2>
            <p className="text-lg opacity-90">
              {t("sidebar.description")}
            </p>
          </div>

          <div className="space-y-4">
            {t.rich("sidebar.itemsList", {
              item: (children) => <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span>{children}</span>
              </div>
            })}
          </div>

          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">99.2%</div>
              <div className="text-sm opacity-75">{t("sidebar.accuracy")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2.3s</div>
              <div className="text-sm opacity-75">{t("sidebar.analysis")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm opacity-75">{t("sidebar.doctors")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}