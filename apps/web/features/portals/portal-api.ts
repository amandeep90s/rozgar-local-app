import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  employerProfileResponseSchema,
  employerProfileUpdateSchema,
  employerVerificationResponseSchema,
  jobSeekerProfileResponseSchema,
  jobSeekerProfileUpdateSchema,
  jobSeekerSkillsResponseSchema,
  type EmployerProfileUpdate,
  type JobSeekerProfileUpdate,
} from '@repo/contracts';
import { authApiFetch } from '@/lib/auth-api';
import { accessCookie } from '@/features/auth/session-cookies';

export class PortalApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'PortalApiError';
  }
}

async function request<T extends z.ZodType>(path: string, schema: T, init: RequestInit = {}) {
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) throw new PortalApiError(401, 'Your session has expired. Sign in again.');
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try {
    response = await authApiFetch(path, { ...init, headers, cache: 'no-store' });
  } catch (error) {
    console.error('Portal API request failed', error);
    throw new PortalApiError(0, 'The service is temporarily unavailable. Please try again.');
  }
  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Your session has expired. Sign in again.'
        : response.status === 403
          ? 'This workspace is not available for your account.'
          : 'The service is temporarily unavailable. Please try again.';
    throw new PortalApiError(response.status, message);
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    console.error('Portal API returned invalid JSON', error);
    throw new PortalApiError(502, 'The service returned an invalid response.');
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    console.error(`Portal API response did not match its contract: ${path}`);
    throw new PortalApiError(502, 'The service returned an invalid response.');
  }
  return parsed.data;
}

export const getEmployerProfile = () => request('/employers/me', employerProfileResponseSchema);
export const getEmployerVerification = () =>
  request('/employers/me/verification', employerVerificationResponseSchema);
export const saveEmployerProfile = (body: EmployerProfileUpdate) =>
  request('/employers/me', employerProfileResponseSchema, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
export const completeEmployerProfile = () =>
  request('/employers/me/complete', employerProfileResponseSchema, { method: 'POST' });
export const getJobSeekerProfile = () =>
  request('/job-seeker/profile', jobSeekerProfileResponseSchema);
export const saveJobSeekerProfile = (body: JobSeekerProfileUpdate) =>
  request('/job-seeker/profile', jobSeekerProfileResponseSchema, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
export const completeJobSeekerProfile = () =>
  request('/job-seeker/profile/complete', jobSeekerProfileResponseSchema, { method: 'POST' });
export const listJobSeekerSkills = (search = '') => {
  const params = new URLSearchParams({ page: '1', pageSize: '100' });
  if (search.trim()) params.set('search', search.trim());
  return request(`/job-seeker/skills?${params}`, jobSeekerSkillsResponseSchema);
};

export const portalUpdateSchemas = {
  employer: employerProfileUpdateSchema,
  jobSeeker: jobSeekerProfileUpdateSchema,
};
