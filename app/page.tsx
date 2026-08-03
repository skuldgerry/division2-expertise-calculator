import type { Metadata } from "next";
import { ExpertisePlanner } from "./ExpertisePlanner";

export const metadata: Metadata = {
  title: { absolute: "Expertise Calculator — The Division 2" },
  description:
    "Plan Division 2 weapon, gear, and skill Expertise upgrades from level 0 to 30 with the current Y8S1 material costs.",
};

export const dynamic = "force-static";

export default function Home() {
  return <ExpertisePlanner />;
}
