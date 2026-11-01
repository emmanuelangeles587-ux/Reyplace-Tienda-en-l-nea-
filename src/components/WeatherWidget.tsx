import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Wind, Thermometer, MapPin, Sparkles } from 'lucide-react';

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  recommendation: string;
}

export const WeatherWidget: React.FC = () => {
  const [weather] = useState<WeatherData>({
    location: 'Los Mochis, SIN',
    temp: 27,
    condition: 'Soleado & Cálido',
    humidity: 48,
    recommendation: 'Recomendado: Cámaras PTZ 4K con protección solar IP67',
  });

  return (
    <div className="hidden xl:flex items-center gap-3 neo-inset px-3.5 py-1.5 rounded-2xl text-xs font-medium text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-1.5 text-amber-500">
        <Sun className="w-4 h-4 animate-spin-slow" />
        <span className="font-bold font-mono-num">{weather.temp}°C</span>
      </div>
      <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700" />
      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
        <span>{weather.location}</span>
      </div>
      <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700" />
      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={weather.recommendation}>
        {weather.condition}
      </span>
    </div>
  );
};
