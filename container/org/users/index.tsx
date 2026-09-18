"use client";

import { useUsers } from "@/container/org/users/Hooks";
import UsersView from "@/components/org/users";

const UsersContainer = () => {
  const users = useUsers();
  return <UsersView {...users} />;
};

export default UsersContainer;
