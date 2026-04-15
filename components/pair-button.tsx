import { getUserData } from "@/lib/user";
import { getMyPair } from "@/lib/pairing";
import { JoinPairDialog } from "./join-pair-dialog";
import { CreatePairDialog } from "./create-pair-dialog";

export default async function PairButton() {
  const user = await getUserData();
  const pair = await getMyPair({ userId: user?.id ?? "" });

  if (pair) {
    return <div>You are in a pair!</div>;
  }

  return (
    <div className="flex gap-2">
      <CreatePairDialog userId={user?.id ?? ""} />
      <JoinPairDialog userId={user?.id ?? ""} />
    </div>
  );
}
