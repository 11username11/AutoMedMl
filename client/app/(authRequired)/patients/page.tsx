'use client'

import NewCase from "@/components/ui/new-case-btn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchInput from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: "active" | "inactive" | "scheduled";
  avatar?: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@email.com",
    phone: "+1 (555) 123-4567",
    age: 45,
    gender: "Male",
    lastVisit: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 234-5678",
    age: 32,
    gender: "Female",
    lastVisit: "2024-01-12",
    status: "scheduled",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+1 (555) 345-6789",
    age: 38,
    gender: "Male",
    lastVisit: "2023-12-20",
    status: "inactive",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    age: 28,
    gender: "Female",
    lastVisit: "2024-01-10",
    status: "active",
  },
];

const getStatusBadge = (status: Patient["status"]) => {
  const statusConfig = {
    active: { label: "Active", className: "bg-success text-accent-foreground" },
    inactive: { label: "Inactive", className: "bg-primary-foreground text-foreground" },
    scheduled: { label: "Scheduled", className: "bg-secondary text-accent-foreground" },
  };

  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredPatients = mockPatients.filter((patient) =>
    Object.values(patient).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between p-4 items-start">
        <div>
          <div className="text-3xl font-bold">Patients</div>
          <div className="text-muted ">Manage and view patient information</div>
        </div>

        <NewCase></NewCase>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-primary">
        <div>
          <div className="flex gap-4">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></SearchInput>
            <div className="flex justify-center items-center gap-1 text-sm text-muted bg-background border rounded-md px-4 h-10 hover:bg-primary-foreground hover:text-foreground cursor-pointer duration-200">
              <CiFilter strokeWidth={1.5} size={16} />
              Filter
            </div>
          </div>
          <div>
          </div>
        </div>

        <div className="rounded-lg border bg-background">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="secondary-foreground/50">
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 my-1">
                      <div className="rounded-full text-accent-foreground shrink-0 flex items-center justify-center bg-secondary-foreground w-10 h-10">
                        {(patient.name.charAt(0) + patient.name.charAt(1)).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium ">{patient.name}</div>
                        <div className="text-sm text-muted-foreground ]">ID: {patient.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm ">{patient.email}</div>
                      <div className="text-sm text-muted-foreground ">{patient.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border border-border">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
