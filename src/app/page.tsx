
import { HUD } from "@/components/UI/HUD";
import { StorySections } from "@/components/Narrative/StorySections";

// export default function Home() {
//   return (
//     <main className="relative min-h-screen">
//       <HUD />
//       <StorySections />
//     </main>
//   );
// }

export default function Home() {
  return (
    <main className="relative z-10 pointer-events-none">
      <HUD />
      <StorySections />
    </main>
  );
}
