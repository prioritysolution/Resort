"use client";

import { ListToolbar } from "@/components/shared";

type TravelAgentToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  loading: boolean;
  countLabel?: string;
};

const TravelAgentToolbar = ({
  search,
  setSearch,
  onAdd,
  onRefresh,
  loading,
  countLabel,
}: TravelAgentToolbarProps) => {
  return (
    <ListToolbar
      search={search}
      setSearch={setSearch}
      searchPlaceholder="Search agent, org, contact…"
      onAdd={onAdd}
      onRefresh={onRefresh}
      loading={loading}
      addLabel="Add travel agent"
      countLabel={countLabel}
    />
  );
};

export default TravelAgentToolbar;
