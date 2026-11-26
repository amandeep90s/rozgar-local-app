'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, LoaderCircle, Search, Save, X } from 'lucide-react';
import type { JobSeekerProfileResponse, JobSeekerSkillsResponse } from '@repo/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileField, profileInputClass, profileTextAreaClass } from './profile-fields';
import {
  completeJobSeekerProfileAction,
  saveJobSeekerProfileAction,
  searchSkillsAction,
} from '../portal-actions';

const experienceOptions = [
  'NO_EXPERIENCE',
  'ENTRY_LEVEL',
  'LESS_THAN_1_YEAR',
  'ONE_TO_THREE_YEARS',
  'THREE_TO_FIVE_YEARS',
  'FIVE_TO_TEN_YEARS',
  'TEN_PLUS_YEARS',
] as const;

export function JobSeekerProfileForm({
  profile,
  skillCatalog,
}: {
  profile: JobSeekerProfileResponse;
  skillCatalog: JobSeekerSkillsResponse;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(profile.skills);
  const [skills, setSkills] = useState(skillCatalog.items);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(
    () => skills.filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase())),
    [search, skills],
  );

  async function findSkills(value: string) {
    setSearch(value);
    if (!value.trim()) return;
    const result = await searchSkillsAction(value);
    if (result.ok)
      setSkills((current) => [
        ...current.filter((item) => selected.some((chosen) => chosen.id === item.id)),
        ...result.data.items,
      ]);
  }

  function toggleSkill(skill: (typeof skills)[number]) {
    setSelected((current) =>
      current.some((item) => item.id === skill.id)
        ? current.filter((item) => item.id !== skill.id)
        : current.length < 50
          ? [...current, skill]
          : current,
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const result = await saveJobSeekerProfileAction({
      fullName: text('fullName'),
      phone: text('phone'),
      stateName: text('stateName'),
      cityName: text('cityName'),
      experienceLevel: text('experienceLevel') as (typeof experienceOptions)[number],
      experienceSummary: text('experienceSummary') || null,
      skillIds: selected.map((skill) => skill.id),
      showEmail: data.get('showEmail') === 'on',
      showPhone: data.get('showPhone') === 'on',
    });
    setMessage(result.ok ? 'Profile saved.' : result.message);
    setBusy(false);
    if (result.ok) router.refresh();
  }

  async function complete() {
    setBusy(true);
    setMessage('');
    const result = await completeJobSeekerProfileAction();
    setMessage(result.ok ? 'Profile marked complete.' : result.message);
    setBusy(false);
    if (result.ok) router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card className="rounded-2xl border-auth-border bg-auth-surface shadow-sm">
        <CardHeader className="border-b border-auth-border/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-auth-primary/10 text-auth-primary">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-lg">Your details</CardTitle>
              <CardDescription className="mt-1">
                Help employers understand your background and what you are looking for.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <ProfileField label="Full name">
            <input
              className={profileInputClass}
              name="fullName"
              required
              maxLength={200}
              defaultValue={profile.fullName ?? ''}
              placeholder="Your full name"
            />
          </ProfileField>
          <ProfileField label="Phone">
            <input
              className={profileInputClass}
              name="phone"
              type="tel"
              required
              defaultValue={profile.phone ?? ''}
              placeholder="+91 98765 43210"
            />
          </ProfileField>
          <ProfileField label="State">
            <input
              className={profileInputClass}
              name="stateName"
              required
              maxLength={100}
              defaultValue={profile.stateName ?? ''}
              placeholder="Punjab"
            />
          </ProfileField>
          <ProfileField label="City">
            <input
              className={profileInputClass}
              name="cityName"
              required
              maxLength={100}
              defaultValue={profile.cityName ?? ''}
              placeholder="Ludhiana"
            />
          </ProfileField>
          <ProfileField label="Experience level">
            <select
              className={profileInputClass}
              name="experienceLevel"
              required
              defaultValue={profile.experienceLevel ?? ''}
            >
              <option value="" disabled>
                Select your experience
              </option>
              {experienceOptions.map((level) => (
                <option key={level} value={level}>
                  {level
                    .replaceAll('_', ' ')
                    .toLowerCase()
                    .replace(/^\w/, (s) => s.toUpperCase())}
                </option>
              ))}
            </select>
          </ProfileField>
          <div className="md:col-span-2">
            <ProfileField label="Experience summary" hint="Up to 2,000 characters">
              <textarea
                className={profileTextAreaClass}
                name="experienceSummary"
                maxLength={2000}
                defaultValue={profile.experienceSummary ?? ''}
                placeholder="Share a short summary of your experience and strengths."
              />
            </ProfileField>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-auth-border bg-auth-surface shadow-sm">
        <CardHeader className="px-6 pt-5">
          <CardTitle className="text-base">Skills</CardTitle>
          <CardDescription>Select up to 50 skills that describe your strengths.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <div className="relative">
            <Search className="absolute top-3.5 left-3 size-4 text-auth-muted" aria-hidden="true" />
            <input
              className={`${profileInputClass} pl-10`}
              value={search}
              onChange={(event) => void findSkills(event.target.value)}
              placeholder="Search skills"
              aria-label="Search skills"
            />
          </div>
          {!!selected.length && (
            <div className="flex flex-wrap gap-2">
              {selected.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-auth-primary/10 px-3 py-1.5 text-xs font-medium text-auth-primary"
                >
                  {skill.name}
                  <button
                    type="button"
                    aria-label={`Remove ${skill.name}`}
                    onClick={() => toggleSkill(skill)}
                    className="rounded-full hover:bg-auth-primary/10"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto rounded-xl border border-auth-border bg-auth-canvas p-3">
            {filtered.length ? (
              filtered.map((skill) => {
                const active = selected.some((item) => item.id === skill.id);
                return (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => toggleSkill(skill)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? 'border-auth-primary bg-auth-primary text-auth-primary-foreground' : 'border-auth-border bg-auth-surface text-auth-muted hover:border-auth-primary/50 hover:text-auth-primary'}`}
                  >
                    {skill.name}
                  </button>
                );
              })
            ) : (
              <p className="p-2 text-sm text-auth-muted">No matching skills found.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-auth-border bg-auth-surface shadow-sm">
        <CardHeader className="px-6 pt-5">
          <CardTitle className="text-base">Contact visibility</CardTitle>
          <CardDescription>
            Choose which details are visible on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
          {[
            { name: 'showEmail', label: 'Show email address', checked: profile.showEmail },
            { name: 'showPhone', label: 'Show phone number', checked: profile.showPhone },
          ].map(({ name, label, checked }) => (
            <label
              key={name}
              className="flex items-center gap-3 rounded-xl border border-auth-border px-4 py-3 text-sm"
            >
              <input
                type="checkbox"
                name={name}
                defaultChecked={checked}
                className="size-4 accent-auth-primary"
              />
              <span>{label}</span>
            </label>
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-auth-muted">
          {message}
        </p>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy} className="rounded-xl">
            {busy ? <LoaderCircle className="animate-spin" /> : <Save />}
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy || Boolean(profile.completedAt)}
            onClick={() => void complete()}
            className="rounded-xl border-auth-border"
          >
            Mark complete
          </Button>
        </div>
      </div>
    </form>
  );
}
