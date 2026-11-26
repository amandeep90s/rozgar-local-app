import { BadgeCheck, Building2, Clock3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStatusBadge } from '@/features/admin/components/admin-primitives';
import { EmployerProfileForm } from '@/features/portals/components/employer-profile-form';
import { getEmployerProfile, getEmployerVerification } from '@/features/portals/portal-api';

export default async function EmployerProfilePage() {
  const [profile, verification] = await Promise.all([
    getEmployerProfile(),
    getEmployerVerification(),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl space-y-7">
      <header className="flex flex-col gap-4 border-b border-auth-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-auth-primary uppercase">
            <Building2 className="size-4" aria-hidden="true" /> Employer workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Business profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-auth-muted">
            Manage your organization details, contact preferences, and verification status.
          </p>
        </div>
        <AdminStatusBadge status={profile.completedAt ? 'COMPLETE' : 'IN PROGRESS'} />
      </header>
      <Card className="rounded-2xl border-auth-border bg-auth-surface shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-auth-primary/10 text-auth-primary">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-base">Verification status</CardTitle>
              <CardDescription className="mt-1">
                Your business verification progress.
              </CardDescription>
            </div>
          </div>
          <AdminStatusBadge status={verification.verificationStatus} />
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-auth-muted">
            <Clock3 className="size-4" aria-hidden="true" />
            Verification level:{' '}
            <span className="font-medium text-auth-foreground">
              {verification.verificationLevel}
            </span>
          </div>
          {verification.rejectionReason && (
            <p className="text-sm text-auth-muted">
              Reason: <span className="text-auth-foreground">{verification.rejectionReason}</span>
            </p>
          )}
          {verification.verificationNote && (
            <p className="text-sm text-auth-muted sm:col-span-2">
              Note: <span className="text-auth-foreground">{verification.verificationNote}</span>
            </p>
          )}
        </CardContent>
      </Card>
      <EmployerProfileForm profile={profile} />
    </div>
  );
}
