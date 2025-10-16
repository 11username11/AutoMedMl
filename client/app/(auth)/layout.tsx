import { getCurrentUser } from '@/lib/data/server/user';
import { CheckCircle, CircleCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import medicalHeroBg from "@/public/medical-hero-bg.jpg"
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

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
            <div className='font-bold text-xl'>Medical AI</div>
            <div className='text-muted'>AI-powered medical analysis platform</div>
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
            <h2 className="text-4xl font-bold">AI-Powered Healthcare Solutions</h2>
            <p className="text-lg opacity-90">
              Empowering medical professionals with cutting-edge artificial intelligence for accurate
              diagnostics and optimal patient care.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span>Rapid medical image analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span>Intelligent diagnostic assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span>Secure patient data management</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span>Multi-specialty medical support</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">99.2%</div>
              <div className="text-sm opacity-75">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2.3s</div>
              <div className="text-sm opacity-75">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm opacity-75">Doctors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}