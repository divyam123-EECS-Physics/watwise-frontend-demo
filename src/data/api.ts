const API_URL =
  "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-866b5eb3-c508-4028-ae5a-2cfa08dca155/default/forecast";

export interface VariableData {
  max: number;
  p0: number[];
  p50: number[];
  p100: number[];
}

export interface ForecastResponse {
  start_time: string;
  end_time: string;
  time: string[];
  variables: Record<string, VariableData>;
}

export interface ForecastRequest {
  start_time: string;
  end_time: string;
  time_period: "14-day" | "30-day";
}

export async function fetchForecast(req: ForecastRequest): Promise<ForecastResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
  return res.json();
}
