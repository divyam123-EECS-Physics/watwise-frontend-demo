import { ResponsiveLine } from "@nivo/line";
import type { Serie } from "../types/nivo";
import "./ChartCard.css";

interface ChartCardProps {
  title: string;
  data: Serie[];
}

export default function ChartCard({ title, data }: ChartCardProps) {
  const hasData = data.length > 0 && data[0].data.length > 0;

  const tickInterval = hasData ? Math.max(1, Math.floor(data[0].data.length / 6)) : 1;
  const tickValues = hasData
    ? data[0].data.filter((_: { x: string | null; y: number | null }, i: number) => i % tickInterval === 0).map((d) => d.x as string)
    : undefined;

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      <div className="chart-card__body">
        {hasData ? (
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 20, bottom: 46, left: 52 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
            curve="monotoneX"
            colors={["#f59e0b", "#4f8ef7", "#ef4444"]}
            lineWidth={1.5}
            pointSize={0}
            enableGridX={false}
            enableArea={false}
            useMesh={true}
            enableSlices="x"
            theme={{
              text: { fill: "#7b8a9e", fontSize: 11 },
              grid: {
                line: { stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 },
              },
              axis: {
                ticks: {
                  text: { fill: "#7b8a9e", fontSize: 9 },
                  line: { stroke: "transparent" },
                },
                domain: { line: { stroke: "rgba(255,255,255,0.1)" } },
              },
              crosshair: { line: { stroke: "#4f8ef7", strokeWidth: 1 } },
              tooltip: {
                container: {
                  background: "#1a2540",
                  color: "#e0e6ed",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  fontSize: "11px",
                },
              },
            }}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: -35,
              tickValues,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              tickValues: 5,
            }}
            legends={[
              {
                anchor: "top-right",
                direction: "row",
                translateY: -8,
                itemWidth: 90,
                itemHeight: 14,
                itemTextColor: "#7b8a9e",
                symbolSize: 8,
                symbolShape: "circle",
              },
            ]}
          />
        ) : (
          <div className="chart-card__empty">No data — submit a query</div>
        )}
      </div>
    </div>
  );
}
