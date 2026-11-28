'use client';

import { useForm, useWatch } from 'react-hook-form';
import { ProfileLocationFields } from '@/features/portals/components/profile-location-fields';

type JobSearchLocationValues = {
  stateName: string;
  cityName: string;
};

export function JobSearchLocationFields({
  initialStateName,
  initialCityName,
}: {
  initialStateName: string;
  initialCityName: string;
}) {
  const form = useForm<JobSearchLocationValues>({
    defaultValues: {
      stateName: initialStateName,
      cityName: initialCityName,
    },
  });
  const stateName = useWatch({ control: form.control, name: 'stateName' });
  const cityName = useWatch({ control: form.control, name: 'cityName' });

  return (
    <>
      <ProfileLocationFields
        control={form.control}
        stateName="stateName"
        cityName="cityName"
        onStateChange={() => form.setValue('cityName', '')}
        busy={false}
      />
      <input type="hidden" name="stateName" value={stateName ?? ''} />
      <input type="hidden" name="cityName" value={cityName ?? ''} />
    </>
  );
}
