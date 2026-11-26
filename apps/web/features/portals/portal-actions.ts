'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { EmployerProfileUpdate, JobSeekerProfileUpdate } from '@repo/contracts';
import {
  completeEmployerProfile,
  completeJobSeekerProfile,
  getEmployerProfile,
  getJobSeekerProfile,
  listJobSeekerSkills,
  PortalApiError,
  portalUpdateSchemas,
  saveEmployerProfile,
  saveJobSeekerProfile,
} from './portal-api';

export type PortalActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function perform<T>(operation: () => Promise<T>): Promise<PortalActionResult<T>> {
  try {
    return { ok: true, data: await operation() };
  } catch (error) {
    if (error instanceof PortalApiError) return { ok: false, message: error.message };
    if (error instanceof Error) console.error('Portal action failed', error);
    return { ok: false, message: 'The request could not be completed. Please try again.' };
  }
}

export async function saveEmployerProfileAction(input: EmployerProfileUpdate) {
  const parsed = portalUpdateSchemas.employer.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? 'Check the submitted information.',
    };
  const result = await perform(() => saveEmployerProfile(parsed.data));
  if (result.ok) revalidatePath('/employer');
  return result;
}

export async function completeEmployerProfileAction() {
  const result = await perform(completeEmployerProfile);
  if (result.ok) revalidatePath('/employer');
  return result;
}

export async function saveJobSeekerProfileAction(input: JobSeekerProfileUpdate) {
  const parsed = portalUpdateSchemas.jobSeeker.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? 'Check the submitted information.',
    };
  const result = await perform(() => saveJobSeekerProfile(parsed.data));
  if (result.ok) revalidatePath('/job-seeker');
  return result;
}

export async function completeJobSeekerProfileAction() {
  const result = await perform(completeJobSeekerProfile);
  if (result.ok) revalidatePath('/job-seeker');
  return result;
}

export async function searchSkillsAction(input: string) {
  const query = z.string().trim().max(100).safeParse(input);
  if (!query.success)
    return { ok: false as const, message: 'Search must be 100 characters or fewer.' };
  return perform(() => listJobSeekerSkills(query.data));
}

export async function getWorkspacePathAction(): Promise<'/employer' | '/job-seeker' | '/'> {
  try {
    await getEmployerProfile();
    return '/employer';
  } catch (error) {
    if (!(error instanceof PortalApiError) || error.status !== 403) return '/';
  }
  try {
    await getJobSeekerProfile();
    return '/job-seeker';
  } catch {
    return '/';
  }
}
