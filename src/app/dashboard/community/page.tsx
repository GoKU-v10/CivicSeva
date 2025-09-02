
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
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Info
} from "lucide-react";
import { format } from "date-fns";

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
            src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-74.0060%2C40.7128%5D%7D%2C%22properties%22%3A%7B%22marker-symbol%22%3A%22roadblock%22%2C%22marker-color%22%3A%22%23F5A623%22%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-73.9960%2C40.7228%5D%7D%2C%22properties%22%3A%7B%22marker-symbol%22%3A%22art-gallery%22%2C%22marker-color%22%3A%22%239B9B9B%22%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-74.0100%2C40.7060%5D%7D%2C%22properties%2_A%7B%22marker-symbol%22%3A%22circle%22%2C%22marker-color%22%3A%22%234A90E2%22%7D%7D%5D%7D)/-74.00,40.71,13,0/1200x800?access_token=pk.eyJ1IjoiZmVybmJ1ZGR5IiwiYSI6ImNseGo5eG53czAxemUybHFuMWE5enJpeDAifQ.e5jF13sAl5N3sM61s-b6Gw"
            fill
            alt="Interactive map showing community issues"
            className="object-cover"
            data-ai-hint="interactive map"
          />
          {/* Issue Popup Example */}
          <div className="absolute top-1/4 left-1/4 w-80">
            <Card className="shadow-2xl">
              <CardHeader className="p-0">
                <Image src="https://picsum.photos/seed/pothole/320/180" width={320} height={180} alt="Pothole" className="rounded-t-lg" data-ai-hint="pothole road" />
                <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="destructive"><AlertTriangle className="mr-1" />High Priority</Badge>
                    <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white"><Wrench className="mr-1" />In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold">Large pothole on main street</h3>
                <p className="text-xs text-muted-foreground mt-1">Updated {format(new Date(), "PPP")}</p>
                <div className="flex justify-between items-center mt-3">
                    <Button>
                        <ThumbsUp className="mr-2" />
                        Support (127)
                    </Button>
                    <div className="text-right">
                        <p className="text-sm font-semibold">Public Works Dept.</p>
                        <p className="text-xs text-muted-foreground">Category: Pothole</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
           <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent text-center">
             <div className="inline-block p-2 rounded-lg bg-background/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-2">
                    <Info className="text-primary size-5" />
                    <p className="font-semibold text-sm">Interactive Map Coming Soon</p>
                </div>
             </div>
           </div>
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
                      <span className="text-muted-foreground">34% (128)</span>
                  </div>
                  <Progress value={34} />
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Waste Management</span>
                      <span className="text-muted-foreground">25% (94)</span>
                  </div>
                  <Progress value={25} />
              </div>
              <div>
                  <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Graffiti</span>
                      <span className="text-muted-foreground">18% (68)</span>
                  </div>
                  <Progress value={18} />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="font-bold text-lg">376</p>
                    <p className="text-xs text-muted-foreground">Total Open</p>
                </div>
                 <div>
                    <p className="font-bold text-lg text-green-600">89%</p>
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
