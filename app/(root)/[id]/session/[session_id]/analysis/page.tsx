import SessionSummaryClient from '@/components/SessionSummaryClient';
import { getSession } from '@/lib/actions/session.action';

export default async function SessionSummaryPage({
  params,
}: Readonly<RouteParams>) {
  const { session_id } = await params;
  const result = await getSession({ sessionId: session_id });
  const session = result.data;

  return <SessionSummaryClient session={session} />;
}
