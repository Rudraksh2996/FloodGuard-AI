import { useEffect, useState } from "react";
import { useSimulatorStore, WeatherData } from "@/store/simulator-store";

export function useWeather() {
  const { updateWeatherData, liveMode } = useSimulatorStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchWeather = async () => {
      if (!liveMode) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) {
          throw new Error("Weather API failed");
        }
        const json = await res.json();
        if (json.success && json.data) {
          updateWeatherData(json.data);
          setError(null);
        } else {
          throw new Error(json.error || "Failed to parse weather");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // We let the UI fallback to simulator or just show error state
      } finally {
        setLoading(false);
        // Poll every 5 minutes
        timeoutId = setTimeout(fetchWeather, 5 * 60 * 1000);
      }
    };

    fetchWeather();

    return () => clearTimeout(timeoutId);
  }, [liveMode, updateWeatherData]);

  return { loading, error };
}
