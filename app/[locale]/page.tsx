'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Header } from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';
import { VerseDisplay } from '@/components/verse-display';
import { RootAnalysis } from '@/components/root-analysis';
import { ConnectedVerses } from '@/components/connected-verses';
import { ProseCompanion } from '@/components/prose-companion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AgentResponse } from '@/types/acikkuran';

export default function HomePage() {
  const locale = useLocale() as 'tr' | 'en';
  const [response, setResponse] = useState<AgentResponse | null>(null);

  const tabLabels = {
    verse: locale === 'tr' ? 'Ayet' : 'Verse',
    roots: locale === 'tr' ? 'Kökler' : 'Roots',
    connections: locale === 'tr' ? 'Bağlantılar' : 'Connections',
    prose: locale === 'tr' ? 'Tefsir' : 'Prose',
  };

  const highlightedRoots = response?.connections
    .map(c => c.root_latin)
    .filter(Boolean) as string[] ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col gap-6 px-6 py-8 md:px-10">
        <ChatInterface language={locale} onResponse={setResponse} />

        {response && (
          <Tabs defaultValue="verse" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verse">{tabLabels.verse}</TabsTrigger>
              <TabsTrigger value="roots">{tabLabels.roots}</TabsTrigger>
              <TabsTrigger value="connections">{tabLabels.connections}</TabsTrigger>
              <TabsTrigger value="prose">{tabLabels.prose}</TabsTrigger>
            </TabsList>

            <TabsContent value="verse" className="mt-4">
              <VerseDisplay verse={response.anchor} language={locale} />
            </TabsContent>

            <TabsContent value="roots" className="mt-4">
              <RootAnalysis words={response.roots} highlightedRoots={highlightedRoots} />
            </TabsContent>

            <TabsContent value="connections" className="mt-4">
              <ConnectedVerses connections={response.connections} language={locale} />
            </TabsContent>

            <TabsContent value="prose" className="mt-4">
              <ProseCompanion prose={response.prose} language={locale} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
