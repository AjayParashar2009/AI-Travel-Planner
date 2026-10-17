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

// Map Open-Meteo WMO codes to Lucide icons
const getWeatherIcon = (code) => {
  if (code === 0) return <Sun className="text-yellow-400" size={32} />; // Clear sky
  if (code === 1 || code === 2) return <CloudSun className="text-yellow-200" size={32} />; // Mainly clear, partly cloudy
  if (code === 3) return <Cloud className="text-gray-400" size={32} />; // Overcast
  if (code === 45 || code === 48) return <CloudFog className="text-gray-400" size={32} />; // Fog
  if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={32} />; // Rain / Drizzle
  if (code >= 71 && code <= 77) return <Snowflake className="text-blue-200" size={32} />; // Snow
  if (code >= 80 && code <= 82) return <CloudRain className="text-blue-500" size={32} />; // Rain showers
  if (code >= 95 && code <= 99) return <CloudLightning className="text-purple-400" size={32} />; // Thunderstorm
  
  return <CloudSun className="text-gray-400" size={32} />; // Default
};

export default function WeatherWidget({ weatherData }) {
  // If no weather data (e.g., trip is >15 days away), don't show anything
  if (!weatherData || !weatherData.time || weatherData.time.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 mb-8">
      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <Sun size={14} className="text-blue-500" />
        Weather Forecast
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {weatherData.time.map((date, index) => {
          const maxTemp = weatherData.temperature_2m_max[index];
          const minTemp = weatherData.temperature_2m_min[index];
          const code = weatherData.weathercode[index];
          
          // Format date from "2026-10-20" to "Oct 20"
          const formattedDate = new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center min-w-[100px] p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {formattedDate}
              </p>
              
              <div className="mb-3">
                {getWeatherIcon(code)}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-black text-white">
                  {Math.round(maxTemp)}°
                </p>
                <p className="text-[10px] font-bold text-gray-500">
                  {Math.round(minTemp)}°
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}