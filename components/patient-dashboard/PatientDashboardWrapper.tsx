'use client';

import { IPatientDoc, ISessionDoc, ITreatmentPlanDoc } from '@/database';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const PatientDashboard = dynamic(() => import('./PatientDashboard'), {
  ssr: false,
});

interface PatientDashboardWrapperProps {
  patient: IPatientDoc;
  treatmentPlans?: ITreatmentPlanDoc[];
  pastSessions?: ISessionDoc[];
}

export default function PatientDashboardWrapper({
  patient,
  treatmentPlans,
  pastSessions,
}: PatientDashboardWrapperProps) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <PatientDashboard
        patient={patient}
        treatmentPlans={treatmentPlans}
        pastSessions={pastSessions}
      />
    </Suspense>
  );
}
