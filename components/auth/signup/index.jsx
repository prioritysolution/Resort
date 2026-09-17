"use client";

import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputField from "@/common/formFields/InputField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import AuthShell from "@/components/auth/AuthShell";

const SignupView = ({
  form,
  loading,
  showPassword,
  setShowPassword,
  successOpen,
  handleSuccessClose,
  handleSubmit,
}) => {
  return (
    <AuthShell
      title="Create account"
      subtitle="Register with a username, email and password."
      footer={
        <p className="text-muted-foreground">
          Already have access?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          <InputField
            control={form.control}
            name="username"
            label="Username"
            placeholder="anita.sharma"
            isRequired
            autoComplete="username"
            startContent={<User className="size-4" />}
          />
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@bank.com"
            isRequired
            autoComplete="email"
            startContent={<Mail className="size-4" />}
          />
          <InputField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            isRequired
            autoComplete="new-password"
            startContent={<Lock className="size-4" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
          />

          <Button type="submit" className="mt-1 h-10 w-full" disabled={loading}>
            {loading ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      <SuccessMessage
        open={successOpen}
        onClose={handleSuccessClose}
        title="Account created"
        message="Your workspace is ready. Continue to the dashboard."
      />
    </AuthShell>
  );
};

export default SignupView;
