import { Suspense } from "react";
import PairButton from "@/components/pair-button";
import WatchLogList from "@/components/watch-log-list";

export default function HomePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* <Suspense fallback={<div>Loading...</div>}>
        <PairButton />
      </Suspense> */}
      <div className="flex flex-col gap-4">
        Watch Log Feed:
        <Suspense fallback={<div>Loading...</div>}>
          <WatchLogList />
        </Suspense>
      </div>
    </div>
  );
}
