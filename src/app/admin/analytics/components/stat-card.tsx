
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    trendValue: string;
    trendDirection: 'up' | 'down';
    unit?: string;
}

export function StatCard({ title, value, icon: Icon, trendValue, trendDirection, unit }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Animated count up
        const end = value;
        if (end === 0) return;
        const duration = 1500;
        const startTime = Date.now();

        const frame = () => {
            const now = Date.now();
            const time = Math.min(1, (now - startTime) / duration);
            const easedTime = 1 - Math.pow(1 - time, 3); // ease-out cubic
            const currentValue = easedTime * end;

            setDisplayValue(currentValue);

            if (time < 1) {
                requestAnimationFrame(frame);
            } else {
                 setDisplayValue(end);
            }
        };
        requestAnimationFrame(frame);
    }, [value]);

    const isInteger = Number.isInteger(value);

    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {isInteger ? Math.round(displayValue) : displayValue.toFixed(1)}
                    {unit && <span className="text-xl text-muted-foreground">{unit}</span>}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                    <span className={cn(
                        'flex items-center gap-1 mr-2',
                        trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                    )}>
                        {trendDirection === 'up' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {trendValue}
                    </span>
                </p>
            </CardContent>
        </Card>
    );
}
