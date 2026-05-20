'use client';

import { Component, type ReactNode } from 'react';
import { useLocale } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorMessage({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry: () => void;
}) {
  const locale = useLocale();
  const isTurkish = locale === 'tr';

  return (
    <>
      <CardHeader>
        <CardTitle className="text-base text-destructive">
          {isTurkish ? 'Bir hata oluştu' : 'Something went wrong'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {isTurkish
            ? 'Uygulamada beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.'
            : 'An unexpected error occurred. Please try again.'}
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          {isTurkish ? 'Tekrar Dene' : 'Try again'}
        </Button>
        {error?.message ? (
          <p className="text-xs text-muted-foreground">
            {isTurkish ? 'Ayrıntılar kaydedildi.' : 'Details have been logged.'}
          </p>
        ) : null}
      </CardContent>
    </>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Card className="border-destructive">
            <ErrorMessage
              error={this.state.error}
              onRetry={() => this.setState({ hasError: false, error: undefined })}
            />
          </Card>
        )
      );
    }

    return this.props.children;
  }
}
