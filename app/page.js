//this should be the login page and if login successful, push to "home"/search page
//something like if(user) push("/home")
//return {!user && <LogInPLz>}
//remember: show sign in form on render, switch to log in using a useState if user clicks on that.
//{isLogin? <LoginForm/> : <SignUpForm/>}
//state defined here

"use client";
import { useState } from "react";
import SignUpForm from "./components/SignUpForm";
import Image from "next/image";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <main className="flex flex-row w-full min-h-screen">
      <div className="flex flex-1 justify-center items-center">
        <SignUpForm />
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
