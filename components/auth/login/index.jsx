"use client";

import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputField from "@/common/formFields/InputField";
import AuthShell from "@/components/auth/AuthShell";

const LoginView = ({
  form,
  loading,
  showPassword,
  setShowPassword,
  handleSubmit,
}) => {
  const rememberMe = form.watch("rememberMe");

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your branch credentials to open the dashboard."
      footer={
        <p className="text-muted-foreground">
          New organisation?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
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
            name="email"
            label="Email"
            placeholder="you@bank.com"
            isRequired
            autoComplete="username"
            startContent={<Mail className="size-4" />}
          />

          <InputField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            isRequired
            autoComplete="current-password"
            startContent={<Lock className="size-4" />}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={Boolean(rememberMe)}
                onCheckedChange={(checked) =>
                  form.setValue("rememberMe", Boolean(checked))
                }
              />
              <Label htmlFor="rememberMe" className="cursor-pointer font-normal">
                Remember me
              </Label>
            </div>
            <span className="text-xs text-muted-foreground">Forgot password?</span>
          </div>

          <Button type="submit" className="mt-1 h-10 w-full" disabled={loading}>
            {loading ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-5 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
        Demo access: <span className="font-medium text-foreground">demo@innap.com</span> /{" "}
        <span className="font-medium text-foreground">Demo@123</span>
      </div>
    </AuthShell>
  );
};

export default LoginView;
