"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getCookieData from "@/utils/getCookieData";
import { useSignup } from "@/container/auth/signup/Hooks";
import SignupView from "@/components/auth/signup";

const SignupContainer = () => {
  const router = useRouter();
  const signup = useSignup();

  useEffect(() => {
    if (getCookieData("prioBankClientToken")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <SignupView {...signup} />;
};

export default SignupContainer;
