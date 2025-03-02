import PatientDashboard from '@/components/patient-dashboard/PatientDashboard';
import { getPatient } from '@/lib/actions/patient.action';
import { getPatientSessions } from '@/lib/actions/session.action';
import { getTreatmentPlans } from '@/lib/actions/treatment-plan.action';

const PatientPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const patientResult = await getPatient({ id });
  const treatmentPlansResult = await getTreatmentPlans();
  const sessionsResult = await getPatientSessions({ id });

  if (!patientResult.data) {
    return;
  }

  const treatmentPlans = treatmentPlansResult.data;
  const pastSessions = sessionsResult.data;

  return (
    <PatientDashboard
      patient={patientResult.data}
      treatmentPlans={treatmentPlans}
      pastSessions={pastSessions}
    />
  );
};

export default PatientPage;
