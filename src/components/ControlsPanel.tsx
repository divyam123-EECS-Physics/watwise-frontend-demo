import { useState } from "react";
import "./ControlsPanel.css";

interface ControlsPanelProps {
  loading?: boolean;
  onSubmit: (startDate: string, endDate: string, period: "14-day" | "30-day") => void;
  onDownload: (startDate: string, endDate: string, period: "14-day" | "30-day") => void;
}

export default function ControlsPanel({ loading, onSubmit, onDownload }: ControlsPanelProps) {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-10");
  const [period, setPeriod] = useState<"14-day" | "30-day">("14-day");

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    onSubmit(startDate, endDate, period);
  };

  const handleDownload = () => {
    if (!startDate || !endDate) return;
    onDownload(startDate, endDate, period);
  };

  return (
    <div className="controls">
      <div className="controls__dates">
        <label className="controls__date-field">
          <span className="controls__date-label">Start time (Date)</span>
          <input
            type="date"
            className="controls__date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="controls__date-field">
          <span className="controls__date-label">End time (Date)</span>
          <input
            type="date"
            className="controls__date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="controls__radios">
        <label className="controls__radio">
          <input
            type="radio"
            name="period"
            checked={period === "14-day"}
            onChange={() => setPeriod("14-day")}
          />
          <span>14-Day</span>
        </label>
        <label className="controls__radio">
          <input
            type="radio"
            name="period"
            checked={period === "30-day"}
            onChange={() => setPeriod("30-day")}
          />
          <span>30-Day</span>
        </label>
      </div>

      <div className="controls__actions">
        <button
          type="button"
          className="controls__btn controls__btn--submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
        <button
          type="button"
          className="controls__btn controls__btn--download"
          onClick={handleDownload}
          disabled={loading}
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
