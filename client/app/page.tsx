'use client'

import NewCase from "@/components/new-case";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { CiSearch } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { RiRobot2Line } from "react-icons/ri";


export default function Home() {
  return (
    <div className="flex gap-8 p-6 h-full">
      <div className="flex items-center gap-2 h-full">
        <div className="flex flex-col gap-3 h-full">
          <div className="font-semibold">
            Chats
          </div>

          <NewCase></NewCase>

          <div className="flex flex-col gap-2 w-80 border border-primary-foreground bg-primary p-4 rounded-md h-full">
            <div className="flex gap-3 text-primary bg-secondary p-3 rounded-md items-center">
              <div className="p-2 rounded-full bg-secondary-foreground">
                <RiRobot2Line size={20} />
              </div>
              <div>
                <div className="font-semibold">AI Consultation</div>
                <div className="text-xs font-light">General medical assistance</div>
              </div>
            </div>

            <Separator></Separator>

            <div className="flex flex-col gap-2">
              <div className="text-muted text-xs font-semibold px-1">Patient Chats</div>
              <SearchInput></SearchInput>

              <div className="flex gap-2.5 rounded-md bg-primary-foreground/40 hover:bg-primary-foreground/60 duration-200 cursor-pointer p-2 items-center">
                <div className="bg-primary-foreground rounded-full p-2.5">
                  <FiUser size={18} />
                </div>
                <div>
                  <div className="font-semibold text-[15px]">John Smith</div>
                  <div className="text-xs text-muted">Thank you for the consulation</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="w-full flex flex-col">
        <div className="text-2xl font-bold">Medical AI Chat</div>
        <div className="text-muted">Get instant medical information and guidance from our AI assistant</div>

        <div className="flex flex-col gap-4 bg-primary h-full w-full p-4 border rounded-md mt-[34px]">

          <div className="flex items-start gap-4 ">
            <div className="p-2 rounded-full bg-secondary text-primary">
              <RiRobot2Line size={20} />
            </div>
            <div className="flex flex-col gap-2 text-muted bg-primary-foreground/40 p-3 rounded-md">
              <div className="text-sm">
                Hello! I'm your AI medical assistant. How can I help you today?
              </div>
              <div className="text-xs">
                4:13:57 PM
              </div>
            </div>
          </div>

        </div>

        <div className="flex gap-2 mt-4">
          <Input className="bg-primary h-10" placeholder="Type your medical question here"></Input>

          <div className="flex items-center justify-center shrink-0 h-10 w-10 p-2 rounded-md bg-secondary text-primary hover:bg-secondary-foreground cursor-pointer duration-200">
            <LuSend size={18} />
          </div>
        </div>
        <div className="text-center text-xs text-muted mt-2">
          This AI assistant provides general information only. Always consult healthcare professionals for medical advice.
        </div>
      </div>
    </div>
  );
}
