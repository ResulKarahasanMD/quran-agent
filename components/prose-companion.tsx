'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { ProseData } from '@/types/acikkuran';

interface ProseCompanionProps {
  prose: ProseData;
  language: 'tr' | 'en';
  className?: string;
}

export function ProseCompanion({ prose, className }: ProseCompanionProps) {
  const t = useTranslations('prose');

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Anchor Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge>1</Badge>
            <h3 className="font-semibold text-sm">{t('anchor')}</h3>
          </div>
          {prose.anchor.arabic && (
            <p
              dir="rtl"
              className="text-right text-lg"
              style={{ fontFamily: 'Amiri, serif', lineHeight: '2' }}
            >
              {prose.anchor.arabic}
            </p>
          )}
          {prose.anchor.translation && (
            <p className="text-sm italic text-muted-foreground">{prose.anchor.translation}</p>
          )}
          <p className="text-sm leading-relaxed">{prose.anchor.explanation}</p>
        </div>

        <Separator />

        {/* Connections Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge>2</Badge>
            <h3 className="font-semibold text-sm">{t('connections')}</h3>
          </div>
          {prose.connections.map((conn, i) => (
            <div key={i} className="pl-4 border-l-2 border-muted space-y-2">
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
              {conn.arabic && (
                <p
                  dir="rtl"
                  className="text-right text-base"
                  style={{ fontFamily: 'Amiri, serif', lineHeight: '2' }}
                >
                  {conn.arabic}
                </p>
              )}
              {conn.translation && (
                <p className="text-sm italic text-muted-foreground">{conn.translation}</p>
              )}
              <p className="text-sm leading-relaxed">{conn.explanation}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Synthesis Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge>3</Badge>
            <h3 className="font-semibold text-sm">{t('synthesis')}</h3>
          </div>
          <p className="text-sm leading-relaxed">{prose.synthesis}</p>
        </div>
      </CardContent>
    </Card>
  );
}
