export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PATIENT: (id: string) => `/${id}`,

  SESSION: (id: string) => `/${id}/session`,
  SESSION_DETAIL: (patientId: string, sessionId: string) =>
    `/${patientId}/session/${sessionId}`,
  SESSION_ANALYSIS: (patientId: string, sessionId: string) =>
    `/${patientId}/session/${sessionId}/analysis`,

  DTSESSION: (patientId: string) => `/${patientId}/dtsession`,
  DTSESSION_DETAIL: (patientId: string, sessionId: string) =>
    `/${patientId}/dtsession/${sessionId}`,
  DTSESSION_ANALYSIS: (patientId: string) => `/${patientId}/dtsession/analysis`,

  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};
