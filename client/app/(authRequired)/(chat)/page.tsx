import Chat from "@/components/pages/chat/chat";

export default async function Home({ searchParams }: { searchParams: Promise<{ chat: string }> }) {
  return <Chat></Chat>;
}
