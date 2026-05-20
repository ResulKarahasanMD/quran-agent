'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isTurkish = locale === 'tr';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            {isTurkish ? 'Bir hata oluştu' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isTurkish
              ? 'Servis geçici olarak kullanılamıyor. Lütfen tekrar deneyin.'
              : 'Service temporarily unavailable. Please try again.'}
          </p>
          <Button onClick={reset} variant="outline">
            {isTurkish ? 'Tekrar Dene' : 'Try again'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
