"use client";

import type { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared";
import MonthPicker from "@/common/formFields/MonthPicker";
import DropdownField from "@/common/formFields/DropdownField";
import RadioField from "@/common/formFields/RadioField";
import { COMMISSION_TYPE_OPTIONS } from "@/container/reports/shared/types";
import type { AgentCommissionReportFormValues } from "@/container/reports/agent-commission/types";

type Props = {
  form: UseFormReturn<AgentCommissionReportFormValues>;
  loading: boolean;
  agents: Array<{ Id: number; Name: string }>;
  onSubmit: (values: AgentCommissionReportFormValues) => void;
};

export default function AgentCommissionToolbar({
  form,
  loading,
  agents,
  onSubmit,
}: Props) {
  const commissionType = form.watch("commission_type");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <RadioField
          control={form.control}
          name="commission_type"
          label="Commission type"
          options={[...COMMISSION_TYPE_OPTIONS]}
          numeric={false}
          formItemClassName="sm:col-span-2 lg:col-span-4"
        />
        <MonthPicker
          control={form.control}
          name="month"
          label="Month"
          placeholder="Select month"
          isRequired
        />
        {commissionType === "agent" ? (
          <DropdownField
            control={form.control}
            name="agent_id"
            label="Travel agent"
            options={agents}
            optionLabelKey="Name"
            isRequired
          />
        ) : null}
        <div className="flex items-end">
          <Button type="submit" className="h-10 w-full sm:w-auto" disabled={loading}>
            {loading ? <PageLoader variant="button" light /> : "Run report"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
