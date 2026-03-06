
export type Chapter = {
  id: number;
  title: string;
  narrative: string[];
  prompt: string;
  color: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    title: "Origin",
    narrative: [
      "In the beginning, there was only the void.",
      "A single point of focus. A silent, unformed thought.",
      "Waiting for the first spark of intention."
    ],
    prompt: "Hover to illuminate the potential.",
    color: "#ffffff"
  },
  {
    id: 1,
    title: "Signal",
    narrative: [
      "Energy begins to flow.",
      "Logic gates align as the circuitry of life awakens.",
      "The idea starts to speak in pulses of light."
    ],
    prompt: "Move your cursor to guide the flow.",
    color: "#8CBBFF"
  },
  {
    id: 2,
    title: "Pressure",
    narrative: [
      "Ambition demands structure.",
      "The weight of expectation compresses the core.",
      "Strength is forged in the density of focus."
    ],
    prompt: "Hold your breath as the form hardens.",
    color: "#C166ED"
  },
  {
    id: 3,
    title: "Fracture",
    narrative: [
      "Growth is never linear.",
      "Tension pulls at the seams until the surface yields.",
      "Within the cracks, we find the truth of the inner light."
    ],
    prompt: "Click to release the tension.",
    color: "#FF8C8C"
  },
  {
    id: 4,
    title: "Alignment",
    narrative: [
      "The pieces find their place.",
      "Discord resolves into a clear, transparent vision.",
      "A synthesis of glass and steel, perfectly poised."
    ],
    prompt: "Drag to find the center.",
    color: "#A0E9FF"
  },
  {
    id: 5,
    title: "Artifact",
    narrative: [
      "The journey is complete.",
      "A masterwork of intention, ready for the world.",
      "What started as a point is now an infinite monument."
    ],
    prompt: "Double click to celebrate the creation.",
    color: "#FFD700"
  }
];
