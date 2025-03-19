import RiskAnalysisDashboard from '@/components/dtsession/RiskAnalysisDashboard';
import { getPatient } from '@/lib/actions/patient.action';

export default async function AnalysisPage({ params }: Readonly<RouteParams>) {
  const { id } = await params;

  const patientResult = await getPatient({ id });

  if (!patientResult.data) {
    return;
  }

  return (
    <div className="container mx-auto py-8">
      <RiskAnalysisDashboard patient={patientResult.data} />
    </div>
  );
}
