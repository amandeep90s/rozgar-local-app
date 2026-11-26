import { PortalOverview } from '@/features/portals/components/portal-overview';
import { getJobSeekerProfile } from '@/features/portals/portal-api';

export default async function JobSeekerDashboardPage() {
  const profile = await getJobSeekerProfile();
  return <PortalOverview role="job-seeker" profile={profile} />;
}
