import { getUserData } from "@/lib/user";
import { getMyPair } from "@/app/actions/pair-actions";
import { JoinPairDialog } from "./join-pair-dialog";
import { CreatePairDialog } from "./create-pair-dialog";

export default async function PairButton() {
  const user = await getUserData();
  const result = await getMyPair();

  if (!result.success) {
    return (
      <div className="text-sm text-destructive">
        Failed to load pair ({result.error.code}: {result.error.message})
      </div>
    );
  }

  if (result.data) {
    return <div>You are in a pair!</div>;
  }

  return (
    <div className="flex gap-2">
      <CreatePairDialog userId={user?.id ?? ""} />
      <JoinPairDialog userId={user?.id ?? ""} />
    </div>
  );
}
