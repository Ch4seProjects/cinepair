import { getUserData } from "@/lib/user";
import { getMyPair } from "@/app/actions/pair-actions";
import { JoinPairDialog } from "./join-pair-dialog";
import { CreatePairDialog } from "./create-pair-dialog";
import { UpdatePairDialog } from "./update-pair-dialog";
import { DeletePairDialog } from "./delete-pair-dialog";

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
    return (
      <div>
        <div>You are in a pair!</div>
        <div>Pair: {result.data.name}</div>
        <div>Code: {result.data.invite_code}</div>
        <UpdatePairDialog prevName={result.data.name} />
        <DeletePairDialog />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <CreatePairDialog userId={user?.id ?? ""} />
      <JoinPairDialog userId={user?.id ?? ""} />
    </div>
  );
}
