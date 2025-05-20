import { useTheme } from 'next-themes';

import { META_THEME_COLORS } from '@/config/constants';
import { useCallback, useMemo } from 'react';

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = useMemo(() => {
    return resolvedTheme !== 'dark' ? META_THEME_COLORS.light : META_THEME_COLORS.dark;
  }, [resolvedTheme]);

  const setMetaColor = useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, []);

  return {
    metaColor,
    setMetaColor,
  };
}
