import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { FLOW_STEPS, REQUIRED_ORDER } from '@/constants/routes';

const UNRESTRICTED_PAGES = ['/about', '/contact', '/faq', '/terms'];

function getAllowedSteps(currentProgress: string[]): string[] {
  const lastCompletedStep = currentProgress[currentProgress.length - 1];
  const lastCompletedIndex = REQUIRED_ORDER.indexOf(lastCompletedStep);
  return REQUIRED_ORDER.slice(0, lastCompletedIndex + 2);
}

export async function middleware(request: NextRequest) {
  // Ignore non-page requests
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const targetPath = request.nextUrl.pathname;

  // Allow unrestricted access to specified pages
  if (UNRESTRICTED_PAGES.includes(targetPath)) {
    return NextResponse.next();
  }

  // Get and parse current navigation progress
  let currentProgress: string[];
  try {
    const progress = request.cookies.get('navigationProgress')?.value;
    currentProgress = progress ? JSON.parse(progress) : [FLOW_STEPS.HOME];
  } catch (error) {
    console.error('Error parsing progress:', error);
    currentProgress = [FLOW_STEPS.HOME];
  }

  // Always allow access to home
  if (targetPath === FLOW_STEPS.HOME) {
    const response = NextResponse.next();
    response.cookies.set(
      'navigationProgress',
      JSON.stringify([FLOW_STEPS.HOME])
    );
    return response;
  }

  // Get allowed steps based on current progress
  const allowedSteps = getAllowedSteps(currentProgress);

  // Check if the requested path is allowed
  if (!allowedSteps.includes(targetPath)) {
    const redirectTo =
      currentProgress[currentProgress.length - 1] || FLOW_STEPS.HOME;
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // If this is a new step in the flow, add it to progress
  if (!currentProgress.includes(targetPath)) {
    currentProgress.push(targetPath);
    const response = NextResponse.next();
    response.cookies.set('navigationProgress', JSON.stringify(currentProgress));
    return response;
  }

  return NextResponse.next();
}
