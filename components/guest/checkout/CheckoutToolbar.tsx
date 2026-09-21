"use client";

import { ListToolbar } from "@/components/shared";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  count: number;
};

export default function CheckoutToolbar(props: Props) {
  return (
    <ListToolbar
      search={props.search}
      setSearch={props.setSearch}
      searchPlaceholder="Filter by reservation number…"
      onAdd={props.onAdd}
      onRefresh={props.onRefresh}
      loading={props.loading}
      addLabel="Add checkout"
      countLabel={`${props.count} checkouts`}
    />
  );
}
