import type { Serie } from "../types/nivo";

export const chart1Data: Serie[] = [
  {
    id: "Water Usage",
    data: [
      { x: "April", y: 25 },
      { x: "May", y: 40 },
      { x: "June", y: 55 },
      { x: "July", y: 95 },
    ],
  },
  {
    id: "Baseline",
    data: [
      { x: "April", y: 55 },
      { x: "May", y: 58 },
      { x: "June", y: 62 },
      { x: "July", y: 60 },
    ],
  },
];

export const chart2Data: Serie[] = [
  {
    id: "Consumption",
    data: [
      { x: "April", y: 20 },
      { x: "May", y: 35 },
      { x: "June", y: 50 },
      { x: "July", y: 92 },
    ],
  },
  {
    id: "Average",
    data: [
      { x: "April", y: 50 },
      { x: "May", y: 52 },
      { x: "June", y: 58 },
      { x: "July", y: 55 },
    ],
  },
];

export const chart3Data: Serie[] = [
  {
    id: "Efficiency",
    data: [
      { x: "April", y: 22 },
      { x: "May", y: 48 },
      { x: "June", y: 65 },
      { x: "July", y: 88 },
    ],
  },
  {
    id: "Target",
    data: [
      { x: "April", y: 50 },
      { x: "May", y: 55 },
      { x: "June", y: 70 },
      { x: "July", y: 60 },
    ],
  },
];

export const chart4Data: Serie[] = [
  {
    id: "Flow Rate",
    data: [
      { x: "April", y: 18 },
      { x: "May", y: 42 },
      { x: "June", y: 58 },
      { x: "July", y: 85 },
    ],
  },
  {
    id: "Threshold",
    data: [
      { x: "April", y: 48 },
      { x: "May", y: 50 },
      { x: "June", y: 60 },
      { x: "July", y: 55 },
    ],
  },
];

export const allCharts = [
  { title: "Water Usage Overview", data: chart1Data },
  { title: "Consumption Trends", data: chart2Data },
  { title: "Efficiency Metrics", data: chart3Data },
  { title: "Flow Rate Analysis", data: chart4Data },
];
