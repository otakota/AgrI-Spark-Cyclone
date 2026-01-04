"use client";

import React from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import GoogleSignInButton from "@/components/googleButton/GoogleSignInButton"

const LoginPage = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    // ログイン済みの場合はTOPページにリダイレクト
    if (status === "authenticated") {
      redirect("/home");
    }
  }, [session, status]);

  const handleLogin = (provider: string) => async (event: React.MouseEvent) => {
    event.preventDefault();
    const result = await signIn(provider);

    // ログインに成功したらTOPページにリダイレクト
    if (result) {
      redirect("/home");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="w-full max-w-xs space-y-6 rounded bg-white p-8 shadow-md">
        <div
          className=""
          onClick={handleLogin("google")}>
          <GoogleSignInButton />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;