import { useSimulatorStore } from "@/store/simulator-store";
import { useEffect, useState } from "react";

// TODO: When connecting to real AWS DynamoDB, replace the store with SWR or React Query
// polling `/api/nodes` every 3s.
export function useNodes() {
  const nodes = useSimulatorStore(state => state.nodes);
  
  // To avoid hydration mismatch if rendering on server, we can ensure we only return after mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    nodes: mounted ? nodes : [],
    isLoading: !mounted,
  };
}
