import EntriesLinks from "@/components/moleculs/EntriesLinks";
import React, { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <div>
      <EntriesLinks />
      {children}
    </div>
  );
}
