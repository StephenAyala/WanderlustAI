import { WavyBackground } from "@/components/WavyBackground";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <WavyBackground>
      <div className="min-h-screen flex justify-center items-center">
        <SignIn afterSignInUrl="/chat" />
      </div>
    </WavyBackground>
  );
};
export default SignInPage;
