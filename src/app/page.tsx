"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleRoute() {
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="flex items-center justify-center h-dvh">
      <Button
        variant="outline"
        className="bg-blue-500 cursor-pointer hover:bg-blue-600 hover:text-white text-white transition-all"
        onClick={handleRoute}
      >
        Login
      </Button>
    </div>
  );
}
