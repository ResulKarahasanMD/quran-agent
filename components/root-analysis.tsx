'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WordData } from '@/types/acikkuran';

interface RootAnalysisProps {
  words: WordData[];
  highlightedRoots?: string[];
  className?: string;
}

export function RootAnalysis({ words, highlightedRoots = [], className }: RootAnalysisProps) {
  const t = useTranslations('roots');

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right pb-2 pr-3 font-medium text-muted-foreground">
                  {t('word')}
                </th>
                <th className="text-left pb-2 px-3 font-medium text-muted-foreground">
                  {t('root')}
                </th>
                <th className="text-left pb-2 pl-3 font-medium text-muted-foreground">
                  {t('meaning')}
                </th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, i) => {
                const isHighlighted =
                  word.root?.latin !== undefined &&
                  highlightedRoots.includes(word.root.latin);
                return (
                  <tr
                    key={word.id ?? i}
                    className={`border-b last:border-0 ${isHighlighted ? 'bg-primary/5' : ''}`}
                  >
                    <td className="py-2 pr-3 text-right" dir="rtl">
                      <span style={{ fontFamily: 'Amiri, serif', fontSize: '1.1rem' }}>
                        {word.arabic}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {word.root ? (
                        <Badge
                          variant={isHighlighted ? 'default' : 'secondary'}
                          className="font-mono text-xs"
                        >
                          {word.root.latin}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">{t('noRoot')}</span>
                      )}
                    </td>
                    <td className="py-2 pl-3 text-muted-foreground">
                      {word.turkish ?? word.root?.mean ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
