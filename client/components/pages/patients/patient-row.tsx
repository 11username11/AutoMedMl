import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/status-badge";
import { differenceInYears, parse } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/ui/submit-btn";
import { Patient } from "@/lib/types/patient";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function PatientRow({ patient, ...props }: { patient: Patient } & React.HTMLAttributes<HTMLTableRowElement>) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const closeDialog = () => setOpen(false)
  const openDialog = () => setOpen(true)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (patient_id: string) => api.post("/delete_patient", { patient_id }),
    onSuccess: () => {
      router.refresh()
    }
  })

  const handleDelete = (patient_id: string) => toast.promise(mutateAsync(patient_id), {
    loading: "Deleting the patient...",
    error: "Something went wrong",
    success: "The patient was successfully deleted"
  })

  return (
    <TableRow {...props}>
      <TableCell>
        <div className="flex items-center gap-3 my-1">
          <div className="rounded-full text-accent-foreground shrink-0 flex items-center justify-center bg-secondary-foreground w-10 h-10">
            {(patient.name[0] + patient.surname[0]).toUpperCase()}
          </div>
          <div>
            <div className="font-medium ">{patient.name} {patient.surname}</div>
            <div className="text-sm text-muted-foreground ]">ID: {patient.patient_id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm ">{patient.email}</div>
          <div className="text-sm text-muted-foreground ">{patient.phone.match(/.{1,3}/g)?.join(" ") ?? ""}</div>
        </div>
      </TableCell>
      <TableCell>{differenceInYears(new Date(), parse(patient.date_of_birth, "dd.MM.yyyy", new Date()))}</TableCell>
      <TableCell>{patient.gender}</TableCell>
      <TableCell><StatusBadge status={patient.status} /></TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border">
            <Link href={"/patients/" + patient.patient_id}>
              <DropdownMenuItem className="gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </Link>
            <Link href={"/patients/" + patient.patient_id + "?mode=edit"}>
              <DropdownMenuItem className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Patient
              </DropdownMenuItem></Link>
            <DropdownMenuItem onClick={openDialog} className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="pb-4">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription className="space-y-4" asChild>
                <div>
                  <div>
                    This will permanently delete <span className="font-bold">{patient.name} {patient.surname}</span>'s record. This action cannot be undone.
                  </div>

                  <div className="ml-auto flex w-fit gap-2">
                    <Button onClick={closeDialog} size={"lg"} variant={"outline"}>Cancel</Button>
                    <SubmitButton isPending={isPending} onClick={() => handleDelete(patient.patient_id)} size={"lg"} variant={"destructive"}>
                      Yes, delete this patient
                    </SubmitButton>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}