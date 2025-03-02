import { getPatients } from '@/lib/actions/patient.action';
import ClientSidebar from './ClientSidebar';

export default async function ServerSidebar() {
  const patientResult = await getPatients();
  const patients = patientResult.data || [];

  return <ClientSidebar patients={patients} />;
}
