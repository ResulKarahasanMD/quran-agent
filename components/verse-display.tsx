'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { VerseData } from '@/types/acikkuran';

interface VerseDisplayProps {
  verse: VerseData;
  language: 'tr' | 'en';
  className?: string;
}

export function VerseDisplay({ verse, language, className }: VerseDisplayProps) {
  const t = useTranslations('verse');
  const [copied, setCopied] = useState(false);
  const [showTranscription, setShowTranscription] = useState(true);
  const [showSimplified, setShowSimplified] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(verse.verse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transcription = language === 'en' ? verse.transcription_en : verse.transcription;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {verse.surah?.name ?? `Surah ${verse.surah_id}`} — {verse.surah_id}:{verse.verse_number}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{t('title')}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 text-xs"
            >
              {copied ? t('copied') : t('copy')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          dir="rtl"
          className="text-right text-2xl md:text-3xl leading-loose font-arabic text-foreground"
          style={{ fontFamily: 'var(--font-amiri), Amiri, serif', lineHeight: '2.5' }}
        >
          {verse.verse}
        </div>

        <Separator />

        {verse.verse_simplified && (
          <div>
            <button
              onClick={() => setShowSimplified(!showSimplified)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSimplified ? '▼' : '▶'} {t('arabic')} (simplified)
            </button>
            {showSimplified && (
              <div
                dir="rtl"
                className="text-right text-lg mt-2 text-muted-foreground"
                style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}
              >
                {verse.verse_simplified}
              </div>
            )}
          </div>
        )}

        {transcription && (
          <div>
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showTranscription ? '▼' : '▶'} {t('transcription')}
            </button>
            {showTranscription && (
              <p className="text-sm italic text-muted-foreground mt-2">
                {transcription}
              </p>
            )}
          </div>
        )}

        <Separator />

        <div>
          <p className="text-xs text-muted-foreground mb-1">{t('translation')}</p>
          <p className="text-sm leading-relaxed">{verse.translation?.text}</p>
          
          {verse.translation?.footnotes && verse.translation.footnotes.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t('footnotes')}</p>
              {verse.translation.footnotes.map(fn => (
                <p key={fn.id} className="text-xs text-muted-foreground">
                  <sup>{fn.number}</sup> {fn.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
