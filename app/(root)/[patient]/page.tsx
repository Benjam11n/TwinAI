import PatientDashboard from '@/components/PatientDashboard';

const PatientPage = async ({ params }) => {
  const { patient } = await params;

  return <PatientDashboard patient={patient} />;
};

export default PatientPage;
