import PatientDashboard from '@/components/patient-dashboard/PatientDashboard';
import { getPatient } from '@/lib/actions/patient.action';
import { getTreatmentPlans } from '@/lib/actions/treatment-plan.action';

const PatientPage = async ({ params }: RouteParams) => {
  const { patient: patientId } = await params;

  const patientResult = await getPatient({ id: patientId });
  const treatmentPlansResult = await getTreatmentPlans();

  if (!patientResult.data) {
    return;
  }

  const treatmentPlans = treatmentPlansResult.data;

  return (
    <PatientDashboard
      patient={patientResult.data}
      treatmentPlans={treatmentPlans}
    />
  );
};

export default PatientPage;
