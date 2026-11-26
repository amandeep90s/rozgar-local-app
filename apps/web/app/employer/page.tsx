import { PortalOverview } from '@/features/portals/components/portal-overview';
import { getEmployerProfile } from '@/features/portals/portal-api';

export default async function EmployerDashboardPage() {
  const profile = await getEmployerProfile();
  return <PortalOverview role="employer" profile={profile} />;
}
