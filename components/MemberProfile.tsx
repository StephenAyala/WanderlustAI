import { fetchOrGenerateTokens } from "@/utils/actions";
import { UserButton, auth, currentUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
const MemberProfile = async () => {
  const user = await currentUser();
  const { userId } = auth();
  if (!userId) {
    toast.error("User ID is not available.");
    return;
  }
  await fetchOrGenerateTokens(userId);

  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      {user && <p>{user.emailAddresses[0].emailAddress}</p>}
    </div>
  );
};
export default MemberProfile;
