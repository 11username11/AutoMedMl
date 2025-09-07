'use client'

import { FiUser } from "react-icons/fi";
import SearchInput from "./ui/search-input";
import { Separator } from "./ui/separator";
import { RiRobot2Line } from "react-icons/ri";
import NewCase from "./new-case-btn";
import { useState } from "react";

const mockChats = [
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John1 Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation, Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
  {
    patientName: "John Smith",
    lastMessage: "Thank you for the consultation",
  },
];


export default function ChatSidebar() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredChats = mockChats.filter((chat) =>
    Object.values(chat).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="font-semibold">Chats</div>

      <NewCase variant="secondary"></NewCase>

      <div className="flex flex-col gap-2 w-96 border bg-primary p-4 rounded-md h-full overflow-hidden">
        <div className="flex gap-3 text-accent-foreground bg-secondary p-3 rounded-md items-center">
          <div className="p-2 rounded-full bg-secondary-foreground">
            <RiRobot2Line size={20} />
          </div>
          <div>
            <div className="font-semibold">AI Consultation</div>
            <div className="text-xs font-light">
              General medical assistance
            </div>
          </div>
        </div>

        <Separator></Separator>

        <div className="flex flex-col gap-2 h-full overflow-hidden">
          <div className="text-muted text-xs font-semibold px-1">
            Patient Chats
          </div>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></SearchInput>

          <div className="flex flex-col gap-2 overflow-y-auto pr-3">
            {filteredChats.map((chat, index) => (
              <div key={chat.patientName + index} className="flex gap-2.5 rounded-md bg-primary-foreground/40 hover:bg-primary-foreground duration-200 cursor-pointer p-2.5 items-center">
                <div className="bg-primary-foreground rounded-full p-2.5">
                  <FiUser size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium text-[15px]">
                    {chat.patientName}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}