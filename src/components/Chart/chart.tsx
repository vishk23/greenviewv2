import React from "react";
import { AxisOptions, Chart } from "react-charts";

interface DataPoint {
  primary: Date | number | string; // The x-axis value, can be Date, number, or string
  secondary: number; // The y-axis value, assumed to be a number
}

interface Series {
  label: string; // Series label for charting
  data: DataPoint[];
}

interface LineProps {
  data: Series[]; // The prop `data` will be an array of Series
}

export default function Line({ data }: LineProps) {
  // Memoize primary axis configuration
  const primaryAxis = React.useMemo<AxisOptions<DataPoint>>(
    () => ({
      getValue: (datum) => datum.primary, // Retrieve the `primary` value for x-axis
    }),
    []
  );

  // Memoize secondary axis configuration
  const secondaryAxes = React.useMemo<AxisOptions<DataPoint>[]>(
    () => [
      {
        getValue: (datum) => datum.secondary, // Retrieve the `secondary` value for y-axis
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data, // Pass the data prop to the Chart
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}
