"use client";

import { Suspense } from "react";
import ReaderClient from "@/components/Reader/ReaderClient";

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16 text-center text-sm text-subtext">
          Memuat reader...
        </div>
      }
    >
      <ReaderClient />
    </Suspense>
  );
}
