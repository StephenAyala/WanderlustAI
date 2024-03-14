import { fetchUserTokensById } from "@/utils/actions";
import { UserProfile, auth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const ProfilePage = async () => {
  const { userId } = auth();
  // Ensure userId exists before proceeding
  if (!userId) {
    toast.error("User ID is not available.");
    return;
  }
  const currentTokens = await fetchUserTokensById(userId);

  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">
        Token Amount : {currentTokens}
      </h2>
      <UserProfile />
    </div>
  );
};
export default ProfilePage;
