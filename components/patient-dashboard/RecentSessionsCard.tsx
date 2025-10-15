import { FileText, Calendar, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ISessionDoc } from '@/database';

export function RecentSessionsCard({ pastSessions }: { pastSessions: ISessionDoc[] | undefined }) {
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
          {pastSessions &&
            pastSessions.map((session) => (
              <div key={session.id} className="flex flex-col space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 size-4 text-muted-foreground" />
                    <span className="font-medium">
                      {session?.date ? new Date(session.date).toLocaleDateString() : ''}
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

          <Button variant="outline" size="sm" className="w-full">
            View All Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
