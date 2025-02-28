export const ROUTES = {
  HOME: '/',
  RESUME: '/interview/resume',
  ROLE: '/interview/role',
  CALL: '/interview/call',
  REVIEW: '/interview/review',
};

export const FLOW_STEPS = {
  HOME: ROUTES.HOME,
  RESUME: ROUTES.RESUME,
  ROLE: ROUTES.ROLE,
  CALL: ROUTES.CALL,
  REVIEW: ROUTES.REVIEW,
} as const;

export const REQUIRED_ORDER = [
  FLOW_STEPS.HOME,
  FLOW_STEPS.RESUME,
  FLOW_STEPS.ROLE,
  FLOW_STEPS.CALL,
  FLOW_STEPS.REVIEW,
];
