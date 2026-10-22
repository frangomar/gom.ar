"use client";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes } from "react";
import type { TrackEvent } from "./Reveal";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: TrackEvent;
};

// <a> que registra un evento custom de Vercel Analytics al hacer clic.
export default function TrackedLink({ event, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event);
        onClick?.(e);
      }}
    />
  );
}
