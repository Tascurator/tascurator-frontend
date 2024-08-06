'use client';
import React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EditTabsManager = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const pathname = usePathname();
  const router = useRouter();

  const handleTab = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('tab', term);
    } else {
      params.delete('tab');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={tab ? tab : 'Tasks'}
      onValueChange={handleTab}
      className="mt-4 mb-6"
    >
      <TabsList>
        <TabsTrigger value="Tasks">Tasks</TabsTrigger>
        <TabsTrigger value="Schedule">Schedule</TabsTrigger>
        <TabsTrigger value="Tenants">Tenants</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export { EditTabsManager };
