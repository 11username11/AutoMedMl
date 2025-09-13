import { getCurrentUser } from '@/lib/data/server/user';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (user) redirect("/")

  return <>{children}</>;
}