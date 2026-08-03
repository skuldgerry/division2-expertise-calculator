import type { Metadata } from "next";
import { ExpertisePlanner } from "./ExpertisePlanner";

export const metadata: Metadata = {
  title: { absolute: "SHD Quartermaster — Division 2 Expertise Planner" },
  description:
    "Plan Division 2 weapon, gear, and skill Expertise upgrades from level 0 to 30 with the current Y8S1 material costs.",
};

export default function Home() {
  return <ExpertisePlanner />;
}
