"use client";

import { useRoomType } from "@/container/org/roomType/Hooks";
import RoomTypeView from "@/components/org/roomType";

const RoomTypeContainer = () => {
  const roomType = useRoomType();
  return <RoomTypeView {...roomType} />;
};

export default RoomTypeContainer;
