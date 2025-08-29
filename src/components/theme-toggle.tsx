'use client';

import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <IconSun className="h-4 w-4" />;
      case 'dark':
        return <IconMoon className="h-4 w-4" />;
      case 'system':
      default:
        return <IconSettings className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="h-8 w-8"
      aria-label="Toggle theme"
    >
      {getThemeIcon()}
    </Button>
  );
}