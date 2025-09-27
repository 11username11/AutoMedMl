import PatientsTable from "@/components/pages/patients/patients-table";
import { getPatients } from "@/lib/data/server/patient";

export default async function Patients() {
  const patients = await getPatients()

  return (
    <div className="flex flex-col p-10 gap-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold">Patients</div>
          <div className="text-muted ">Manage and view patient information</div>
        </div>
      </div>

      <PatientsTable patients={patients}></PatientsTable>
    </div>
  );
}
