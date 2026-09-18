"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getCookieData from "@/utils/getCookieData";
import { useLogin } from "@/container/auth/login/Hooks";
import LoginView from "@/components/auth/login";

const LoginContainer = () => {
  const router = useRouter();
  const login = useLogin();

  useEffect(() => {
    if (getCookieData("resortToken")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <LoginView {...login} />;
};

export default LoginContainer;
