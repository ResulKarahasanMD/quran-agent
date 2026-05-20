'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const t = useTranslations('app');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 md:px-10">
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">{t('title')}</span>
          <span className="hidden text-xs text-muted-foreground sm:block">{t('subtitle')}</span>
        </div>

        {/* Right side: language toggle + links */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center rounded-md border">
            <Button
              variant={locale === 'tr' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchLocale('tr')}
              className="h-7 rounded-r-none px-3 text-xs"
            >
              TR
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchLocale('en')}
              className="h-7 rounded-l-none px-3 text-xs"
            >
              EN
            </Button>
          </div>

          {/* Attribution link */}
          <a
            href="https://acikkuran.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
          >
            {tNav('attribution')}
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
