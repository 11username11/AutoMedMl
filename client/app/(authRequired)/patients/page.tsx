import PatientsTable from "@/components/pages/patients/patients-table";
import { getPatients } from "@/lib/data/server/patient";
//   {
//     id: "1",
//     name: "John Anderson",
//     email: "john.anderson@email.com",
//     phone: "+1 (555) 123-4567",
//     age: 45,
//     gender: "Male",
//     lastVisit: "2024-01-15",
//     status: "active",
//   },
//   {
//     id: "2",
//     name: "Sarah Wilson",
//     email: "sarah.wilson@email.com",
//     phone: "+1 (555) 234-5678",
//     age: 32,
//     gender: "Female",
//     lastVisit: "2024-01-12",
//     status: "scheduled",
//   },
//   {
//     id: "3",
//     name: "Michael Johnson",
//     email: "michael.j@email.com",
//     phone: "+1 (555) 345-6789",
//     age: 38,
//     gender: "Male",
//     lastVisit: "2023-12-20",
//     status: "inactive",
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     email: "emily.davis@email.com",
//     phone: "+1 (555) 456-7890",
//     age: 28,
//     gender: "Female",
//     lastVisit: "2024-01-10",
//     status: "active",
//   },
// ];

export default async function Patients() {
  const patients = await getPatients()

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between p-4 items-start">
        <div>
          <div className="text-3xl font-bold">Patients</div>
          <div className="text-muted ">Manage and view patient information</div>
        </div>
      </div>

      <PatientsTable patients={patients}></PatientsTable>
    </div>
  );
}
