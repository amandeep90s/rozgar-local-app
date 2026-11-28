import Link from 'next/link';
import type { PublicJobListResponse } from '@repo/contracts';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { getTranslations } from 'next-intl/server';
import { JobSearchLocationFields } from './job-search-location-fields';

type Category = { id: string; name: string; slug: string };

export async function PublicJobSearch({
  initialResult,
  categories,
  currentQuery = '',
  initialStateName = '',
  initialCityName = '',
}: {
  initialResult: PublicJobListResponse;
  categories: Category[];
  currentQuery?: string;
  initialStateName?: string;
  initialCityName?: string;
}) {
  const t = await getTranslations('PublicJobs.search');
  const detailT = await getTranslations('PublicJobs.detail');
  const searchValues = new URLSearchParams(currentQuery);
  const nextParams = new URLSearchParams(currentQuery);
  nextParams.set('page', String(initialResult.pageInfo.page + 1));

  return (
    <main className="container mx-auto w-full flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#123b2b] px-5 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 -z-10 size-96 rounded-full bg-emerald-300/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 size-96 rounded-full bg-lime-200/10 blur-3xl"
        />
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {t('title')}
          </h1>
        </div>

        <form
          method="get"
          className="mt-7 rounded-3xl border border-white/60 bg-auth-surface p-4 text-auth-foreground shadow-2xl shadow-emerald-950/15 sm:p-5 lg:mt-9 lg:p-6"
        >
          <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-12">
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-5">
              <span className="text-xs font-semibold text-auth-muted">{t('keyword')}</span>
              <InputGroup className="h-11 rounded-xl border-auth-border bg-auth-canvas/50">
                <InputGroupInput
                  name="keyword"
                  placeholder={t('keywordPlaceholder')}
                  defaultValue={searchValues.get('keyword') ?? ''}
                  className="h-11 text-auth-foreground placeholder:text-auth-muted"
                />
                <InputGroupAddon className="text-auth-muted">
                  <Search className="size-4" aria-hidden="true" />
                </InputGroupAddon>
              </InputGroup>
            </label>
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-6 lg:col-span-4">
              <JobSearchLocationFields
                initialStateName={initialStateName}
                initialCityName={initialCityName}
              />
            </div>
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-3">
              <span className="text-xs font-semibold text-auth-muted">{t('employmentType')}</span>
              <NativeSelect
                name="employmentType"
                className="w-full **:data-[slot=native-select]:h-11 **:data-[slot=native-select]:rounded-xl **:data-[slot=native-select]:border-auth-border **:data-[slot=native-select]:bg-auth-canvas/50"
                defaultValue={searchValues.get('employmentType') ?? ''}
              >
                <NativeSelectOption value="">{t('anyEmploymentType')}</NativeSelectOption>
                {(
                  [
                    'FULL_TIME',
                    'PART_TIME',
                    'CONTRACT',
                    'TEMPORARY',
                    'DAILY_WAGE',
                    'APPRENTICESHIP',
                    'INTERNSHIP',
                    'FREELANCE',
                  ] as const
                ).map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {t(`employmentTypes.${value}`)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-4">
              <span className="text-xs font-semibold text-auth-muted">{t('category')}</span>
              <NativeSelect
                name="categoryId"
                className="w-full **:data-[slot=native-select]:h-11 **:data-[slot=native-select]:rounded-xl **:data-[slot=native-select]:border-auth-border **:data-[slot=native-select]:bg-auth-canvas/50"
                defaultValue={searchValues.get('categoryId') ?? ''}
              >
                <NativeSelectOption value="">{t('allCategories')}</NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption key={category.id} value={category.id}>
                    {category.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-2">
              <span className="text-xs font-semibold text-auth-muted">{t('minimumSalary')}</span>
              <Input
                name="salaryMin"
                type="number"
                min="0"
                placeholder={t('minimumSalary')}
                defaultValue={searchValues.get('salaryMin') ?? ''}
                className="h-11 rounded-xl border-auth-border bg-auth-canvas/50"
              />
            </label>
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-2">
              <span className="text-xs font-semibold text-auth-muted">{t('maximumSalary')}</span>
              <Input
                name="salaryMax"
                type="number"
                min="0"
                placeholder={t('maximumSalary')}
                defaultValue={searchValues.get('salaryMax') ?? ''}
                className="h-11 rounded-xl border-auth-border bg-auth-canvas/50"
              />
            </label>
            <label className="grid gap-1.5 md:col-span-3 lg:col-span-2">
              <span className="text-xs font-semibold text-auth-muted">{t('sort')}</span>
              <NativeSelect
                name="sort"
                className="w-full **:data-[slot=native-select]:h-11 **:data-[slot=native-select]:rounded-xl **:data-[slot=native-select]:border-auth-border **:data-[slot=native-select]:bg-auth-canvas/50"
                defaultValue={searchValues.get('sort') ?? 'NEWEST'}
              >
                {(['NEWEST', 'OLDEST', 'SALARY_LOW', 'SALARY_HIGH'] as const).map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {t(`sortOptions.${value}`)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
            <div className="flex items-end md:col-span-6 lg:col-span-2">
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-auth-primary text-auth-primary-foreground shadow-md shadow-auth-primary/15 hover:bg-auth-primary-hover"
              >
                <Search className="size-4" aria-hidden="true" />
                {t('search')}
              </Button>
            </div>
          </div>
        </form>
      </section>

      <section className="mt-8 sm:mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-auth-foreground sm:text-xl">
              {t('eyebrow')}
            </h2>
            <p className="mt-1 text-sm text-auth-muted">
              {t('page', {
                page: initialResult.pageInfo.page,
                totalPages: Math.max(
                  1,
                  Math.ceil(initialResult.pageInfo.total / initialResult.pageInfo.pageSize),
                ),
              })}
            </p>
          </div>
          {initialResult.items.length > 0 && (
            <span className="rounded-full border border-auth-border bg-auth-surface px-3 py-1.5 text-xs font-medium text-auth-muted">
              {t('resultsCount', { count: initialResult.pageInfo.total.toLocaleString() })}
            </span>
          )}
        </div>

        {initialResult.items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-auth-border bg-auth-surface px-6 py-16 text-center shadow-sm sm:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-auth-primary/8 text-auth-primary">
              <BriefcaseBusiness className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-semibold text-auth-foreground">{t('empty')}</p>
          </div>
        ) : (
          <ul className="grid gap-4 xl:grid-cols-2">
            {initialResult.items.map((job) => {
              const salary = job.isSalaryNegotiable
                ? detailT('negotiable')
                : job.salaryMin || job.salaryMax
                  ? `${job.salaryMin ?? '—'} – ${job.salaryMax ?? '—'} ${detailT(`salaryPeriods.${job.salaryPeriod}`)}`
                  : detailT('notDisclosed');
              return (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="group flex h-full flex-col rounded-3xl border border-auth-border/80 bg-auth-surface p-5 shadow-sm shadow-auth-foreground/2.5 transition duration-200 hover:-translate-y-0.5 hover:border-auth-primary/30 hover:shadow-xl hover:shadow-auth-primary/[0.07] sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-auth-primary/12 to-auth-primary/5 text-auth-primary ring-1 ring-auth-primary/10">
                        <Building2 className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {job.category && (
                            <span className="rounded-full bg-auth-primary/7 px-2.5 py-1 text-[0.68rem] font-semibold text-auth-primary">
                              {job.category.name}
                            </span>
                          )}
                          {job.isUrgent && (
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[0.68rem] font-semibold text-amber-800 dark:text-amber-200">
                              {t('urgent')}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-auth-foreground transition-colors group-hover:text-auth-primary sm:text-xl">
                          {job.title}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-auth-muted">
                          <span>{job.employer.businessName ?? t('verifiedEmployer')}</span>
                          {job.employer.verificationStatus === 'VERIFIED' && (
                            <BadgeCheck
                              className="size-4 text-auth-primary"
                              aria-label={t('verifiedEmployer')}
                            />
                          )}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 text-auth-muted transition-all group-hover:translate-x-1 group-hover:text-auth-primary"
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-5 flex items-center gap-2 text-sm text-auth-muted">
                      <MapPin className="size-4 shrink-0 text-auth-primary" aria-hidden="true" />
                      {[job.cityName, job.stateName].filter(Boolean).join(', ') ||
                        t('locationUnspecified')}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-auth-border bg-auth-canvas/60 px-2.5 py-1.5 text-xs font-medium text-auth-muted">
                        {t(`employmentTypes.${job.employmentType}`)}
                      </span>
                      <span className="rounded-lg border border-auth-border bg-auth-canvas/60 px-2.5 py-1.5 text-xs font-medium text-auth-muted">
                        {detailT(`workModes.${job.workMode}`)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-auth-border/70 pt-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold tracking-wide text-auth-muted uppercase">
                          {detailT('salary')}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-auth-foreground">{salary}</p>
                      </div>
                      <span className="text-xs font-semibold text-auth-primary">
                        {t('viewDetails')}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {initialResult.pageInfo.hasNextPage && (
          <div className="mt-7 flex justify-center">
            <Link
              href={`?${nextParams.toString()}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-auth-border bg-auth-surface px-5 text-sm font-semibold text-auth-foreground shadow-sm transition hover:border-auth-primary/25 hover:bg-auth-canvas"
            >
              {t('next')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
