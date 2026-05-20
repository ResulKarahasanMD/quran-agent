'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-7 w-7 px-0"
      aria-label="Toggle theme"
    >
      <span className="dark:hidden">☀️</span>
      <span className="hidden dark:block">🌙</span>
    </Button>
  );
}
