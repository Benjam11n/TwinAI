import React from 'react';
import {
  Activity,
  BookOpen,
  Heart,
  Moon,
  Brain,
  ArrowRight,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample recent activities data
const activities = [
  {
    id: 1,
    title: 'Completed 15-minute meditation',
    description: 'Your calmness rating increased by 12%',
    icon: <Brain className="size-4" />,
    timestamp: '2 hours ago',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 2,
    title: 'Logged mood entry',
    description: 'Your mood has been stable for 5 days',
    icon: <Heart className="size-4" />,
    timestamp: 'Yesterday',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  },
  {
    id: 3,
    title: 'Completed sleep journal',
    description: 'Sleep quality improved to 87%',
    icon: <Moon className="size-4" />,
    timestamp: 'Yesterday',
    color:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  },
  {
    id: 4,
    title: 'Attended group therapy',
    description: 'Social connection score increased',
    icon: <UserCircle className="size-4" />,
    timestamp: '3 days ago',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 5,
    title: 'Completed CBT exercise',
    description: 'Cognitive restructuring progress: 68%',
    icon: <BookOpen className="size-4" />,
    timestamp: '4 days ago',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  {
    id: 6,
    title: 'Wellness check-in',
    description: 'Digital twin updated with new data',
    icon: <Activity className="size-4" />,
    timestamp: '1 week ago',
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className={`${activity.color} mr-4 mt-0.5 rounded-full p-2`}>
              {activity.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <span className="ml-2 text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full" size="sm">
        <span>View All Activity</span>
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}
