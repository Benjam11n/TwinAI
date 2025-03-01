import PatientDashboard from '@/components/patient-dashboard/PatientDashboard';

const PatientPage = async ({ params }) => {
  const { patient } = await params;

  return <PatientDashboard patient={patient} />;
};

export default PatientPage;
