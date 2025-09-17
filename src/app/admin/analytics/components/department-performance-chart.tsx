
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const data = [
  { name: 'Public Works', avgTime: 4.5, totalIssues: 45 },
  { name: 'Sanitation', avgTime: 2.1, totalIssues: 30 },
  { name: 'Transportation', avgTime: 3.8, totalIssues: 55 },
  { name: 'Parks & Rec', avgTime: 5.2, totalIssues: 20 },
  { name: 'Water Dept.', avgTime: 6.1, totalIssues: 15 },
];

const chartConfig = {
    totalIssues: {
        label: "Total Issues",
        color: "hsl(var(--chart-1))",
    },
    avgTime: {
        label: "Avg. Resolution (Days)",
        color: "hsl(var(--chart-2))",
    }
}

export function DepartmentPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <BarChart 
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
        >
        <CartesianGrid horizontal={false} />
        <YAxis 
            dataKey="name" 
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
        />
        <XAxis type="number" hide />
        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="totalIssues" fill="var(--color-totalIssues)" radius={4} />
        <Bar dataKey="avgTime" fill="var(--color-avgTime)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
