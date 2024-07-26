'use client';
import React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardTabsManager({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="relative z-10 p-6">
      <Tabs defaultValue={tab ? tab : 'current'} onValueChange={handleTab}>
        <TabsList>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="next">Next</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
