import Link from 'next/link';
import type { PublicJob } from '@repo/contracts';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ApplyToJob } from './apply-to-job';

export async function PublicJobDetail({
  job,
  isJobSeeker,
  isSignedIn,
}: {
  job: PublicJob;
  isJobSeeker: boolean;
  isSignedIn: boolean;
}) {
  const t = await getTranslations('PublicJobs.detail');
  const employment = t(`employmentTypes.${job.employmentType}`);
  const workMode = t(`workModes.${job.workMode}`);
  const salary = job.isSalaryNegotiable
    ? t('negotiable')
    : job.salaryMin || job.salaryMax
      ? `${job.salaryMin ?? '—'} – ${job.salaryMax ?? '—'} ${t(`salaryPeriods.${job.salaryPeriod}`)}`
      : t('notDisclosed');
  const location =
    [job.localityName, job.cityName, job.districtName, job.stateName].filter(Boolean).join(', ') ||
    t('locationUnspecified');

  return (
    <main className="container mx-auto w-full flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Link
        href="/jobs"
        className="group mb-5 inline-flex items-center gap-2 rounded-full border border-auth-border bg-auth-surface px-4 py-2 text-sm font-semibold text-auth-muted shadow-sm transition hover:border-auth-primary/25 hover:text-auth-primary"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        {t('backToJobs')}
      </Link>

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#123b2b] px-5 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-16 -z-10 size-96 rounded-full bg-emerald-300/15 blur-3xl"
        />
        <div className="flex flex-wrap items-center gap-2">
          {job.category && (
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              {job.category.name}
            </span>
          )}
          {job.isUrgent && (
            <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
              {t('urgent')}
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-4xl">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-2 font-medium text-white">
                <Building2 className="size-4 text-emerald-200" aria-hidden="true" />
                {job.employer.businessName ?? t('verifiedEmployer')}
                <BadgeCheck
                  className="size-4 text-emerald-200"
                  aria-label={t('verifiedEmployer')}
                />
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-emerald-200" aria-hidden="true" />
                {location}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <BriefcaseBusiness className="size-3.5 text-emerald-200" aria-hidden="true" />
              {employment}
            </span>
            <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              {workMode}
            </span>
          </div>
        </div>
      </section>

      <article className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <div className="space-y-5">
          <section className="rounded-3xl border border-auth-border/80 bg-auth-surface p-5 shadow-sm shadow-auth-foreground/[0.025] sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-auth-border/70 pb-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-auth-primary/8 text-auth-primary">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold tracking-tight">{t('description')}</h2>
                {job.responsibilities && (
                  <p className="mt-0.5 text-xs text-auth-muted">{t('responsibilities')}</p>
                )}
              </div>
            </div>
            <p className="text-sm leading-7 whitespace-pre-wrap text-auth-muted sm:text-[0.95rem]">
              {job.description}
            </p>
          </section>

          {job.responsibilities && (
            <section className="rounded-3xl border border-auth-border/80 bg-auth-surface p-5 shadow-sm shadow-auth-foreground/[0.025] sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight">{t('responsibilities')}</h2>
              <p className="mt-4 text-sm leading-7 whitespace-pre-wrap text-auth-muted sm:text-[0.95rem]">
                {job.responsibilities}
              </p>
            </section>
          )}

          {job.skills.length > 0 && (
            <section className="rounded-3xl border border-auth-border/80 bg-auth-surface p-5 shadow-sm shadow-auth-foreground/[0.025] sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight">{t('skills')}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-full border border-auth-primary/15 bg-auth-primary/5 px-3 py-1.5 text-xs font-semibold text-auth-primary"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-auth-border/80 bg-auth-surface p-5 shadow-lg shadow-auth-foreground/[0.04] sm:p-6 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-auth-canvas/70 p-4">
            <p className="text-xs font-semibold tracking-wide text-auth-muted uppercase">
              {t('salary')}
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-auth-foreground">
              {salary}
            </p>
          </div>
          <h2 className="mt-5 text-sm font-semibold tracking-tight">{t('jobDetails')}</h2>
          <dl className="mt-3 divide-y divide-auth-border/70 text-sm">
            <Detail label={t('employment')} value={employment} />
            <Detail label={t('workMode')} value={workMode} />
            <Detail label={t('experience')} value={t(`experienceLevels.${job.experienceLevel}`)} />
            <Detail
              label={t('openings')}
              value={String(job.openings)}
              icon={<Users aria-hidden="true" />}
            />
            {job.category && <Detail label={t('category')} value={job.category.name} />}
          </dl>
          {isJobSeeker ? (
            <div className="mt-5">
              <ApplyToJob jobId={job.id} />
            </div>
          ) : isSignedIn ? (
            <p className="mt-5 rounded-2xl border border-auth-border bg-auth-canvas/70 p-4 text-center text-sm leading-6 text-auth-muted">
              {t('jobSeekerAccountRequired')}
            </p>
          ) : (
            <Link
              href="/login"
              className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-auth-primary px-5 text-sm font-semibold text-auth-primary-foreground shadow-md shadow-auth-primary/15 transition hover:bg-auth-primary-hover"
            >
              {t('signInToApply')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </aside>
      </article>
    </main>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-auth-muted">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right font-medium text-auth-foreground">
        {icon && <span className="text-auth-primary [&_svg]:size-3.5">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
