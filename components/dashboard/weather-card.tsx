"use client";
import React from "react";
import { useSimulatorStore } from "@/store/simulator-store";
import { useWeather } from "@/hooks/use-weather";
import { CloudRain, Wind, Droplets, Thermometer, AlertCircle } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

export const WeatherCard = () => {
  const { liveMode, weatherData } = useSimulatorStore();
  const { loading, error } = useWeather();

  if (!liveMode) return null;

  // Aggregate average weather for the city from the first node
  const cityWeather = Object.values(weatherData)[0];

  if (error) {
    return (
      <div className="absolute top-4 left-4 z-[400] bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur shadow-xl text-red-400 text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        {error} (Falling back to Simulator)
      </div>
    );
  }

  if (loading && !cityWeather) {
    return (
      <div className="absolute top-4 left-4 z-[400] w-64 h-32 bg-neutral-900/80 rounded-xl border border-white/10 animate-pulse backdrop-blur" />
    );
  }

  if (!cityWeather) return null;

  const sparklineData = cityWeather.next6hPrecipMm.map((val, i) => ({
    hour: `+${i}h`,
    rain: val
  }));

  return (
    <div className="absolute top-4 left-4 z-[400] bg-neutral-900/80 backdrop-blur border border-white/10 rounded-xl p-4 shadow-xl w-72 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm">Delhi NCR Weather</h3>
        <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span className="text-xl font-bold">{cityWeather.tempC}°</span>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-cyan-400" />
          <span className="text-sm">{cityWeather.rainMmH} mm/h</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-sm">{cityWeather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-neutral-400" />
          <span className="text-sm">{cityWeather.windKmh} km/h</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="flex justify-between items-end mb-1 text-xs text-neutral-400">
          <span>6-Hour Rain Forecast</span>
          <span className="text-[10px]">Max Prob: <span className="text-white">{cityWeather.precipProbMax}%</span></span>
        </div>
        <div className="h-12 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <YAxis hide domain={['auto', 'auto']} />
              <Area 
                type="monotone" 
                dataKey="rain" 
                stroke="#06b6d4" 
                fill="#06b6d4" 
                fillOpacity={0.2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
