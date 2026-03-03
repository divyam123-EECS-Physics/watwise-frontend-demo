import { useCallback, useRef, useState } from "react";
import type { Serie } from "@nivo/line";
import ChartCard from "./components/ChartCard";
import InfoCard from "./components/InfoCard";
import Sidebar from "./components/Sidebar";
import ControlsPanel from "./components/ControlsPanel";
import { fetchForecast } from "./data/api";
import type { ForecastResponse } from "./data/api";
import {
  buildChartSeries,
  buildPanelAggregates,
  buildWeatherAggregates,
} from "./data/transform";
import type { InfoCardData } from "./data/transform";
import "./App.css";

const MIN_SIDEBAR = 260;
const MAX_SIDEBAR = 600;
const DEFAULT_SIDEBAR = 340;

const EMPTY_CHARTS: { title: string; data: Serie[] }[] = [
  { title: "Panel 1 - E (kWh)", data: [] },
  { title: "Panel 1 - P (W)", data: [] },
  { title: "Panel 2 - E (kWh)", data: [] },
  { title: "Panel 2 - P (W)", data: [] },
];

const DEFAULT_PANEL_AGG: InfoCardData = {
  heading: "Panel Aggregates",
  items: [
    { label: "Panel 1 - E (kWh)", value: "—" },
    { label: "Panel 1 - P (W)", value: "—" },
    { label: "Panel 2 - E (kWh)", value: "—" },
    { label: "Panel 2 - P (W)", value: "—" },
  ],
};

const DEFAULT_WEATHER_AGG: InfoCardData = {
  heading: "Weather Aggregates",
  items: [
    { label: "Temperature Max", value: "—" },
    { label: "Relative Humidity Max", value: "—" },
    { label: "Wind Speed Max", value: "—" },
    { label: "Precipitation Max", value: "—" },
  ],
};

function responseToCsv(resp: ForecastResponse): string {
  const varNames = Object.keys(resp.variables);
  const headers = ["time"];
  for (const v of varNames) {
    headers.push(`${v}_p0`, `${v}_p50`, `${v}_p100`);
  }
  const rows = [headers.join(",")];
  for (let i = 0; i < resp.time.length; i++) {
    const row = [resp.time[i]];
    for (const v of varNames) {
      const d = resp.variables[v];
      row.push(String(d.p0[i]), String(d.p50[i]), String(d.p100[i]));
    }
    rows.push(row.join(","));
  }
  return rows.join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const [charts, setCharts] = useState(EMPTY_CHARTS);
  const [panelAgg, setPanelAgg] = useState(DEFAULT_PANEL_AGG);
  const [weatherAgg, setWeatherAgg] = useState(DEFAULT_WEATHER_AGG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastResp = useRef<ForecastResponse | null>(null);

  const dragging = useRef(false);
  const contentRef = useRef<HTMLElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current || !contentRef.current) return;
      const contentRect = contentRef.current.getBoundingClientRect();
      const newSidebarWidth = contentRect.right - moveEvent.clientX;
      setSidebarWidth(Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, newSidebarWidth)));
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleSubmit = useCallback(async (startDate: string, endDate: string, period: "14-day" | "30-day") => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchForecast({
        start_time: `${startDate}T00:00:00`,
        end_time: `${endDate}T23:00:00`,
        time_period: period,
      });
      lastResp.current = resp;
      setCharts(buildChartSeries(resp));
      setPanelAgg(buildPanelAggregates(resp));
      setWeatherAgg(buildWeatherAggregates(resp));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async (startDate: string, endDate: string, period: "14-day" | "30-day") => {
    if (lastResp.current) {
      downloadCsv(responseToCsv(lastResp.current), `forecast_${startDate}_${endDate}.csv`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchForecast({
        start_time: `${startDate}T00:00:00`,
        end_time: `${endDate}T23:00:00`,
        time_period: period,
      });
      lastResp.current = resp;
      setCharts(buildChartSeries(resp));
      setPanelAgg(buildPanelAggregates(resp));
      setWeatherAgg(buildWeatherAggregates(resp));
      downloadCsv(responseToCsv(resp), `forecast_${startDate}_${endDate}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">WatWise Dashboard</h1>
        {error && <p className="dashboard__error">{error}</p>}
      </header>

      <main
        className="dashboard__content"
        ref={contentRef}
        style={{ gridTemplateColumns: `1fr 6px ${sidebarWidth}px` }}
      >
        <section className="dashboard__left">
          <div className="dashboard__info-row">
            <InfoCard heading={panelAgg.heading} items={panelAgg.items} />
            <InfoCard heading={weatherAgg.heading} items={weatherAgg.items} />
          </div>

          <div className="dashboard__charts">
            {charts.map((chart) => (
              <ChartCard key={chart.title} title={chart.title} data={chart.data} />
            ))}
          </div>
        </section>

        <div className="dashboard__divider" onMouseDown={onMouseDown}>
          <div className="dashboard__divider-line" />
        </div>

        <section className="dashboard__right">
          <Sidebar />
          <ControlsPanel
            loading={loading}
            onSubmit={handleSubmit}
            onDownload={handleDownload}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
