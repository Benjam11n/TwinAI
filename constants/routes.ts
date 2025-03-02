export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SESSION: (id: string) => `/${id}/session`,
  DTSESSION: (id: string) => `/${id}/dtsession`,
  DTSESSION_ANALYSIS: (id: string) => `/${id}/dtsession/analysis`,
  PATIENT: (id: string) => `/${id}`,

  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};
