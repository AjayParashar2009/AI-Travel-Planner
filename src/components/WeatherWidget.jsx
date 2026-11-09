import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";
import { motion } from "framer-motion";

// Visual Crossing gives string icons, so we map those
const getWeatherIcon = (iconString) => {
  if (!iconString) return <CloudSun className="text-gray-400" size={32} />;
  if (iconString.includes("clear"))
    return <Sun className="text-yellow-400" size={32} />;
  if (iconString.includes("partly-cloudy"))
    return <CloudSun className="text-yellow-200" size={32} />;
  if (iconString.includes("cloudy") || iconString.includes("overcast"))
    return <Cloud className="text-gray-400" size={32} />;
  if (iconString.includes("fog"))
    return <CloudFog className="text-gray-400" size={32} />;
  if (iconString.includes("rain") || iconString.includes("showers"))
    return <CloudRain className="text-blue-400" size={32} />;
  if (iconString.includes("snow"))
    return <Snowflake className="text-blue-200" size={32} />;
  if (iconString.includes("thunder"))
    return <CloudLightning className="text-purple-400" size={32} />;

  return <CloudSun className="text-gray-400" size={32} />;
};

export default function WeatherWidget({ weatherData }) {
  // weatherData is now the "days" array from Visual Crossing
  if (!weatherData || !Array.isArray(weatherData) || weatherData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 mb-8">
      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <Sun size={14} className="text-blue-500" />
        Weather Forecast
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {weatherData.map((day, index) => {
          // Convert "2026-11-09" to "Nov 9"
          const formattedDate = new Date(day.datetime).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            },
          );

          return (
            <motion.div
              key={day.datetime}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center min-w-[100px] p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {formattedDate}
              </p>

              <div className="mb-3">{getWeatherIcon(day.icon)}</div>

              <div className="text-center">
                <p className="text-sm font-black text-white">
                  {Math.round(day.tempmax)}°
                </p>
                <p className="text-[10px] font-bold text-gray-500">
                  {Math.round(day.tempmin)}°
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
