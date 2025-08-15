'use client';
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ToggleTheme() {
  const { setTheme, theme, systemTheme } = useTheme();
  setTheme("light");

  return (
    <Button
      className="size-8 rounded-full"
      // onClick={() => {
      //   {
      //     theme === 'dark'
      //       ? setTheme('light')
      //       : theme === 'light'
      //       ? setTheme('dark')
      //       : systemTheme === 'dark'
      //       ? setTheme('light')
      //       : setTheme('dark');
      //   }
      // }}
    >
      {theme === 'dark' ? (
        <Sun />
      ) : theme === 'light' ? (
        <Moon />
      ) : systemTheme === 'dark' ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  );
}
