export const ROUTES = {
  HOME: '/',

  DASHBOARD: '/dashboard',
  PATIENT_DASHBOARD: (id: string) => `/dashboard/${id}`,

  SESSION: (id: string) => `/session/${id}`,
  SESSION_DETAIL: (patientId: string, sessionId: string) =>
    `/session/${patientId}/${sessionId}`,
  SESSION_ANALYSIS: (patientId: string, sessionId: string) =>
    `/session/${patientId}/${sessionId}/analysis`,

  DTSESSION: (id: string) => `/dtsession/${id}`,
  DTSESSION_DETAIL: (patientId: string) => `/dtsession/${patientId}`,
  DTSESSION_ANALYSIS: (patientId: string) => `/dtsession/${patientId}/analysis`,

  SIGN_IN: '/signin',
  SIGN_IN_WITH_OAUTH: '/signin-with-oauth',
};
