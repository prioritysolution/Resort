"use client";

import { useRoomDetails } from "@/container/org/roomDetails/Hooks";
import RoomDetailsView from "@/components/org/roomDetails";

const RoomDetailsContainer = () => {
  const roomDetails = useRoomDetails();
  return <RoomDetailsView {...roomDetails} />;
};

export default RoomDetailsContainer;
