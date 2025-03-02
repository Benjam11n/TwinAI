import Twin from '@/components/dtsession/Twin';
import { getPatient } from '@/lib/actions/patient.action';

const DTSessionPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const patientResult = await getPatient({ id });

  if (!patientResult.data) {
    return;
  }

  return <Twin patient={patientResult.data} />;
};

export default DTSessionPage;
