import { useEffect } from 'react';

/**
 * Set the browser tab title.
 * @param {string} title
 */
export function usePageTitle(title) {
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || 'CropX';
    document.title = title ? `${title} — ${appName}` : appName;
    return () => {
      document.title = appName;
    };
  }, [title]);
}
