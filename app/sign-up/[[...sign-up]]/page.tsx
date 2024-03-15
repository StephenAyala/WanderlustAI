import { SignUp } from "@clerk/nextjs";
import { WavyBackground } from "@/components/WavyBackground";

const SignUpPage = () => {
  return (
    <WavyBackground>
      <div className="min-h-screen flex justify-center items-center">
        <SignUp afterSignUpUrl="/chat" />
      </div>
    </WavyBackground>
  );
};
export default SignUpPage;
