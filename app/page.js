"use client";
import { useState } from "react";
import SignUpForm from "./components/SignUpForm";
import Image from "next/image";
import LogInForm from "./components/LogInForm";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <main className="flex flex-row w-full min-h-screen">
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col">
          {showLogin ? (
            <>
              <LogInForm />
              <div className="flex flex-col items-center py-5">
                <div className="flex flex-row">
                  Don&apos;t have an account?
                  <button
                    onClick={() => setShowLogin(false)}
                    className="font-bold text-[#9E1817] hover:underline pl-1"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <SignUpForm />
              <div className="flex flex-col items-center py-5">
                <div className="flex flex-row">
                  Already have an account?
                  <button
                    onClick={() => setShowLogin(true)}
                    className="font-bold text-[#9E1817] hover:underline pl-1"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </>
          )}{" "}
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Image
          src="/assets/signin.png"
          alt="Midori Marsh in Calgary Opera's Don Giovanni (2024). Harder Lee Photography."
          height={450}
          width={700}
        />
      </div>
    </main>
  );
}
