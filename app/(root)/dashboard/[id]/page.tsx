import { getPatient } from '@/lib/actions/patient.action';
import { getPatientSessions } from '@/lib/actions/session.action';
import { getTreatmentPlans } from '@/lib/actions/treatment-plan.action';
import PatientDashboardWrapper from '@/components/patient-dashboard/PatientDashboardWrapper';

const PatientPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const patientResult = await getPatient({ id });
  const treatmentPlansResult = await getTreatmentPlans();
  const sessionsResult = await getPatientSessions({ id });

  if (!patientResult.data) {
    return <div>Patient not found</div>;
  }

  const treatmentPlans = treatmentPlansResult.data;
  const pastSessions = sessionsResult.data;

  return (
    <PatientDashboardWrapper
      patient={patientResult.data}
      treatmentPlans={treatmentPlans}
      pastSessions={pastSessions}
    />
  );
};

export default PatientPage;
