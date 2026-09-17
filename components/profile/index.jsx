"use client";

import { ClipLoader } from "react-spinners";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputField from "@/common/formFields/InputField";
import SuccessMessage from "@/common/dialog/SuccessMessage";

const ProfileView = ({
  form,
  loading,
  successOpen,
  setSuccessOpen,
  handleSubmit,
}) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="font-display text-[1.875rem] font-semibold text-foreground max-lg:text-[1.5rem] max-md:text-[1.3rem]">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your account details for this workspace.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-4 rounded-[0.625rem] border border-border bg-card p-4 sm:p-5"
          autoComplete="off"
        >
          <h2 className="font-display text-center text-lg font-semibold text-foreground">
            Account details
          </h2>
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

          <Button
            type="submit"
            className="h-10 w-full self-end sm:w-1/5"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>

      <SuccessMessage
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Saved"
        message="Your profile details were updated."
      />
    </div>
  );
};

export default ProfileView;
