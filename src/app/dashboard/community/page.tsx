
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  MapPin,
  Filter,
  Search,
  Calendar as CalendarIcon,
  BarChart2,
  List,
  Trophy,
} from "lucide-react";
import { issues } from "@/lib/data";


const recentActivities = [
    { user: 'Anonymous', action: 'supported', issue: 'Large pothole on main street', time: '5m ago', avatar: 'https://picsum.photos/seed/user1/40/40' },
    { user: 'Anonymous', action: 'commented on', issue: 'Graffiti on park wall', time: '12m ago', avatar: 'https://picsum.photos/seed/user2/40/40' },
    { user: 'Anonymous', action: 'reported a new issue', issue: 'Broken park bench', time: '30m ago', avatar: 'https://picsum.photos/seed/user3/40/40' },
    { user: 'City Official', action: 'updated status of', issue: 'Damaged Stop Sign', time: '1h ago', avatar: 'https://picsum.photos/seed/official/40/40' },
]

const leaderboard = [
    { rank: 1, area: 'Downtown', score: 98.2, avatar: 'https://picsum.photos/seed/area1/40/40' },
    { rank: 2, area: 'North End', score: 95.7, avatar: 'https://picsum.photos/seed/area2/40/40' },
    { rank: 3, area: 'West Side', score: 92.1, avatar: 'https://picsum.photos/seed/area3/40/40' },
]


export default function CommunityHubPage() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Map Section */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin />
              Community Issues Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by location..." className="pl-8" />
              </div>
              <Select defaultValue="all-categories">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="graffiti">Graffiti</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-statuses">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="range" numberOfMonths={2} />
                </PopoverContent>
              </Popover>
              <Button>
                <Filter className="mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="relative flex-grow rounded-lg overflow-hidden">
          <Image 
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+29abe2(-74.0060,40.7128),pin-s+29abe2(-73.9650,40.7739),pin-s+29abe2(-74.0090,40.7088)/-73.98,40.75,12/1000x600?access_token=pk.eyJ1IjoiZ29vZ2xlLWZpcmViYXNlIiwiYSI6ImNsc3ZlZ3AwbjB2dG4yanA2bXR4d3kya3QifQ.5h3L2H-p2bW40h2cM5y4fA"
              alt="Map of community issues"
              fill
              className="object-cover"
              data-ai-hint="map issues"
          />
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex flex-col gap-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart2 />
                Area Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Potholes</span>
                      <span className="text-muted-foreground">34% ({issues.filter(i => i.category === 'Pothole').length})</span>
                  </div>
                  <Progress value={34} />
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Waste Management</span>
                      <span className="text-muted-foreground">25% ({issues.filter(i => i.category === 'Waste Management').length})</span>
                  </div>
                  <Progress value={25} />
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Graffiti</span>
                      <span className="text-muted-foreground">18% ({issues.filter(i => i.category === 'Graffiti').length})</span>
                  </div>
                  <Progress value={18} />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="font-bold text-lg">{issues.filter(i => i.status !== 'Resolved').length}</p>
                    <p className="text-xs text-muted-foreground">Total Open</p>
                </div>
                 <div>
                    <p className="font-bold text-lg text-green-600">{Math.round((issues.filter(i => i.status === 'Resolved').length / issues.length) * 100)}%</p>
                    <p className="text-xs text-muted-foreground">Resolution Rate</p>
                </div>
                 <div>
                    <p className="font-bold text-lg">2.8d</p>
                    <p className="text-xs text-muted-foreground">Avg. Fix Time</p>
                </div>
              </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <List />
                Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm">
                            <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-primary">{activity.issue}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                </div>
             ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy />
                Community Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((item) => (
                 <div key={item.rank} className="flex items-center gap-3">
                     <Avatar>
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.area.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">{item.area}</p>
                        <p className="text-xs text-muted-foreground">Resolution Score: {item.score}</p>
                    </div>
                    <div className="font-bold text-lg text-primary">#{item.rank}</div>
                 </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
