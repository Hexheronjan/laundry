"use client";

import dynamic from "next/dynamic";
import type { ChartPoint } from "./RevenueChart";

const RevenueChart = dynamic(() => import("./RevenueChart"), { ssr: false, loading: () => <div className="skeleton h-72 w-full rounded-xl" /> });

export function ChartLoader({ data }: { data: ChartPoint[] }) {
  return <RevenueChart data={data} />;
}
