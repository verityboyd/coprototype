//this should be the login page and if login successful, push to "home"/search page
//something like if(user) push("/home")
//return {!user && <LogInPLz>}
//remember: show sign in form on render, switch to log in using a useState if user clicks on that.
//{isLogin? <LoginForm/> : <SignUpForm/>}
//state defined here

"use client";
import { useState } from "react";
import SignUpForm from "./components/SignUpForm";
import SiteHeader from "./components/SiteHeader";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <main>
      <SiteHeader />
      <header>Calgary Opera Archive</header>
      <SignUpForm />
    </main>
  );
}
