
export type Chapter = {
  id: string | number;
  title: string;
  narrative: string[];
  prompt: string;
  color: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "origin",
    title: "Origin",
    narrative: [
      "Before form, there was only quiet potential.",
      "Not absence — but something waiting to begin.",
      "A shape rests at the edge of becoming."
    ],
    prompt: "Gently touch to awaken the potential.",
    color: "#ffffff"
  },
  {
    id: "signal",
    title: "Signal",
    narrative: [
      "The silence shifts.",
      "A faint rhythm moves through the stillness.",
      "The first trace of order begins to gather."
    ],
    prompt: "Guide the signal with your touch.",
    color: "#8CBBFF"
  },
  {
    id: "pressure",
    title: "Pressure",
    narrative: [
      "Energy collects beneath the surface.",
      "The idea grows dense with intention.",
      "What is forming can no longer remain contained."
    ],
    prompt: "Hold close to feel the building force.",
    color: "#C166ED"
  },
  {
    id: "fracture",
    title: "Fracture",
    narrative: [
      "The stillness breaks.",
      "Not destruction — but release.",
      "From the split, motion is born."
    ],
    prompt: "A single touch to release the light.",
    color: "#FF8C8C"
  },
  {
    id: "alignment",
    title: "Alignment",
    narrative: [
      "Fragments begin to recognize their place.",
      "Motion settles into direction.",
      "Structure emerges from the scatter."
    ],
    prompt: "Drag to find the perfect center.",
    color: "#A0E9FF"
  },
  {
    id: "artifact",
    title: "Artifact",
    narrative: [
      "The form stabilizes.",
      "Light finds its edges.",
      "What began as a whisper now stands complete."
    ],
    prompt: "Double tap to celebrate the creation.",
    color: "#FFD700"
  }
];
