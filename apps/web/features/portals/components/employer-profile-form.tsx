'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Globe2, LoaderCircle, Save } from 'lucide-react';
import type { EmployerProfileResponse, EmployerProfileUpdate } from '@repo/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileField, profileInputClass, profileTextAreaClass } from './profile-fields';
import { completeEmployerProfileAction, saveEmployerProfileAction } from '../portal-actions';

const types = [
  'COMPANY',
  'SMALL_BUSINESS',
  'SHOP',
  'FACTORY',
  'RESTAURANT',
  'CONTRACTOR',
  'NON_PROFIT',
  'HOUSEHOLD',
  'INDIVIDUAL',
  'OTHER',
];

export function EmployerProfileForm({ profile }: { profile: EmployerProfileResponse }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? '').trim();
    const result = await saveEmployerProfileAction({
      businessName: text('businessName'),
      employerType: text('employerType') as NonNullable<EmployerProfileUpdate['employerType']>,
      contactPersonName: text('contactPersonName'),
      businessPhone: text('businessPhone'),
      stateName: text('stateName'),
      cityName: text('cityName'),
      businessDescription: text('businessDescription') || null,
      addressLine: text('addressLine') || null,
      websiteUrl: text('websiteUrl') || null,
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
    const result = await completeEmployerProfileAction();
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
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-lg">Business details</CardTitle>
              <CardDescription className="mt-1">
                Share the information candidates need to recognize your organization.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 px-6 py-6 md:grid-cols-2">
          <ProfileField label="Business name">
            <input
              className={profileInputClass}
              name="businessName"
              required
              maxLength={200}
              defaultValue={profile.businessName ?? ''}
              placeholder="e.g. Northstar Foods"
            />
          </ProfileField>
          <ProfileField label="Organization type">
            <select
              className={profileInputClass}
              name="employerType"
              required
              defaultValue={profile.employerType ?? ''}
            >
              <option value="" disabled>
                Select a type
              </option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type
                    .replaceAll('_', ' ')
                    .toLowerCase()
                    .replace(/^\w/, (s) => s.toUpperCase())}
                </option>
              ))}
            </select>
          </ProfileField>
          <ProfileField label="Contact person">
            <input
              className={profileInputClass}
              name="contactPersonName"
              required
              maxLength={200}
              defaultValue={profile.contactPersonName ?? ''}
              placeholder="Full name"
            />
          </ProfileField>
          <ProfileField label="Business phone">
            <input
              className={profileInputClass}
              name="businessPhone"
              type="tel"
              required
              defaultValue={profile.businessPhone ?? ''}
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
          <div className="md:col-span-2">
            <ProfileField label="Website" hint="Include https:// or http://">
              <div className="relative">
                <Globe2
                  className="absolute top-3.5 left-3 size-4 text-auth-muted"
                  aria-hidden="true"
                />
                <input
                  className={`${profileInputClass} pl-10`}
                  name="websiteUrl"
                  type="url"
                  defaultValue={profile.websiteUrl ?? ''}
                  placeholder="https://example.com"
                />
              </div>
            </ProfileField>
          </div>
          <div className="md:col-span-2">
            <ProfileField label="Business address">
              <input
                className={profileInputClass}
                name="addressLine"
                maxLength={500}
                defaultValue={profile.addressLine ?? ''}
                placeholder="Street, area, or landmark"
              />
            </ProfileField>
          </div>
          <div className="md:col-span-2">
            <ProfileField label="About your business" hint="Up to 2,000 characters">
              <textarea
                className={profileTextAreaClass}
                name="businessDescription"
                maxLength={2000}
                defaultValue={profile.businessDescription ?? ''}
                placeholder="Tell candidates what your organization does."
              />
            </ProfileField>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-auth-border bg-auth-surface shadow-sm">
        <CardHeader className="px-6 pt-5">
          <CardTitle className="text-base">Contact visibility</CardTitle>
          <CardDescription>
            Choose the details shown to people viewing your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
          {[
            ['showEmail', 'Show business email', profile.showEmail],
            ['showPhone', 'Show business phone', profile.showPhone],
          ].map(([name, label, checked]) => (
            <label
              key={String(name)}
              className="flex items-center gap-3 rounded-xl border border-auth-border px-4 py-3 text-sm"
            >
              <input
                type="checkbox"
                name={String(name)}
                defaultChecked={Boolean(checked)}
                className="size-4 accent-auth-primary"
              />
              <span>{String(label)}</span>
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
