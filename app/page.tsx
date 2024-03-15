import { DotBackground } from "@/components/DotBackground";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TextGenerateEffect } from "@/components/TextGenerateEffect";
import Link from "next/link";

const words = `Your AI language companion. Powered by OpenAI, it
enhances your conversations, content creation, and more!`;

const HomePage = () => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          WanderlustGPT
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <TextGenerateEffect words={words} />
          </blockquote>
        </div>
      </div>
      <DotBackground>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Getting Started
              </h1>
            </div>
            <SignedOut>
              <div className="grid grid-cols-2 gap-6">
                <Link
                  href="/sign-in"
                  className="btn btn-secondary cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="btn btn-secondary cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/chat" className="btn btn-secondary cursor-pointer">
                Continue to chat
              </Link>
            </SignedIn>
          </div>
        </div>
      </DotBackground>
    </div>
  );
};
export default HomePage;
