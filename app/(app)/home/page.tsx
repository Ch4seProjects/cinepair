import { InfoIcon } from "lucide-react";
import { Suspense } from "react";

import PairButton from "@/components/pair-button";

export default function HomePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <Suspense fallback={<div>Loading...</div>}>
        <PairButton />
      </Suspense>
    </div>
  );
}
