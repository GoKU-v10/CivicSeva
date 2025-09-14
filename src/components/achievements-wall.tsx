
'use client';

import { Award, ShieldCheck, Star, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

const achievements = [
    {
        icon: ShieldCheck,
        title: "First Report",
        description: "You submitted your first issue.",
        unlocked: true,
    },
    {
        icon: Star,
        title: "Community Voice",
        description: "Your report received 10+ upvotes.",
        unlocked: true,
    },
    {
        icon: Award,
        title: "Resolution Champion",
        description: "You've had 5 issues resolved.",
        unlocked: false,
    },
    {
        icon: Users,
        title: "Neighborhood Watch",
        description: "Reported issues in 3 different categories.",
        unlocked: true,
    }
];

// Dummy data for impact stats
const impactStats = {
    upvotes: 24,
    resolved: 3,
    benefitted: 150, // estimated
}

function AchievementBadge({ icon: Icon, title, description, unlocked }: typeof achievements[0]) {
    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center text-center p-4 aspect-square rounded-lg transition-all duration-300 transform group",
            unlocked 
                ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                : "bg-muted text-muted-foreground grayscale"
        )}>
            <Icon className="size-8 sm:size-10 drop-shadow-md" />
            <h4 className="font-bold text-xs sm:text-sm mt-2">{title}</h4>
            <div className="absolute inset-0 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-xs text-center text-white">{description}</p>
            </div>
        </div>
    )
}

export function AchievementsWall() {
    return (
        <div>
            <h2 className="text-2xl font-bold">Achievements & Impact</h2>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>My Contributions</CardTitle>
                    <CardDescription>Digital badges earned for your valuable contributions to the community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {achievements.map((ach, i) => (
                            <AchievementBadge key={i} {...ach} />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                        <div>
                            <p className="font-bold text-lg">{impactStats.upvotes}</p>
                            <p className="text-xs text-muted-foreground">Community Upvotes</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-primary">{impactStats.resolved}</p>
                            <p className="text-xs text-muted-foreground">Issues Resolved</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{`~${impactStats.benefitted}`}</p>
                            <p className="text-xs text-muted-foreground">People Benefitted</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
