
'use client';
import { issues } from '@/lib/data';
import type { IssueCategory } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useMemo } from 'react';

const categoryColors: Record<IssueCategory, string> = {
  'Pothole': 'hsl(var(--chart-1))',
  'Graffiti': 'hsl(var(--chart-2))',
  'Streetlight Outage': 'hsl(var(--chart-3))',
  'Waste Management': 'hsl(var(--chart-4))',
  'Damaged Sign': 'hsl(var(--chart-5))',
  'Water Leak': '#FF8042', // Example of a non-theme color
  'Other': '#FFBB28',
};


export function CategoryBreakdownChart() {

    const chartData = useMemo(() => {
        const categoryCounts = issues.reduce((acc, issue) => {
            acc[issue.category] = (acc[issue.category] || 0) + 1;
            return acc;
        }, {} as Record<IssueCategory, number>);

        return Object.entries(categoryCounts).map(([name, value]) => ({
            name: name as IssueCategory,
            value,
            fill: categoryColors[name as IssueCategory] || '#8884d8'
        }));
    }, []);
    
    const chartConfig = useMemo(() => {
        return chartData.reduce((acc, data) => {
            acc[data.name] = { label: data.name, color: data.fill };
            return acc;
        }, {} as any);
    }, [chartData]);


  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="name" />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          strokeWidth={5}
          labelLine={false}
          label={({
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180
            const radius = (innerRadius + (outerRadius - innerRadius) * 0.5)
            const x = (cy || 0) + radius * Math.cos(-midAngle * RADIAN)
            const y = (cy || 0) + radius * Math.sin(-midAngle * RADIAN)

            return (
              <text
                x={x}
                y={y}
                className="fill-muted-foreground text-xs"
                textAnchor={x > (cy || 0) ? "start" : "end"}
                dominantBaseline="central"
              >
                {chartData[index].name.split(' ')[0]} ({value})
              </text>
            )
          }}
        >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
         <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}

