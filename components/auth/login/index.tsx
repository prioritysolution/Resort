"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputField from "@/common/formFields/InputField";
import AuthShell from "@/components/auth/AuthShell";
import { PageLoader } from "@/components/shared";
import type { LoginFormValues } from "@/container/auth/login/types";

type LoginViewProps = {
  form: UseFormReturn<LoginFormValues>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (values: LoginFormValues) => void | Promise<void>;
};

const LoginView = ({
  form,
  loading,
  showPassword,
  setShowPassword,
  handleSubmit,
}: LoginViewProps) => {
  const rememberMe = form.watch("rememberMe");

  return (
    <AuthShell
      title="Sign in your account"
      busy={loading}
      footer={
        <p>
          Use your resort API credentials to access the hotel dashboard.
        </p>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5 sm:gap-6"
          autoComplete="off"
        >
          <InputField
            control={form.control}
            name="user_code"
            label="User Code"
            placeholder=""
            isRequired
            autoComplete="off"
            className="h-11 rounded-[0.625rem] bg-muted/40 transition-all duration-200 ease-out sm:h-12"
            formItemClassName="gap-2"
          />

          <InputField
            control={form.control}
            name="password"
            label="Password"
            placeholder=""
            type={showPassword ? "text" : "password"}
            isRequired
            autoComplete="current-password"
            className="h-11 rounded-[0.625rem] bg-muted/40 transition-all duration-200 ease-out sm:h-12"
            formItemClassName="gap-2"
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
              </button>
            }
          />

          <div className="flex items-center gap-2.5 pt-0.5">
            <Checkbox
              id="rememberMe"
              checked={Boolean(rememberMe)}
              onCheckedChange={(checked) =>
                form.setValue("rememberMe", Boolean(checked))
              }
            />
            <Label
              htmlFor="rememberMe"
              className="cursor-pointer text-sm font-normal text-muted-foreground sm:text-[0.9375rem]"
            >
              Remember my preference
            </Label>
          </div>

          <div className="pt-2 sm:pt-3">
            <Button
              type="submit"
              className="h-11 w-full rounded-[0.625rem] text-[0.9375rem] font-medium transition-all duration-200 ease-out hover:bg-primary/90 active:scale-[0.99] sm:h-12"
              disabled={loading}
            >
              {loading ? (
                <PageLoader
                  variant="button"
                  light
                  className="!min-h-0 !w-auto !p-0"
                />
              ) : (
                "Sign Me In"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
};

export default LoginView;
