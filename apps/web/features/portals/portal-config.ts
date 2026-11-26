import { LayoutDashboard, UserRound } from 'lucide-react';

export type PortalRole = 'employer' | 'job-seeker';
export const portalNavItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'My profile', icon: UserRound },
] as const;
