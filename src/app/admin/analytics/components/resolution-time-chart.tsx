
'use client';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useMemo } from 'react';

// Dummy data for monthly trends
const data = [
  { month: 'Feb', reported: 120, resolved: 90 },
  { month: 'Mar', reported: 150, resolved: 110 },
  { month: 'Apr', reported: 130, resolved: 140 },
  { month: 'May', reported: 180, resolved: 160 },
  { month: 'Jun', reported: 210, resolved: 180 },
  { month: 'Jul', reported: 190, resolved: 200 },
];

const chartConfig = {
    reported: {
        label: "Reported",
        color: "hsl(var(--chart-2))",
    },
    resolved: {
        label: "Resolved",
        color: "hsl(var(--chart-1))",
    }
}

export function ResolutionTimeChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
            dataKey="month" 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
        />
        <YAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
        />
        <Tooltip content={<ChartTooltipContent />} />
         <ChartLegend content={<ChartLegendContent />} />
        <Line 
            type="monotone" 
            dataKey="reported" 
            stroke="var(--color-reported)" 
            strokeWidth={2}
            dot={false}
        />
        <Line 
            type="monotone" 
            dataKey="resolved" 
            stroke="var(--color-resolved)" 
            strokeWidth={2}
            dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
