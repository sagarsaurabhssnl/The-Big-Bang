
import { HUD } from "@/components/UI/HUD";
import { StorySections } from "@/components/Narrative/StorySections";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <HUD />
      <StorySections />
    </main>
  );
}
