'use client'

import ChatSidebar from "@/components/chat-sidebar";
import { Input } from "@/components/ui/input";
import { LuSend } from "react-icons/lu";
import { RiRobot2Line } from "react-icons/ri";

export default function Home() {
  return (
    <div className="flex gap-8 p-6 h-full overflow-hidden">
      <ChatSidebar></ChatSidebar>

      <div className="w-full flex flex-col">
        <div className="text-2xl font-bold">Medical AI Chat</div>
        <div className="text-muted">
          Get instant medical information and guidance from our AI assistant
        </div>

        <div className="flex flex-col gap-4 bg-primary h-full w-full p-4 border rounded-md mt-[34px]">
          <div className="flex items-start gap-4 ">
            <div className="p-2 rounded-full bg-secondary text-accent-foreground">
              <RiRobot2Line size={20} />
            </div>
            <div className="flex flex-col gap-2 text-muted bg-primary-foreground/40 p-3 rounded-md">
              <div className="text-sm">
                Hello! I'm your AI medical assistant. How can I help you today?
              </div>
              <div className="text-xs">4:13:57 PM</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Input
            className="bg-primary h-10"
            placeholder="Type your medical question here"
          ></Input>

          <div className="flex items-center justify-center shrink-0 h-10 w-10 p-2 rounded-md bg-secondary text-accent-foreground hover:bg-secondary-foreground cursor-pointer duration-200">
            <LuSend size={18} />
          </div>
        </div>
        <div className="text-center text-xs text-muted mt-2">
          This AI assistant provides general information only. Always consult
          healthcare professionals for medical advice.
        </div>
      </div>
    </div>
  );
}
