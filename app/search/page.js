"use client";

import { Suspense } from "react";
import SearchClient from "@/components/Search/SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16 text-center text-sm text-subtext">
          Memuat pencarian...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
