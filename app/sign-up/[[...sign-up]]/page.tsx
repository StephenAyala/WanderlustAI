import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignUp afterSignUpUrl="/chat" />
    </div>
  );
};
export default SignUpPage;
