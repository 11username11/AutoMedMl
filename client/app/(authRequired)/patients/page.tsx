import PatientsTable from "@/components/pages/patients/patients-table";
import { getPatients } from "@/lib/data/server/patient";
import { getTranslations } from 'next-intl/server';

export default async function Patients() {
  const patients = await getPatients()
  const t = await getTranslations('PatientsPage');

  return (
    <div className="flex flex-col p-10 gap-8 flex-1 overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold">{t('title')}</div>
          <div className="text-muted ">{t('description')}</div>
        </div>
      </div>
      <PatientsTable patients={patients}></PatientsTable>
    </div>
  );
}
