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

export default function BookingToolbar(props: Props) {
  return (
    <ListToolbar
      search={props.search}
      setSearch={props.setSearch}
      searchPlaceholder="Filter by guest or booking…"
      onAdd={props.onAdd}
      onRefresh={props.onRefresh}
      loading={props.loading}
      addLabel="Add booking"
      countLabel={`${props.count} bookings`}
    />
  );
}
