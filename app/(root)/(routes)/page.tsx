"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

export default function Root() {
  console.log("rendring Home");

  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);
  // onOpen();

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return null;
}
