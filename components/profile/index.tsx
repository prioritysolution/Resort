"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputField from "@/common/formFields/InputField";
import { preventEnterSubmit } from "@/common/formFields/preventEnterSubmit";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import {
  PageHeader,
  PageLoader,
  PageSection,
  PageShell,
  PageShellContent,
} from "@/components/shared";
import type { ProfileFormValues } from "@/container/profile/types";

type ProfileViewProps = {
  form: UseFormReturn<ProfileFormValues>;
  loading: boolean;
  successOpen: boolean;
  setSuccessOpen: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (values: ProfileFormValues) => void | Promise<void>;
};

const ProfileView = ({
  form,
  loading,
  successOpen,
  setSuccessOpen,
  handleSubmit,
}: ProfileViewProps) => {
  return (
    <PageShell className="h-full">
      <PageHeader
        title="Profile"
        description="Update your account details for this workspace."
      />

      <PageShellContent>
        <Form {...form}>
          <form
            onKeyDown={preventEnterSubmit}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col gap-4"
            autoComplete="off"
          >
            <PageSection title="Account details">
              <div className="grid w-full grid-cols-1 gap-x-10 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
                <InputField
                  control={form.control}
                  name="fullName"
                  label="Full name"
                  isRequired
                />
                <InputField
                  control={form.control}
                  name="orgName"
                  label="Organisation"
                  isRequired
                />
                <InputField
                  control={form.control}
                  name="email"
                  label="Email / login"
                  disabled
                />
              </div>
            </PageSection>

            <Button
              type="submit"
              className="h-10 w-full self-end rounded-[0.625rem] sm:w-1/5"
              disabled={loading}
            >
              {loading ? (
                <PageLoader variant="button" light className="!min-h-0 !w-auto !p-0" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </PageShellContent>

      <SuccessMessage
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Saved"
        message="Your profile details were updated."
      />
    </PageShell>
  );
};

export default ProfileView;
