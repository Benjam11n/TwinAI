"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from '@/components/dashboard/overview';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  UserCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import Sidebar from '@/components/Sidebar';



export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  return (

    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
    <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center border-b bg-white px-4 dark:bg-gray-800 lg:px-6">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium md:hidden">
            <span className="sr-only">Toggle Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium">
              <span className="sr-only">Toggle theme</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <path d="M12 8a2.83 2.83 0 0 0 1.24-.24" />
                <path d="M12 8a2.83 2.83 0 0 0-1.24-.24" />
                <path d="M12 16a2.83 2.83 0 0 1 1.24.24" />
                <path d="M12 16a2.83 2.83 0 0 1-1.24.24" />
                <path d="m15 12 .93-.93" />
                <path d="M8.07 12.93 9 12" />
                <path d="m15 12-.93.93" />
                <path d="M8.07 11.07 9 12" />
                <path d="M12 9v.01" />
                <path d="M12 15v.01" />
                <path d="M12 12v.01" />
                <path d="M12 1v2" />
                <path d="M12 21v2" />
                <path d="M1 12h2" />
                <path d="M21 12h2" />
              </svg>
            </button>
            <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
              <img
                src="/api/placeholder/24/24"
                width="24"
                height="24"
                className="rounded-full"
                alt="User avatar"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  Download Report
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mental Wellbeing Score
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="size-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stress Level
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="size-4 text-muted-foreground"
                  >
                    <path d="M16 18V2M10 18V2M4 6v12M22 6v12" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Low</div>
                  <p className="text-xs text-muted-foreground">
                    -8% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sleep Quality
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="size-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Good</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recommended Sessions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="size-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Based on recent activity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Wellbeing Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your mental health activities this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentActivity />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Detailed Analytics</CardTitle>
                      <CardDescription>
                        Monthly breakdown of your mental health metrics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Comparison</CardTitle>
                      <CardDescription>
                        Compare your metrics with benchmark data.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        Comparison chart will appear here
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar & Appointments</CardTitle>
                    <CardDescription>
                      Schedule and view your therapy sessions and wellness
                      activities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalendarView />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Recommendations</CardTitle>
                    <CardDescription>
                      Based on your digital twin's analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Activity className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Mindfulness Practice</h3>
                          <p className="text-sm text-muted-foreground">
                            Your digital twin suggests 15 minutes of mindfulness
                            meditation in the evenings. This could reduce your
                            current stress levels by approximately 18%.
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <CalendarIcon className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Schedule Adjustment</h3>
                          <p className="text-sm text-muted-foreground">
                            Consider blocking 30-minute breaks between meetings
                            on Wednesdays. This pattern has shown to improve
                            your productivity and mental wellbeing.
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <UserCircle className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Social Connection</h3>
                          <p className="text-sm text-muted-foreground">
                            Your social engagement metrics have decreased by 15%
                            this month. Consider scheduling time with friends or
                            family this weekend.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
