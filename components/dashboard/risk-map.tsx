import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-900 animate-pulse rounded-xl border border-white/10 flex items-center justify-center text-neutral-500">Loading Map...</div>
});

export const RiskMap = () => {
  return <MapInner />;
};
