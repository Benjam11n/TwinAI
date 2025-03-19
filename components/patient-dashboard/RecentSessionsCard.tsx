import { FileText, Calendar, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ISessionDoc } from '@/database';
import { Button } from '../ui/button';

interface RecentSessionsCardProps {
  pastSessions?: ISessionDoc[];
  limit?: number;
}

export function RecentSessionsCard({
  pastSessions,
  limit = 5,
}: Readonly<RecentSessionsCardProps>) {
  const recentSessions = pastSessions
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ?.slice(0, limit);

  const totalSessions = pastSessions?.length ?? 0;
  const hasMoreSessions = totalSessions > limit;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="mr-2 size-5 text-muted-foreground" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSessions?.map((session) => (
            <div
              key={session._id as string}
              className="flex flex-col space-y-2 rounded-md border p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 size-4 text-muted-foreground" />
                  <span className="font-medium">
                    {session.date
                      ? new Date(session.date).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Download className="mr-1 size-3" />
                  <span className="text-xs">PDF</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <ExternalLink className="mr-1 size-3" />
                  <span className="text-xs">View</span>
                </Button>
              </div>
            </div>
          ))}

          {hasMoreSessions && (
            <Button variant="outline" size="sm" className="w-full">
              View All Sessions ({totalSessions})
            </Button>
          )}

          {!hasMoreSessions && totalSessions > 0 && (
            <Button variant="outline" size="sm" className="w-full">
              Manage Sessions
            </Button>
          )}

          {totalSessions === 0 && (
            <div className="py-2 text-center text-muted-foreground">
              No sessions available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
