'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ConnectionData } from '@/types/acikkuran';

interface ConnectedVersesProps {
  connections: ConnectionData[];
  language: 'tr' | 'en';
  className?: string;
}

export function ConnectedVerses({ connections, className }: ConnectedVersesProps) {
  const t = useTranslations('connections');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (connections.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {connections.map((conn, i) => {
          const isExpanded = expanded.has(i);
          const verse = conn.verse;
          const translation = verse?.translation?.text;

          return (
            <div key={i} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {conn.surah_id}:{conn.verse_number}
                  </Badge>
                  {conn.root_latin && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {conn.root_latin}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(i)}
                  className="h-6 text-xs"
                >
                  {isExpanded ? t('collapse') : t('expand')}
                </Button>
              </div>

              {verse?.verse && (
                <p
                  dir="rtl"
                  className="text-right text-base"
                  style={{ fontFamily: 'Amiri, serif', lineHeight: '2' }}
                >
                  {verse.verse}
                </p>
              )}

              {isExpanded && translation && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground">{translation}</p>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
