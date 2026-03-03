import type { Serie } from "@nivo/line";
import type { ForecastResponse } from "./api";

const PANEL_VARS = [
  "Main Incomer Panel 1 - E (kWh)",
  "Main Incomer Panel 1 - P (W)",
  "Main Incomer Panel 2 - E (kWh)",
  "Main Incomer Panel 2 - P (W)",
] as const;

const WEATHER_VARS = [
  "T2M",
  "RH2M",
  "WS10M",
  "PRECTOTCORR",
] as const;

const WEATHER_LABELS: Record<string, string> = {
  T2M: "Temperature",
  RH2M: "Relative Humidity",
  WS10M: "Wind Speed",
  PRECTOTCORR: "Precipitation",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;
}

function downsample(times: string[], values: number[], maxPoints: number): { x: string; y: number }[] {
  if (times.length <= maxPoints) {
    return times.map((t, i) => ({ x: formatTime(t), y: values[i] }));
  }
  const step = Math.ceil(times.length / maxPoints);
  const result: { x: string; y: number }[] = [];
  for (let i = 0; i < times.length; i += step) {
    result.push({ x: formatTime(times[i]), y: values[i] });
  }
  if ((times.length - 1) % step !== 0) {
    const last = times.length - 1;
    result.push({ x: formatTime(times[last]), y: values[last] });
  }
  return result;
}

const MAX_CHART_POINTS = 60;

export function buildChartSeries(resp: ForecastResponse): { title: string; data: Serie[] }[] {
  return PANEL_VARS.map((varName) => {
    const v = resp.variables[varName];
    if (!v) return { title: varName, data: [] };

    return {
      title: varName,
      data: [
        { id: "p0 (Min)", data: downsample(resp.time, v.p0, MAX_CHART_POINTS) },
        { id: "p50 (Median)", data: downsample(resp.time, v.p50, MAX_CHART_POINTS) },
        { id: "p100 (Max)", data: downsample(resp.time, v.p100, MAX_CHART_POINTS) },
      ],
    };
  });
}

export interface InfoCardData {
  heading: string;
  items: { label: string; value: string }[];
}

export function buildPanelAggregates(resp: ForecastResponse): InfoCardData {
  const items = PANEL_VARS.map((varName) => {
    const v = resp.variables[varName];
    return {
      label: varName.replace("Main Incomer ", ""),
      value: v ? v.max.toFixed(2) : "—",
    };
  });
  return { heading: "Panel Aggregates", items };
}

export function buildWeatherAggregates(resp: ForecastResponse): InfoCardData {
  const items = WEATHER_VARS.map((varName) => {
    const v = resp.variables[varName];
    return {
      label: `${WEATHER_LABELS[varName]} Max`,
      value: v ? v.max.toFixed(2) : "—",
    };
  });
  return { heading: "Weather Aggregates", items };
}
