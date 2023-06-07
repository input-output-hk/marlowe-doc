import React from "react";
import { MatomoContext } from "@site/src/context/MatomoContext";

export default function Root({ children }) {
  return (
    <MatomoContext>
      {children}
    </MatomoContext>
  );
}
