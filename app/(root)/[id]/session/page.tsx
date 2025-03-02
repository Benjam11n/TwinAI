import LiveTherapySession from '@/components/session/LiveTherapySession';
import { getPatient } from '@/lib/actions/patient.action';

const SessionPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const patientResult = await getPatient({ id });

  if (!patientResult.data) {
    return;
  }

  return <LiveTherapySession patient={patientResult.data} />;
};

export default SessionPage;
