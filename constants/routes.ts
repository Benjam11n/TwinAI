export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SESSION: '/session',
  DTSESSION: '/dtsession',
  DTSESSION_ANALYSIS: '/dtsession/analysis',
  PATIENT: (name: string) => `${name}`,

  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
};
